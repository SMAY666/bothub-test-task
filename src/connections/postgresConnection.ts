import {
    Connection,
    ConnectionConfiguration,
    Pool,
    PoolConfiguration,
    QueryOptions
} from 'postgresql-client';

import {ENV} from '../constants/env';
import {Model} from '../interfaces/database/model';
import {Entity} from '../interfaces/database/entity';
import {FieldsConfig} from '../interfaces/database/model/types';


class PostgresConnection {
    constructor(type: 'Connection' | 'Pool', config: ConnectionConfiguration | PoolConfiguration | string) {
        this.type = type;
        this.config = config;

        this.connection = this.type === 'Connection' ? new Connection(config) : new Pool(config);
        this.models = [];
    }


    // ----- [ PRIVATE MEMBERS ] ---------------------------------------------------------------------------------------

    private readonly type: 'Connection' | 'Pool';
    private readonly config: ConnectionConfiguration | PoolConfiguration | string;
    private readonly connection: Connection | Pool;
    private readonly models: Model<Entity<any, any>>[];


    // ----- [ PUBLIC METHODS ] ----------------------------------------------------------------------------------------

    public async connect(): Promise<void> {
        try {
            if (this.connection instanceof Connection) {
                return this.connection.connect();
            }
            console.log('[postgres]: Connection established');

            this.models.forEach((model) => model.createTable());
        } catch (err) {
            throw new Error(JSON.stringify(err));
        }
    }

    public async query(sql: string, options?: QueryOptions) {
        return await this.connection.query(sql, options)
    }

    public define<T extends Entity<any, any>>(fields: FieldsConfig<T['_dataValues']>, name: string): Model<T> {
        const newModel = new Model<T>(fields, name);
        this.models.push(newModel);

        return newModel;
    }
}

export const pgConnection = new PostgresConnection('Pool', {
    host: ENV.HOST,
    port: ENV.DB_PORT,
    user: ENV.DB_USER,
    password: ENV.DB_PASSWORD,
    database: ENV.DB_NAME,
    min: 1,
    max: 10,
    idleTimeoutMillis: 10000,
});
