import {pgConnection} from '../../connections/postgresConnection';
import {fieldsConfig, PostgresTypes} from './types';


export class Model {
    constructor(fields: fieldsConfig, name: string) {
        this.fields = fields;
        this.name = name;
    }

    private readonly name: string;
    private readonly fields: fieldsConfig;

    async create() {
        try {
            let defineFieldsText = '';

            Object.keys(this.fields).forEach((key, index) => {
                const field = this.fields[key];
                const fieldDefine = `
                    ${key} ${field.autoincrement ? 'serial' : field.type} ${field.primaryKey ? 'PRIMARY KEY' : ''} ${field.allowNull ? '' : 'NOT NULL'} ${index !== Object.keys(this.fields).length - 1 ? ',' : ''}`;
                defineFieldsText += fieldDefine;
            });

            console.log(defineFieldsText);

            await pgConnection.query(`
                create table ${this.name} (
                    ${defineFieldsText}
                )
            `);
        } catch (err) {
            console.log(err);
           throw new Error(JSON.stringify(err));
        }
    }
}
