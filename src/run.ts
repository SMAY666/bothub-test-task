import {pgConnection} from './connections/postgresConnection';
import {checkMainAdmin, startServer} from './server';
import {UserModel} from './modules/users/model';
import {redisConnection} from './connections/redisConnection';


export function run() {
    return Promise.all([
        pgConnection.connect(),
        redisConnection.connect(),
        checkMainAdmin(),
    ])
        .then(() => startServer()
            .then(() => console.log('Server is running')))
        .catch((err) => console.log(err));
}
