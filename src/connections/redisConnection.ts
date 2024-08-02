import {createClient} from 'redis';
import {ENV} from '../constants/env';

class RedisConnection {
    constructor() {
        this.connection = createClient({
            socket: {
                host: ENV.REDIS_HOST,
                port: ENV.REDIS_PORT
            },
            name: 'bothub',
        });
    }

    // ----- [ PRIVATE MEMBERS ] ---------------------------------------------------------------------------------------

    private readonly connection: ReturnType<typeof createClient>


    // ----- [ PUBLIC METHODS ] ----------------------------------------------------------------------------------------

    public connect(): Promise<void> {
        return this.connection.connect()
            .then(() => console.log('[redis] Connection successfully established'))
            .catch((error) => {
               console.log(`[redis] Failed to establish connection: ${error}`);
                throw error;
            });
    }

    public get(key: string): ReturnType<typeof this.connection.get> {
        return this.connection.get(key);
    }

    public set(key: string, value: string): ReturnType<typeof this.connection.set> {
        return this.connection.set(key, value);
    }

    public setEx(key: string, seconds: number, value: string): ReturnType<typeof this.connection.setEx> {
        return this.connection.setEx(key, seconds, value);
    }

    public del(key: string): ReturnType<typeof this.connection.del> {
        return this.connection.del(key);
    }
}

export const redisConnection = new RedisConnection();
