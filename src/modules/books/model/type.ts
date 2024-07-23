import {ModelInstance} from '../../../interfaces/database/model/types';

export type BookAttributes = {
    id: number
    title: string
    author: string
    publicationDate: Date
    genres: string
}

export type BookCreationAttributes = Omit<BookAttributes, 'id'>;
export type BookUpdateAttributes = Partial<BookCreationAttributes>;

export type BookInstance = ModelInstance<{creationAttributes: BookCreationAttributes, attributes: BookAttributes}>;
