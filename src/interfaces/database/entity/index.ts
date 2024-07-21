export class Entity<CreationAttributes extends object, Attributes extends object> {
    constructor(
        creationAttributes: CreationAttributes,
        attributes: Attributes,
    ) {
        this.creationAttributes = creationAttributes;
        this.attributes = attributes;

        Object.keys(this.creationAttributes).forEach((key) => (this as any)[key] = this.creationAttributes[key]);
    }
    public creationAttributes: CreationAttributes;
    public attributes: Attributes;

    [key: string]: any;

    public async drop() {
        console.log('Drop function is called');
    }
}
