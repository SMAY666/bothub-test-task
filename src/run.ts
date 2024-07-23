import {pgConnection} from './connections/postgresConnection';
import {startServer} from './server';

export function run() {
    return Promise.all([
        pgConnection.connect(),
    ])
        .then(() => startServer())
        .then(() => console.log('Server is running'));
}
