import {pgConnection} from '../../../connections/postgresConnection';
import {FieldsConfig, ModelInstance} from './types';
import {sqlKeywords} from '../../../constants/sqlKeywords';
import {Row} from 'postgresql-client';
import {Entity} from '../entity';


export class Model<T extends Entity<any, any>> {
    constructor(fields: FieldsConfig<T['attributes']>, name: string) {
        this.fields = fields;
        this.name = name;
    }


    // ----- [ PRIVATE MEMBERS ] ---------------------------------------------------------------------------------------

    private readonly name: string;
    private readonly fields: FieldsConfig<T['attributes']>;

    // ----- [ PRIVATE METHODS ] ---------------------------------------------------------------------------------------

    private returningFields() {
        return '*';
    }

    private createInstance(creationAttributes: T['creationAttributes'], attributes: T['attributes']): ModelInstance<T> {
        const instance = new Entity<T["creationAttributes"], T["attributes"]>(creationAttributes, attributes);
        instance.creationAttributes = creationAttributes;
        instance.attributes = attributes;

        return instance;
    }

    private parseResponse(attributes: T['attributes'], response: Row[]): ModelInstance<T>[] {
        const result: ModelInstance<T>[] = [];
        const creationAttributes: T['creationAttributes'] = {}

        for (const row of response) {
            // @ts-ignore
            row.forEach((value) => {
                Object.keys(attributes).forEach((key) => {
                    if ((key as keyof T['creationAttributes']) in attributes) {
                        creationAttributes[key] = value;
                    }
                })
            });
        }

        const instance = this.createInstance(creationAttributes, attributes);
        result.push(instance);
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
                create table ${this.name} (
                    ${defineFieldsText}
                )
            `);
        } catch (err) {
            throw new Error(JSON.stringify(err));
        }
    }

    public async create(data: T['creationAttributes']) {
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
            const result = this.parseResponse(this.fields, queryResult.rows);

            if (Array.isArray(result)) {
                return result[0];
            }
            return result;
        } catch (err) {
            throw new Error(JSON.stringify(err))
        }
    }

    public async delete(id: number) {
        try {
            const queryString = `delete from public.${this.name} where id=${id}`;
            await pgConnection.query(queryString);
            return;
        } catch (err) {
            throw new Error(JSON.stringify(err));
        }
    }
}
