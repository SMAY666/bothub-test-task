import {BookAttributes, BookCreationAttributes} from '../../modules/books/model/type';


export type GetAllRequest = {
    Reply: BookAttributes[]
}

export type GetByIdRequest = {
    Params: {
        id: number
    },
    Reply: BookAttributes
}

export type CreateRequest = {
    Body: Omit<BookCreationAttributes, 'genres'> & {
        genres: string[],
    }
    Reply: BookAttributes
}
