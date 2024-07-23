import {pgConnection} from '../../../connections/postgresConnection';

export class Entity<CreationAttributes extends object, Attributes extends object> {
    constructor(
        attributes: Attributes,
        tableName: string
    ) {
        this.dataValues = attributes;
        this.tableName = tableName;


        Object.keys(this.dataValues).forEach((key) => (this as any)[key] = this.dataValues[key]);
    }

    public dataValues: Attributes;
    public tableName: string;

    [key: string]: any;

    public async destroy(): Promise<void> {
        try {
            const queryString = `delete from public.${this.tableName} where id=${this.id}`;
            await pgConnection.query(queryString);
            return;
        } catch (err) {
            throw new Error(JSON.stringify(err));
        }
    }
}
