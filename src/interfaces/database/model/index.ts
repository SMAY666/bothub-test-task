import {pgConnection} from '../../../connections/postgresConnection';
import {FieldsConfig, GetAllOptions, WhereOption} from './types';
import {sqlKeywords} from '../../../constants/sqlKeywords';
import {QueryResult} from 'postgresql-client';
import {Entity} from '../entity';


export class Model<T extends Entity<any, any>> {
    constructor(fields: FieldsConfig<T['_dataValues']>, name: string) {
        this.fields = fields;
        this.name = name;
    }


    // ----- [ PRIVATE MEMBERS ] ---------------------------------------------------------------------------------------

    private readonly name: string;
    private readonly fields: FieldsConfig<T['_dataValues']>;

    // ----- [ PRIVATE METHODS ] ---------------------------------------------------------------------------------------

    private returningFields(): string {
        return '*';
    }

    private concatQueryConditions(where: WhereOption<Partial<T['_dataValues']>>) {
        const whereElements: string[] = [];
        Object.keys(where).forEach((key) => {
            let finalString = sqlKeywords.includes(key) ? `"${key}"` : key;
            if (where[key] === null) {
                finalString += ' is null';
            } else if (typeof where[key] === 'string') {
                finalString += `='${where[key]}'`;
            } else if (Array.isArray(where[key])) {
                // @ts-ignore
                finalString += ' ' + where[key].join(' ');
            } else {
                finalString += `=${where[key]}`;
            }
            whereElements.push(finalString);
        });
        return whereElements;
    }

    private createInstance(attributes: T['_dataValues']): T {
        const instance = new Entity<T["creationAttributes"], T["_dataValues"]>(attributes, this.name);
        instance._dataValues = attributes;

        return instance as T;
    }

    private parseResponse(fields: T['_dataValues'], response: QueryResult): T[] {
        const result: T[] = [];
        if (!response || !response.rows) {
            throw new Error('Response parsing failed');
        }
        for (const row of response.rows) {
            const attributes: T['_dataValues'] = {};

            Object.keys(fields).forEach((key, index) => {
                attributes[key] = row[index];
            });
            const instance = this.createInstance(attributes);
            result.push(instance);
        }

        return result;
    }


    // ----- [ PUBLIC METHODS ] ----------------------------------------------------------------------------------------

    public async createTable() {
        try {
            let defineFieldsText = '';

            Object.keys(this.fields).forEach((key, index) => {
                const field = this.fields[key];
                const fieldDefine = `
                    ${key} ${field.autoincrement ? 'serial' : field.type} ${field.primaryKey ? 'PRIMARY KEY' : ''} ${field.allowNull ? '' : 'NOT NULL'} ${index !== Object.keys(this.fields).length - 1 ? ',' : ''}`;
                defineFieldsText += fieldDefine;
            });

            await pgConnection.query(`
                create table if not exists ${this.name} (
                    ${defineFieldsText}
                )
            `);
        } catch (err) {
            throw new Error(JSON.stringify(err));
        }
    }

    public async create(data: T['creationAttributes']): Promise<T> {
        try {
            let queryString = `insert into public.${this.name} (`;
            const formatKeys = Object.keys(data).map((key) => sqlKeywords.includes(key) ? `"${key}"` : key);
            queryString += formatKeys.join(', ') + ')\n';

            const values = Object.keys(data).map((key) => `'${data[key]}'`);
            queryString += 'values (' + values.join(', ') + ')\n';
            queryString += `returning ${this.returningFields()};`;

            const queryResult = await pgConnection.query(queryString);
            if (!queryResult.rows) {
                throw new Error('Что-то пошло не так');
            }
            const result = this.parseResponse(this.fields, queryResult);

            if (Array.isArray(result)) {
                return result[0];
            }
            return result;
        } catch (err) {
            throw new Error(JSON.stringify(err));
        }
    }

    public async findOne(options: GetAllOptions<Partial<T['_dataValues']>>): Promise<T | null> {
        const result = await this.findAll(options);
        if (result.length === 0) {
            return null
        }

        return result[0];
    }

    public async findById(id: number): Promise<T | null> {
        const queryString = `select * from public.${this.name} where id=${id}`;

        const queryResponse = await pgConnection.query(queryString);

        if (!queryResponse.rows || queryResponse.rows.length === 0) {
            return null;
        }

        return this.parseResponse(this.fields, queryResponse)[0];
    }

    public async findAll(options?: GetAllOptions<Partial<T['_dataValues']>>): Promise<T[]> {
        try {
            if (!options) {
                const queryResult = await pgConnection.query(`select * from public.${this.name}`);

                if (!queryResult.rows) {
                    throw new Error('Что-то пошло не так');
                }
                return this.parseResponse(this.fields, queryResult);
            }
            const where = options.where;

            const attributes: string[] | undefined = options.attributes;
            const formatAttributes = attributes && attributes.length > 0 ? attributes.map((attribute) => {
                return sqlKeywords.includes(attribute) ? `"${attribute}"` : attribute;
            }) : undefined;

            let queryString = `select ${formatAttributes ? formatAttributes.join(', ') : '*'} from public.${this.name}`;

            if (where && !Array.isArray(where)) {
                queryString += ` where ${this.concatQueryConditions(where).join(' and ')}`;
            } else if (where && Array.isArray(where)) {
                const whereElements = [];
                // @ts-ignore
                where.forEach((condition) => {
                    // @ts-ignore
                    whereElements.push(`(${this.concatQueryConditions(condition).join(' and ')})`);
                });
                queryString += ` where ${whereElements.join(' or ')}`;
            }

            const queryResult = await pgConnection.query(queryString);

            if (!queryResult.rows) {
                throw new Error('Что-то пошло не так');
            }

            return this.parseResponse(this.fields, queryResult);
        } catch (err) {
            throw new Error(JSON.stringify(err));
        }
    }
}
