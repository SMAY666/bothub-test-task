import {
    Connection,
    ConnectionConfiguration,
    Pool,
    PoolConfiguration,
    QueryOptions
} from 'postgresql-client';

import {ENV} from '../constants/env';


class PostgresConnection {
    constructor(type: 'Connection' | 'Pool', config: ConnectionConfiguration | PoolConfiguration | string) {
        this.type = type;
        this.config = config;

        this.connection = this.type === 'Connection' ? new Connection(config) : new Pool(config)
    }


// ----- [ PRIVATE MEMBERS ] -------------------------------------------------------------------------------------------

    private readonly type: 'Connection' | 'Pool';
    private readonly config: ConnectionConfiguration | PoolConfiguration | string;
    private readonly connection: Connection | Pool;


// ----- [ PUBLIC METHODS ] --------------------------------------------------------------------------------------------

    public async connect(): Promise<void> {
       if (this.connection instanceof Connection) {
           return this.connection.connect();
       }
    }

    public async query(sql: string, options?: QueryOptions) {
        return await this.connection.query(sql, options)
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
