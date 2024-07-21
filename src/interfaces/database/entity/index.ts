export class Entity<CreationAttributes, Attributes> {
    constructor(
        creationAttributes: CreationAttributes,
        attributes: Attributes,
    ) {
        this.creationAttributes = creationAttributes;
        this.attributes = attributes;
    }
    public creationAttributes: CreationAttributes
    public attributes: Attributes

    public drop() {

    }
}
