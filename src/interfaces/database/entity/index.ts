import {pgConnection} from '../../../connections/postgresConnection';

export class Entity<CreationAttributes extends object, Attributes extends object> {
    constructor(
        creationAttributes: CreationAttributes,
        attributes: Attributes,
        tableName: string
    ) {
        this.creationAttributes = creationAttributes;
        this.attributes = attributes;
        this.tableName = tableName;

        Object.keys(this.creationAttributes).forEach((key) => (this as any)[key] = this.creationAttributes[key]);
    }
    public creationAttributes: CreationAttributes;
    public attributes: Attributes;
    public tableName: string;

    [key: string]: any;

    public async destroy() {
        try {
            const queryString = `delete from public.${this.tableName} where id=${this.id}`;
            await pgConnection.query(queryString);
            return;
        } catch (err) {
            throw new Error(JSON.stringify(err));
        }
    }
}
