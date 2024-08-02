import {BookCreationAttributes, BookInstance, BookUpdateAttributes} from '../model/type';
import {BookModel} from '../model';

class BookRepository {

    // ----- [ PUBLIC METHODS ] ----------------------------------------------------------------------------------------

    public async getAll(): Promise<BookInstance[]> {
        return await BookModel.findAll();
    }

    public async getById(id: number): Promise<BookInstance> {
        const book = await BookModel.findById(id);
        if (!book) {
            throw new Error('Book not found');
        }

        return book;
    }

    public async create(data: BookCreationAttributes): Promise<BookInstance> {
        return await BookModel.create(data);
    }

    public async update(id: number, data: BookUpdateAttributes): Promise<BookInstance> {
        const book = await this.getById(id);
        return await book.update(data);
    }

    public async delete(id: number): Promise<void> {
        const book = await this.getById(id);
        return await book.destroy();
    }
}

export const bookRepository = new BookRepository();
