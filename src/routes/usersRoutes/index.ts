import {FastifyPluginCallback} from 'fastify';
import {controller} from './controller';
import {GetMeRequest, GetRequest, LoginRequest, RegisterRequest, UpdateRoleRequest} from './types';

const SCHEMAS = [
    {
        $id: "userOutput",
        type: 'object',
        properties: {
            id: {
                $ref: 'id'
            },
            username: {
                type: 'string',
            },
            email: {
                type: 'string',
            },
            role: {
                type: 'number',
            },
        }
    }
]

export const usersRoutes: FastifyPluginCallback = (instance, opts, done) => {
    SCHEMAS.forEach((schema) => instance.addSchema(schema));
    instance.post<RegisterRequest>(
        '/register',
        {
            schema: {
                body: {
                    type: 'object',
                    properties: {
                        data: {
                            type: 'object',
                            properties: {
                                username: {
                                    type: 'string',
                                    minLength: 1,
                                },
                                email: {
                                    type: 'string',
                                    minLength: 1,
                                }
                            }
                        },
                        password: {
                            type: 'string',
                            minLength: 6,
                        },
                        confirmPassword: {
                            type: 'string',
                        }
                    }
                },
                response: {
                    201: {
                        $ref: 'userOutput'
                    }
                }
            }
        },
        controller.register,
    )

    instance.post<LoginRequest>(
        '/login',
        {
            schema: {
                body: {
                    properties: {
                        username: {
                            type: 'string',
                            minLength: 1,
                        },
                        password: {
                            type: 'string',
                            minLength: 6,
                        }
                    }
                },
                response: {
                  200: {
                      type: 'object',
                      properties: {
                          accessToken: {
                              type: 'string',
                          }
                      }
                  }
                }
            }
        },
        controller.login,
    )

    instance.get<GetMeRequest>(
        '/me',
        {
            onRequest: instance.verifyJwt,
            schema: {
                response: {
                    200: {
                        $ref: 'userOutput'
                    }
                }
            }
        },
        controller.getMe,
    )

    instance.put<UpdateRoleRequest>(
        '/:id/role',
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
                },
                body: {
                    type: 'object',
                    properties: {
                        role: {
                            type: 'integer'
                        }
                    }
                },
                response: {
                    200: {
                        $ref: 'userOutput',
                    }
                }
            }
        },
        controller.changeRole,
    )
    done();
};
