import {BookAttributes, BookCreationAttributes, BookUpdateAttributes} from '../../modules/books/model/type';


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

export type UpdateRequest = {
    Params: {
        id: number,
    }
    Body: Omit<BookUpdateAttributes, 'genres'> & {
        genres?: string[],
    }
    Reply: BookAttributes
}

export type DeleteRequest = {
    Params: {
        id: number
    }
    Reply: void
}
