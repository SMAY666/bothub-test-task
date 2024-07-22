import {Entity} from '../entity';

export enum PostgresTypes  {
    INT8 = 'int8',
    STRING = 'varchar(255)',
    BOOL = 'bool'
}

export type FieldsConfig<T> = {
    [K in keyof T]: {
        primaryKey?: boolean
        type: PostgresTypes
        allowNull: boolean
        autoincrement?: boolean
    }
};

export type ModelInstance<T extends {
    creationAttributes: object,
    attributes: object
}> = Entity<T['creationAttributes'], T['attributes']>;


export type WhereOption<T> = {
    [K in keyof T]: T[K] | null
}

export type GetAllOptions<T> = {
    where?: WhereOption<T> | WhereOption<T>[],
    attributes?: string[];
}
