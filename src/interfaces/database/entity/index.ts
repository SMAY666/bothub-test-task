import {pgConnection} from '../../../connections/postgresConnection';

export class Entity<CreationAttributes extends object, Attributes extends object> {
    constructor(
        attributes: Attributes,
        tableName: string
    ) {
        this.attributes = attributes;
        this.whereAttributes = attributes;
        this.tableName = tableName;


        Object.keys(this.attributes).forEach((key) => (this as any)[key] = this.attributes[key]);
    }

    public attributes: Attributes;
    public whereAttributes: Partial<Attributes>
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
