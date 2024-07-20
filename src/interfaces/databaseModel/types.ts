export enum PostgresTypes  {
    INT8 = 'int8',
    STRING = 'varchar(255)',
    BOOL = 'bool'
}

export type fieldsConfig = Record<string, {
    primaryKey?: boolean,
    type: PostgresTypes,
    allowNull: boolean,
    autoincrement?: boolean,
}>;
