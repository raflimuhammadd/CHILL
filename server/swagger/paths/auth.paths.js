/**
 * Authentication API paths
 */

const authPaths = {
  '/api/auth/register': {
    post: {
      tags: ['Authentication'],
      summary: 'Register a new user',
      description: 'Create a new user account with username and password. Email is optional for account recovery. Rate limit: 5 requests per 15 minutes.',
      operationId: 'registerUser',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/RegisterRequest'
            },
            example: {
              username: 'demo_user',
              password: 'password123',
              email: 'demo@example.com'
            }
          }
        }
      },
      responses: {
        201: {
          description: 'User registered successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SuccessResponse'
              },
              example: {
                success: true,
                message: 'User registered successfully. Verification email sent.',
                data: {
                  id: 1,
                  username: 'demo_user',
                  email: 'demo@example.com',
                  full_name: null,
                  avatar_url: null,
                  is_premium: false,
                  email_verified: false,
                  created_at: '2024-01-15T10:30:00Z'
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
        429: {
          $ref: '#/components/responses/TooManyRequests'
        },
        500: {
          $ref: '#/components/responses/InternalServerError'
        }
      }
    }
  },

  '/api/auth/login': {
    post: {
      tags: ['Authentication'],
      summary: 'Login user',
      description: 'Authenticate user with username and password. Sets accessToken (15 min) and refreshToken (30 days) cookies. Rate limit: 5 requests per 15 minutes.',
      operationId: 'loginUser',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/LoginRequest'
            },
            example: {
              username: 'demo_user',
              password: 'password123'
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Login successful',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/AuthResponse'
              },
              example: {
                success: true,
                message: 'Login successful',
                data: {
                  accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                  user: {
                    id: 1,
                    username: 'demo_user',
                    email: 'demo@example.com',
                    full_name: 'Demo User',
                    avatar_url: 'http://localhost:3000/uploads/avatars/avatar_1.jpg',
                    is_premium: false,
                    email_verified: true,
                    created_at: '2024-01-15T10:30:00Z'
                  }
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
        429: {
          $ref: '#/components/responses/TooManyRequests'
        },
        500: {
          $ref: '#/components/responses/InternalServerError'
        }
      }
    }
  },

  '/api/auth/verify-email': {
    post: {
      tags: ['Authentication'],
      summary: 'Verify email address',
      description: 'Verify user email using token sent to email. Rate limit: 5 requests per 15 minutes.',
      operationId: 'verifyEmail',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/VerifyEmailRequest'
            },
            example: {
              token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Email verified successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SuccessResponse'
              },
              example: {
                success: true,
                message: 'Email verified successfully'
              }
            }
          }
        },
        400: {
          $ref: '#/components/responses/BadRequest'
        },
        429: {
          $ref: '#/components/responses/TooManyRequests'
        },
        500: {
          $ref: '#/components/responses/InternalServerError'
        }
      }
    }
  },

  '/api/auth/resend-verification': {
    post: {
      tags: ['Authentication'],
      summary: 'Resend verification email',
      description: 'Resend email verification token to user. Requires authentication. Rate limit: 5 requests per 15 minutes.',
      operationId: 'resendVerification',
      security: [
        { bearerAuth: [] },
        { cookieAuth: [] }
      ],
      responses: {
        200: {
          description: 'Verification email resent',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SuccessResponse'
              },
              example: {
                success: true,
                message: 'Verification email sent'
              }
            }
          }
        },
        401: {
          $ref: '#/components/responses/Unauthorized'
        },
        429: {
          $ref: '#/components/responses/TooManyRequests'
        },
        500: {
          $ref: '#/components/responses/InternalServerError'
        }
      }
    }
  },

  '/api/auth/refresh-token': {
    post: {
      tags: ['Authentication'],
      summary: 'Refresh access token',
      description: 'Get a new access token using the refreshToken cookie. No authentication header needed.',
      operationId: 'refreshToken',
      responses: {
        200: {
          description: 'Token refreshed successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/RefreshTokenResponse'
              },
              example: {
                success: true,
                message: 'Token refreshed successfully',
                data: {
                  accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
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

  '/api/auth/logout': {
    post: {
      tags: ['Authentication'],
      summary: 'Logout user',
      description: 'Logout user and invalidate tokens. Clears accessToken and refreshToken cookies. Requires authentication. Rate limit: 3 requests per hour.',
      operationId: 'logoutUser',
      security: [
        { bearerAuth: [] },
        { cookieAuth: [] }
      ],
      responses: {
        200: {
          description: 'Logout successful',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SuccessResponse'
              },
              example: {
                success: true,
                message: 'Logout successful'
              }
            }
          }
        },
        401: {
          $ref: '#/components/responses/Unauthorized'
        },
        429: {
          $ref: '#/components/responses/TooManyRequests'
        },
        500: {
          $ref: '#/components/responses/InternalServerError'
        }
      }
    }
  }
};

module.exports = authPaths;