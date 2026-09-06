/**
 * Content API paths
 */

const contentPaths = {
  '/api/contents': {
    get: {
      tags: ['Contents'],
      summary: 'Get all contents',
      description: 'Retrieve paginated list of contents with filtering and sorting options. Authentication required.',
      operationId: 'getAllContents',
      security: [
        { bearerAuth: [] },
        { cookieAuth: [] }
      ],
      parameters: [
        {
          name: 'type',
          in: 'query',
          required: false,
          schema: {
            type: 'string',
            enum: ['movie', 'series'],
            example: 'movie'
          },
          description: 'Filter by content type'
        },
        {
          name: 'genre',
          in: 'query',
          required: false,
          schema: {
            type: 'string',
            example: 'action'
          },
          description: 'Filter by genre slug'
        },
        {
          name: 'year',
          in: 'query',
          required: false,
          schema: {
            type: 'integer',
            example: 2024
          },
          description: 'Filter by release year'
        },
        {
          name: 'premium',
          in: 'query',
          required: false,
          schema: {
            type: 'string',
            enum: ['true', 'false', '1', '0'],
            example: 'false'
          },
          description: 'Filter by premium status'
        },
        {
          name: 'sort',
          in: 'query',
          required: false,
          schema: {
            type: 'string',
            enum: ['rating', 'year', 'title', 'newest'],
            default: 'newest',
            example: 'rating'
          },
          description: 'Sort field'
        },
        {
          name: 'page',
          in: 'query',
          required: false,
          schema: {
            type: 'integer',
            minimum: 1,
            default: 1,
            example: 1
          },
          description: 'Page number'
        },
        {
          name: 'limit',
          in: 'query',
          required: false,
          schema: {
            type: 'integer',
            minimum: 1,
            maximum: 100,
            default: 20,
            example: 20
          },
          description: 'Number of items per page (max 100)'
        }
      ],
      responses: {
        200: {
          description: 'Contents retrieved successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ContentList'
              },
              example: {
                success: true,
                message: 'Contents retrieved successfully',
                data: [
                  {
                    id: 101,
                    title: 'The Matrix',
                    slug: 'the-matrix',
                    description: 'A computer hacker learns about the true nature of reality...',
                    content_type: 'movie',
                    poster_url: 'http://localhost:3000/uploads/posters/the-matrix.jpg',
                    banner_url: 'http://localhost:3000/uploads/banners/the-matrix.jpg',
                    rating: 8.7,
                    release_year: 1999,
                    age_rating: 'R',
                    duration: 136,
                    is_premium: false,
                    genres: [
                      { id: 1, name: 'Action', slug: 'action' },
                      { id: 5, name: 'Sci-Fi', slug: 'sci-fi' }
                    ],
                    created_at: '2024-01-01T00:00:00Z'
                  }
                ],
                meta: {
                  total: 50,
                  page: 1,
                  limit: 20,
                  totalPages: 3
                }
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
    }
  },

  '/api/contents/search': {
    get: {
      tags: ['Contents'],
      summary: 'Search contents',
      description: 'Search contents by title, description, or other criteria. Authentication required.',
      operationId: 'searchContents',
      security: [
        { bearerAuth: [] },
        { cookieAuth: [] }
      ],
      parameters: [
        {
          name: 'query',
          in: 'query',
          required: true,
          schema: {
            type: 'string',
            example: 'matrix'
          },
          description: 'Search query'
        },
        {
          name: 'type',
          in: 'query',
          required: false,
          schema: {
            type: 'string',
            enum: ['movie', 'series'],
            example: 'movie'
          },
          description: 'Filter by content type'
        },
        {
          name: 'genre',
          in: 'query',
          required: false,
          schema: {
            type: 'string',
            example: 'action'
          },
          description: 'Filter by genre slug'
        }
      ],
      responses: {
        200: {
          description: 'Search results retrieved successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ContentList'
              },
              example: {
                success: true,
                message: 'Search results retrieved successfully',
                data: [
                  {
                    id: 101,
                    title: 'The Matrix',
                    slug: 'the-matrix',
                    description: 'A computer hacker learns about the true nature of reality...',
                    content_type: 'movie',
                    poster_url: 'http://localhost:3000/uploads/posters/the-matrix.jpg',
                    rating: 8.7,
                    release_year: 1999,
                    is_premium: false,
                    genres: [
                      { id: 1, name: 'Action', slug: 'action' }
                    ]
                  }
                ],
                meta: {
                  total: 1,
                  page: 1,
                  limit: 20,
                  totalPages: 1
                }
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
    }
  },

  '/api/contents/{id}': {
    get: {
      tags: ['Contents'],
      summary: 'Get content by ID',
      description: 'Retrieve detailed information about a specific content by ID. Authentication required.',
      operationId: 'getContentById',
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
            example: 101
          },
          description: 'Content ID'
        }
      ],
      responses: {
        200: {
          description: 'Content retrieved successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SuccessResponse'
              },
              example: {
                success: true,
                message: 'Content retrieved successfully',
                data: {
                  id: 101,
                  title: 'The Matrix',
                  slug: 'the-matrix',
                  description: 'A computer hacker learns about the true nature of reality...',
                  content_type: 'movie',
                  poster_url: 'http://localhost:3000/uploads/posters/the-matrix.jpg',
                  banner_url: 'http://localhost:3000/uploads/banners/the-matrix.jpg',
                  rating: 8.7,
                  release_year: 1999,
                  age_rating: 'R',
                  duration: 136,
                  is_premium: false,
                  genres: [
                    { id: 1, name: 'Action', slug: 'action' },
                    { id: 5, name: 'Sci-Fi', slug: 'sci-fi' }
                  ],
                  created_at: '2024-01-01T00:00:00Z'
                }
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
  },

  '/api/contents/{id}/episodes': {
    get: {
      tags: ['Contents'],
      summary: 'Get content episodes',
      description: 'Retrieve episodes for a series content. Authentication required.',
      operationId: 'getContentEpisodes',
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
            example: 102
          },
          description: 'Content ID (must be a series)'
        }
      ],
      responses: {
        200: {
          description: 'Episodes retrieved successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SuccessResponse'
              },
              example: {
                success: true,
                message: 'Episodes retrieved successfully',
                data: [
                  {
                    id: 1,
                    content_id: 102,
                    episode_number: 1,
                    title: 'Episode 1',
                    description: 'The beginning of the story.',
                    duration: 45,
                    video_url: 'http://localhost:3000/uploads/videos/episode1.mp4',
                    created_at: '2024-01-01T00:00:00Z'
                  }
                ]
              }
            }
          }
        },
        400: {
          description: 'Content is not a series',
          content: {
            'application/json': {
              example: {
                success: false,
                message: 'Content is not a series',
                code: 'INVALID_CONTENT_TYPE'
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
  },

  '/api/contents/{id}/recommendations': {
    get: {
      tags: ['Contents'],
      summary: 'Get content recommendations',
      description: 'Get recommended contents based on the specified content. Authentication required.',
      operationId: 'getContentRecommendations',
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
            example: 101
          },
          description: 'Content ID'
        }
      ],
      responses: {
        200: {
          description: 'Recommendations retrieved successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SuccessResponse'
              },
              example: {
                success: true,
                message: 'Recommendations retrieved successfully',
                data: [
                  {
                    content: {
                      id: 103,
                      title: 'Inception',
                      slug: 'inception',
                      content_type: 'movie',
                      poster_url: 'http://localhost:3000/uploads/posters/inception.jpg',
                      rating: 8.8,
                      release_year: 2010,
                      is_premium: false,
                      genres: [
                        { id: 1, name: 'Action', slug: 'action' },
                        { id: 5, name: 'Sci-Fi', slug: 'sci-fi' }
                      ]
                    },
                    similarity_score: 0.85
                  }
                ]
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
  },

  '/api/contents/slug/{slug}': {
    get: {
      tags: ['Contents'],
      summary: 'Get content by slug',
      description: 'Retrieve detailed information about a specific content by slug. Authentication required.',
      operationId: 'getContentBySlug',
      security: [
        { bearerAuth: [] },
        { cookieAuth: [] }
      ],
      parameters: [
        {
          name: 'slug',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
            example: 'the-matrix'
          },
          description: 'Content slug'
        }
      ],
      responses: {
        200: {
          description: 'Content retrieved successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SuccessResponse'
              },
              example: {
                success: true,
                message: 'Content retrieved successfully',
                data: {
                  id: 101,
                  title: 'The Matrix',
                  slug: 'the-matrix',
                  description: 'A computer hacker learns about the true nature of reality...',
                  content_type: 'movie',
                  poster_url: 'http://localhost:3000/uploads/posters/the-matrix.jpg',
                  banner_url: 'http://localhost:3000/uploads/banners/the-matrix.jpg',
                  rating: 8.7,
                  release_year: 1999,
                  age_rating: 'R',
                  duration: 136,
                  is_premium: false,
                  genres: [
                    { id: 1, name: 'Action', slug: 'action' },
                    { id: 5, name: 'Sci-Fi', slug: 'sci-fi' }
                  ],
                  created_at: '2024-01-01T00:00:00Z'
                }
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

module.exports = contentPaths;