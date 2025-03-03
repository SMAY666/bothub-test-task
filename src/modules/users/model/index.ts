import {PostgresTypes} from '../../../interfaces/database/model/types';
import {UserInstance} from './types';
import {pgConnection} from '../../../connections/postgresConnection';


export const UserModel = pgConnection.define<UserInstance>({
    id: {
        primaryKey: true,
        type: PostgresTypes.INT8,
        autoincrement: true,
        allowNull: false,
    },
    username: {
        type: PostgresTypes.STRING,
        allowNull: true,
    },
    email: {
        type: PostgresTypes.STRING,
        allowNull: false,
    },
    passwordHash: {
        type: PostgresTypes.STRING,
        allowNull: false,
    },
    role: {
        type: PostgresTypes.INT8,
        allowNull: false,
    }
}, 'users');
