/**
 * User API paths
 */

const userPaths = {
  '/api/users/me': {
    get: {
      tags: ['Users'],
      summary: 'Get current user profile',
      description: 'Retrieve the authenticated user\'s profile with subscription info and favorites. Authentication required.',
      operationId: 'getCurrentUserProfile',
      security: [
        { bearerAuth: [] },
        { cookieAuth: [] }
      ],
      responses: {
        200: {
          description: 'User profile retrieved successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UserProfile'
              },
              example: {
                success: true,
                message: 'User profile retrieved successfully',
                data: {
                  id: 1,
                  username: 'demo_user',
                  email: 'demo@example.com',
                  full_name: 'Demo User',
                  avatar_url: 'http://localhost:3000/uploads/avatars/avatar_1.jpg',
                  is_premium: false,
                  email_verified: true,
                  subscription_ends_at: null,
                  favorite_genres: ['Action', 'Sci-Fi'],
                  created_at: '2024-01-15T10:30:00Z',
                  updated_at: '2024-01-20T14:45:00Z'
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
    },
    patch: {
      tags: ['Users'],
      summary: 'Update user profile',
      description: 'Update authenticated user\'s profile. Changing email triggers new verification. Authentication required.',
      operationId: 'updateUserProfile',
      security: [
        { bearerAuth: [] },
        { cookieAuth: [] }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/UpdateUserRequest'
            },
            example: {
              full_name: 'John Doe',
              password: 'newpassword123',
              email: 'newemail@example.com'
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Profile updated successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SuccessResponse'
              },
              example: {
                success: true,
                message: 'Profile updated successfully',
                data: {
                  id: 1,
                  username: 'demo_user',
                  email: 'newemail@example.com',
                  full_name: 'John Doe',
                  avatar_url: 'http://localhost:3000/uploads/avatars/avatar_1.jpg',
                  email_verified: false,
                  updated_at: '2024-01-20T15:00:00Z'
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
        409: {
          description: 'Email already exists',
          content: {
            'application/json': {
              example: {
                success: false,
                message: 'Email already in use',
                code: 'EMAIL_EXISTS'
              }
            }
          }
        },
        500: {
          $ref: '#/components/responses/InternalServerError'
        }
      }
    }
  },

  '/api/users/favorites': {
    get: {
      tags: ['Users'],
      summary: 'Get user favorites',
      description: 'Retrieve authenticated user\'s favorite contents. Authentication required.',
      operationId: 'getUserFavorites',
      security: [
        { bearerAuth: [] },
        { cookieAuth: [] }
      ],
      responses: {
        200: {
          description: 'Favorites retrieved successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/FavoritesList'
              },
              example: {
                success: true,
                message: 'Favorites retrieved successfully',
                data: [
                  {
                    id: 1,
                    user_id: 1,
                    content_id: 101,
                    notes: 'One of my favorite movies of all time!',
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
                    created_at: '2024-01-15T10:30:00Z'
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
      tags: ['Users'],
      summary: 'Add content to favorites',
      description: 'Add a content to authenticated user\'s favorites. Authentication required.',
      operationId: 'addToFavorites',
      security: [
        { bearerAuth: [] },
        { cookieAuth: [] }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/FavoriteContentRequest'
            },
            example: {
              contentId: 101,
              notes: 'One of my favorite movies of all time!'
            }
          }
        }
      },
      responses: {
        201: {
          description: 'Added to favorites successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SuccessResponse'
              },
              example: {
                success: true,
                message: 'Added to favorites successfully',
                data: {
                  id: 1,
                  user_id: 1,
                  content_id: 101,
                  notes: 'One of my favorite movies of all time!',
                  created_at: '2024-01-15T10:30:00Z'
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
        409: {
          description: 'Content already in favorites',
          content: {
            'application/json': {
              example: {
                success: false,
                message: 'Content already in favorites',
                code: 'ALREADY_FAVORITE'
              }
            }
          }
        },
        500: {
          $ref: '#/components/responses/InternalServerError'
        }
      }
    }
  },

  '/api/users/favorites/{contentId}': {
    delete: {
      tags: ['Users'],
      summary: 'Remove from favorites',
      description: 'Remove a content from authenticated user\'s favorites. Authentication required.',
      operationId: 'removeFromFavorites',
      security: [
        { bearerAuth: [] },
        { cookieAuth: [] }
      ],
      parameters: [
        {
          name: 'contentId',
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
          description: 'Removed from favorites successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SuccessResponse'
              },
              example: {
                success: true,
                message: 'Removed from favorites successfully'
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

module.exports = userPaths;