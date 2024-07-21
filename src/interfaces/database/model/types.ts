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
