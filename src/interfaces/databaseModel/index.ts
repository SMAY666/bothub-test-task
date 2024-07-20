import {pgConnection} from '../../connections/postgresConnection';
import {FieldsConfig, ModelInstance} from './types';
import {sqlKeywords} from '../../constants/sqlKeywords';
import {Row} from 'postgresql-client';


export class Model<T extends ModelInstance<any, any>> {
    constructor(fields: FieldsConfig<T['Attributes']>, name: string) {
        this.fields = fields;
        this.name = name;
    }


    // ----- [ PRIVATE MEMBERS ] ---------------------------------------------------------------------------------------

    private readonly name: string;
    private readonly fields: FieldsConfig<T['Attributes']>;


    // ----- [ PRIVATE METHODS ] ---------------------------------------------------------------------------------------

    private returningFields() {
        return '*';
    }

    private formatReturningFields<T extends object>(attributes: T, rows: Row[] | undefined): T | T[] | {} {
        if (!rows || rows.length === 0) {
            return {};
        }

        // @ts-ignore
        const result = [];

        for (const row of rows) {
            const entity = {};
            // @ts-ignore
            row.forEach((value, index) => {
                // @ts-ignore
                entity[Object.keys(attributes)[index]] = value;
            });
            result.push(entity);
        }

        // @ts-ignore
        return result;
    }


    // ----- [ PUBLIC METHODS ] ----------------------------------------------------------------------------------------

    async createTable() {
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

    create(data: T['CreationsAttributes'])  {
        return new Promise(async (resolve, reject) => {
            try {
                let queryString = `insert into public.${this.name} (`;
                const formatKeys = Object.keys(data).map((key) => sqlKeywords.includes(key) ? `"${key}"` : key);
                queryString += formatKeys.join(', ') + ')\n';

                const values = Object.keys(data).map((key) => `'${data[key]}'`);
                queryString += 'values (' + values.join(', ') + ')';
                queryString += `returning ${this.returningFields()};`;

                const queryResult = await pgConnection.query(queryString);
                const result = this.formatReturningFields<FieldsConfig<T['Attributes']>>(this.fields, queryResult.rows);

                if (Array.isArray(result)) {
                    resolve(result[0]);
                }
                resolve(result);
            } catch (err) {
                reject(Error(JSON.stringify(err)))
            }
        });
    }
}
