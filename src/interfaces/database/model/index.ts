import {pgConnection} from '../../../connections/postgresConnection';
import {FieldsConfig} from './types';
import {sqlKeywords} from '../../../constants/sqlKeywords';
import {Row} from 'postgresql-client';
import {ModelInstance} from '../entity';


export class Model<T extends ModelInstance<any, any>> {
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

    private createInstance(creationAttributes: T['creationAttributes'], attributes: T['attributes']): T {
        const instance: ModelInstance<T['creationAttributes'], T['attributes']>;
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

    public create(data: T['creationAttributes'])  {
        return new Promise(async (resolve, reject) => {
            try {
                let queryString = `insert into public.${this.name} (`;
                const formatKeys = Object.keys(data).map((key) => sqlKeywords.includes(key) ? `"${key}"` : key);
                queryString += formatKeys.join(', ') + ')\n';

                const values = Object.keys(data).map((key) => `'${data[key]}'`);
                queryString += 'values (' + values.join(', ') + ')';
                queryString += `returning ${this.returningFields()};`;

                const queryResult = await pgConnection.query(queryString);
                const result = this.formatFields<FieldsConfig<T['attributes']>>(this.fields, queryResult.rows);

                if (Array.isArray(result)) {
                    resolve(result[0].attributes);
                }
                resolve(result);
            } catch (err) {
                reject(Error(JSON.stringify(err)))
            }
        });
    }

    public async delete(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const queryString = `delete from public.${this.name} where id=${id}`;
                await pgConnection.query(queryString);
                resolve();
            } catch (err) {
                reject(Error(JSON.stringify(err)));
            }
        });
    }
}

/*let entity: {
    creationAttributes: T['creationAttributes']
    attributes?: T['attributes']
} = {creationAttributes: {}, attributes: {}};*/
