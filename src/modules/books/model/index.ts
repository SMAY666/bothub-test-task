import {pgConnection} from '../../../connections/postgresConnection';
import {BookInstance} from './type';
import {PostgresTypes} from '../../../interfaces/database/model/types';

export const BookModel = pgConnection.define<BookInstance>({
    id: {
        primaryKey: true,
        type: PostgresTypes.INT8,
        autoincrement: true,
        allowNull: false,
    },
    title: {
        type: PostgresTypes.STRING,
        allowNull: false,
    },
    author: {
        type: PostgresTypes.STRING,
        allowNull: false,
    },
    publicationDate: {
        type: PostgresTypes.TIMESTAMP,
        allowNull: false,
    },
    genres: {
        type: PostgresTypes.STRING,
        allowNull: false,
    },
}, 'books');
