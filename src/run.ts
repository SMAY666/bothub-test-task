import {pgConnection} from './connections/postgresConnection';
import {checkMainAdmin, startServer} from './server';
import {UserModel} from './modules/users/model';


export function run() {
    return Promise.all([
        pgConnection.connect(),
        checkMainAdmin(),
    ])
        .then(() => startServer()
            .then(() => console.log('Server is running')))
        .catch((err) => console.log(err));
}
