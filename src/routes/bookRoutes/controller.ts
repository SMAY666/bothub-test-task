import {RouteHandler} from 'fastify';
import {bookRepository} from '../../modules/books/repository';
import {
    CreateRequest,
    GetAllRequest,
    GetByIdRequest
} from './types';
import {BookCreationAttributes} from '../../modules/books/model/type';


class Controller {
    public getAll: RouteHandler<GetAllRequest> = async (req, reply) => {
        const books = await bookRepository.getAll();

        reply
            .status(200)
            .send(books.map(({_dataValues}) => _dataValues));
    }

    public getById: RouteHandler<GetByIdRequest> = async (req, reply) => {
        const book = await bookRepository.getById(req.params.id);

        reply
            .status(200)
            .send(book._dataValues);
    }

    public create: RouteHandler<CreateRequest> = async (req, reply) => {
        const book = await bookRepository.create({...req.body, genres: JSON.stringify(req.body.genres)});

        reply
            .status(201)
            .send(book._dataValues);
    }
}

export const controller = new Controller();
