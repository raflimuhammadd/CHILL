/**
 * Genre API paths
 */

const genrePaths = {
  '/api/genres': {
    get: {
      tags: ['Genres'],
      summary: 'Get all genres',
      description: 'Retrieve a list of all available genres',
      operationId: 'getAllGenres',
      responses: {
        200: {
          description: 'Genres retrieved successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/GenreList'
              },
              example: {
                success: true,
                message: 'Genres retrieved successfully',
                data: [
                  {
                    id: 1,
                    name: 'Action',
                    slug: 'action',
                    created_at: '2024-01-01T00:00:00Z',
                    updated_at: '2024-01-01T00:00:00Z'
                  },
                  {
                    id: 2,
                    name: 'Comedy',
                    slug: 'comedy',
                    created_at: '2024-01-01T00:00:00Z',
                    updated_at: '2024-01-01T00:00:00Z'
                  }
                ]
              }
            }
          }
        },
        500: {
          $ref: '#/components/responses/InternalServerError'
        }
      }
    },
    post: {
      tags: ['Genres'],
      summary: 'Create a new genre',
      description: 'Create a new content genre. Slug is auto-generated if not provided.',
      operationId: 'createGenre',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/CreateGenreRequest'
            },
            example: {
              name: 'Thriller',
              slug: 'thriller'
            }
          }
        }
      },
      responses: {
        201: {
          description: 'Genre created successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SuccessResponse'
              },
              example: {
                success: true,
                message: 'Genre created successfully',
                data: {
                  id: 10,
                  name: 'Thriller',
                  slug: 'thriller',
                  created_at: '2024-01-20T15:00:00Z',
                  updated_at: '2024-01-20T15:00:00Z'
                }
              }
            }
          }
        },
        400: {
          $ref: '#/components/responses/BadRequest'
        },
        409: {
          $ref: '#/components/responses/Conflict'
        },
        500: {
          $ref: '#/components/responses/InternalServerError'
        }
      }
    }
  },

  '/api/genres/{id}': {
    get: {
      tags: ['Genres'],
      summary: 'Get genre by ID',
      description: 'Retrieve a specific genre by its ID',
      operationId: 'getGenreById',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: {
            type: 'integer',
            example: 1
          },
          description: 'Genre ID'
        }
      ],
      responses: {
        200: {
          description: 'Genre retrieved successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SuccessResponse'
              },
              example: {
                success: true,
                message: 'Genre retrieved successfully',
                data: {
                  id: 1,
                  name: 'Action',
                  slug: 'action',
                  created_at: '2024-01-01T00:00:00Z',
                  updated_at: '2024-01-01T00:00:00Z'
                }
              }
            }
          }
        },
        404: {
          $ref: '#/components/responses/NotFound'
        },
        500: {
          $ref: '#/components/responses/InternalServerError'
        }
      }
    },
    patch: {
      tags: ['Genres'],
      summary: 'Update genre',
      description: 'Update an existing genre by ID',
      operationId: 'updateGenre',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: {
            type: 'integer',
            example: 1
          },
          description: 'Genre ID'
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/UpdateGenreRequest'
            },
            example: {
              name: 'Action Adventure',
              slug: 'action-adventure'
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Genre updated successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SuccessResponse'
              },
              example: {
                success: true,
                message: 'Genre updated successfully',
                data: {
                  id: 1,
                  name: 'Action Adventure',
                  slug: 'action-adventure',
                  created_at: '2024-01-01T00:00:00Z',
                  updated_at: '2024-01-20T15:30:00Z'
                }
              }
            }
          }
        },
        400: {
          $ref: '#/components/responses/BadRequest'
        },
        404: {
          $ref: '#/components/responses/NotFound'
        },
        500: {
          $ref: '#/components/responses/InternalServerError'
        }
      }
    },
    delete: {
      tags: ['Genres'],
      summary: 'Delete genre',
      description: 'Delete a genre by ID',
      operationId: 'deleteGenre',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: {
            type: 'integer',
            example: 1
          },
          description: 'Genre ID'
        }
      ],
      responses: {
        200: {
          description: 'Genre deleted successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SuccessResponse'
              },
              example: {
                success: true,
                message: 'Genre deleted successfully'
              }
            }
          }
        },
        404: {
          $ref: '#/components/responses/NotFound'
        },
        500: {
          $ref: '#/components/responses/InternalServerError'
        }
      }
    }
  }
};

module.exports = genrePaths;