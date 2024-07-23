import {pgConnection} from '../../../connections/postgresConnection';
import {sqlKeywords} from '../../../constants/sqlKeywords';
import {QueryResult} from 'postgresql-client';

export class Entity<CreationAttributes extends object, Attributes extends object> {
    constructor(
        attributes: Attributes,
        tableName: string
    ) {
        this._dataValues = attributes;
        this.tableName = tableName;


        Object.keys(this._dataValues).forEach((key) => (this as any)[key] = this._dataValues[key]);
    }

    public _dataValues: Attributes;
    private readonly tableName: string;

    [key: string]: any;


    public async destroy(): Promise<void> {
        try {
            const queryString = `delete from public.${this.tableName} where id=${this.id}`;
            await pgConnection.query(queryString);
        } catch (err) {
            throw new Error(JSON.stringify(err));
        }
    }

    public async update(data: Partial<Omit<Attributes, 'id'>>): Promise<this> {
        try {
            const updatingFields: string[] = Object.keys(data).map((key) => {
                let field: string;
                let value: string | null | boolean;

                if (sqlKeywords.includes(key)) {
                    field = `"${key}"`
                } else {
                    field = key;
                }
                if (typeof data[key] === 'string') {
                    value = `'${data[key]}'`
                } else  {
                    value = data[key];
                }
                return `${field}=${value}`;
            });

            let queryString = `update ${this.tableName} set ${updatingFields.join(', ')} where id=${this.id}`;
            const queryResult = await pgConnection.query(queryString);

            if (queryResult) {
                this._dataValues = {...this._dataValues, ...data};
            }
            return this;
        } catch (err) {
            throw new Error(JSON.stringify(err));
        }
    }
}
