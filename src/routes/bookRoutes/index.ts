import {FastifyPluginCallback} from 'fastify';
import {
    CreateRequest,
    GetAllRequest,
    GetByIdRequest,
    UpdateRequest,
    DeleteRequest,
} from './types';
import {controller} from './controller';

const SCHEMAS = [
    {
        $id: 'bookInput',
        type: 'object',
        properties: {
            title: {
                type: 'string',
            },
            author: {
                type: 'string',
            },
            publicationDate: {
                type: 'string',
                minLength: 1,
            },
            genres: {
                type: 'array',
                items: {
                    type: 'string',
                    minLength: 1,
                }
            }
        }
    },
    {
        $id: 'bookOutput',
        type: 'object',
        required: ['id', 'title', 'author', 'publicationDate', 'genres'],
        properties: {
            id: {
                $ref: 'id',
            },
            title: {
                type: 'string',
            },
            author: {
                type: 'string',
            },
            publicationDate: {
                $ref: 'date',
            },
            genres: {
                type: 'string',
            }
        }
    }
]
export const bookRoutes: FastifyPluginCallback = (instance, opts, done) => {
    SCHEMAS.forEach((schema) => instance.addSchema(schema));
    instance.get<GetAllRequest>(
        '/',
        {
            schema: {
                response: {
                    200: {
                        type: 'array',
                        items: {
                            $ref: 'bookOutput',
                        }
                    }
                }
            }
        },
        controller.getAll,
    )
    instance.get<GetByIdRequest>(
        '/:id',
        {
            schema: {
                params: {
                    type: 'object',
                    properties: {
                        id: {
                            $ref: 'id',
                        }
                    }
                },
                response: {
                    200: {
                        $ref: 'bookOutput'
                    }
                }
            }
        },
        controller.getById,
    )
    instance.post<CreateRequest>(
        '/',
        {
            onRequest: [instance.verifyJwt, instance.verifyAdmin],
            schema: {
                body: {
                    required: ['title', 'author', 'publicationDate', 'genres'],
                    $ref: 'bookInput',
                },
                response: {
                  201: {
                      $ref: 'bookOutput',
                  }
                }
            }
        },
        controller.create,
    )
    instance.put<UpdateRequest>(
        '/:id',
        {
            onRequest: [instance.verifyJwt, instance.verifyAdmin],
            schema: {
                body: {
                    required: ['title', 'author', 'publicationDate', 'genres'],
                    $ref: 'bookInput',
                },
                response: {
                    200: {
                        $ref: 'bookOutput',
                    }
                }
            }
        },
        controller.update,
    )
    instance.delete<DeleteRequest>(
        '/:id',
        {
            onRequest: [instance.verifyJwt, instance.verifyAdmin],
            schema: {
                params: {
                    type: 'object',
                    properties: {
                        id: {
                            $ref: 'id',
                        }
                    }
                }
            }
        },
        controller.delete,
    )
    done();
}
