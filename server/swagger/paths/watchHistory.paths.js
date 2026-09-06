/**
 * Watch History API paths
 */

const watchHistoryPaths = {
  '/api/watch-history': {
    get: {
      tags: ['Watch History'],
      summary: 'Get user watch history',
      description: 'Retrieve authenticated user\'s watch history with content details. Authentication required.',
      operationId: 'getWatchHistory',
      security: [
        { bearerAuth: [] },
        { cookieAuth: [] }
      ],
      responses: {
        200: {
          description: 'Watch history retrieved successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/WatchHistoryList'
              },
              example: {
                success: true,
                message: 'Watch history retrieved successfully',
                data: [
                  {
                    id: 1,
                    user_id: 1,
                    content_id: 101,
                    current_episode: 1,
                    rating: 8,
                    note: 'Great movie!',
                    status: 'completed',
                    progress_seconds: 7200,
                    duration_seconds: 7200,
                    last_watched_at: '2024-01-20T18:30:00Z',
                    content: {
                      id: 101,
                      title: 'The Matrix',
                      slug: 'the-matrix',
                      content_type: 'movie',
                      poster_url: 'http://localhost:3000/uploads/posters/the-matrix.jpg',
                      rating: 8.7,
                      release_year: 1999,
                      is_premium: false,
                      genres: [
                        { id: 1, name: 'Action', slug: 'action' }
                      ]
                    },
                    created_at: '2024-01-15T10:30:00Z',
                    updated_at: '2024-01-20T18:30:00Z'
                  }
                ]
              }
            }
          }
        },
        401: {
          $ref: '#/components/responses/Unauthorized'
        },
        500: {
          $ref: '#/components/responses/InternalServerError'
        }
      }
    },
    post: {
      tags: ['Watch History'],
      summary: 'Add or update watch history',
      description: 'Add a new watch history record or update existing one. Authentication required.',
      operationId: 'addWatchHistory',
      security: [
        { bearerAuth: [] },
        { cookieAuth: [] }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/WatchHistoryRequest'
            },
            example: {
              filmId: 'the-matrix',
              currentEpisode: 1,
              rating: 8,
              note: 'Great movie!',
              status: 'completed',
              progressSeconds: 7200,
              durationSeconds: 7200
            }
          }
        }
      },
      responses: {
        201: {
          description: 'Watch history updated successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SuccessResponse'
              },
              example: {
                success: true,
                message: 'Watch history updated successfully',
                data: {
                  id: 1,
                  user_id: 1,
                  content_id: 101,
                  current_episode: 1,
                  rating: 8,
                  note: 'Great movie!',
                  status: 'completed',
                  progress_seconds: 7200,
                  duration_seconds: 7200,
                  last_watched_at: '2024-01-20T18:30:00Z',
                  created_at: '2024-01-15T10:30:00Z',
                  updated_at: '2024-01-20T18:30:00Z'
                }
              }
            }
          }
        },
        400: {
          $ref: '#/components/responses/BadRequest'
        },
        401: {
          $ref: '#/components/responses/Unauthorized'
        },
        404: {
          $ref: '#/components/responses/NotFound'
        },
        500: {
          $ref: '#/components/responses/InternalServerError'
        }
      }
    }
  },

  '/api/watch-history/{id}': {
    patch: {
      tags: ['Watch History'],
      summary: 'Update watch history record',
      description: 'Update specific watch history record by ID. Authentication required.',
      operationId: 'updateWatchHistory',
      security: [
        { bearerAuth: [] },
        { cookieAuth: [] }
      ],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: {
            type: 'integer',
            example: 1
          },
          description: 'Watch history record ID'
        }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/WatchHistoryRequest'
            },
            example: {
              currentEpisode: 2,
              rating: 9,
              note: 'Getting better!',
              status: 'watching',
              progressSeconds: 3600
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Watch history updated successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SuccessResponse'
              },
              example: {
                success: true,
                message: 'Watch history updated successfully',
                data: {
                  id: 1,
                  user_id: 1,
                  content_id: 101,
                  current_episode: 2,
                  rating: 9,
                  note: 'Getting better!',
                  status: 'watching',
                  progress_seconds: 3600,
                  duration_seconds: 7200,
                  last_watched_at: '2024-01-21T20:00:00Z',
                  updated_at: '2024-01-21T20:00:00Z'
                }
              }
            }
          }
        },
        400: {
          $ref: '#/components/responses/BadRequest'
        },
        401: {
          $ref: '#/components/responses/Unauthorized'
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
      tags: ['Watch History'],
      summary: 'Delete watch history record',
      description: 'Delete specific watch history record by ID. Authentication required.',
      operationId: 'deleteWatchHistory',
      security: [
        { bearerAuth: [] },
        { cookieAuth: [] }
      ],
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
          schema: {
            type: 'integer',
            example: 1
          },
          description: 'Watch history record ID'
        }
      ],
      responses: {
        200: {
          description: 'Watch history deleted successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SuccessResponse'
              },
              example: {
                success: true,
                message: 'Watch history deleted successfully'
              }
            }
          }
        },
        401: {
          $ref: '#/components/responses/Unauthorized'
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

module.exports = watchHistoryPaths;