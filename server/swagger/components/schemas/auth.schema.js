/**
 * Authentication-related schemas
 */

const authSchemas = {
  RegisterRequest: {
    type: 'object',
    required: ['username', 'password'],
    properties: {
      username: {
        type: 'string',
        minLength: 3,
        maxLength: 50,
        pattern: '^[a-zA-Z0-9_-]+$',
        example: 'demo_user',
        description: 'Username must be 3-50 characters, alphanumeric, underscores, or hyphens'
      },
      password: {
        type: 'string',
        minLength: 6,
        example: 'password123',
        description: 'Password must be at least 6 characters'
      },
      email: {
        type: 'string',
        format: 'email',
        example: 'demo@example.com',
        description: 'Optional email for account recovery and verification'
      }
    }
  },

  LoginRequest: {
    type: 'object',
    required: ['username', 'password'],
    properties: {
      username: {
        type: 'string',
        example: 'demo_user',
        description: 'Registered username'
      },
      password: {
        type: 'string',
        example: 'password123',
        description: 'Account password'
      }
    }
  },

  VerifyEmailRequest: {
    type: 'object',
    required: ['token'],
    properties: {
      token: {
        type: 'string',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        description: 'Email verification token sent to user\'s email'
      }
    }
  },

  User: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        example: 1,
        description: 'User ID'
      },
      username: {
        type: 'string',
        example: 'demo_user',
        description: 'Username'
      },
      email: {
        type: 'string',
        example: 'demo@example.com',
        description: 'User email'
      },
      full_name: {
        type: 'string',
        example: 'Demo User',
        description: 'User\'s full name'
      },
      avatar_url: {
        type: 'string',
        example: 'http://localhost:3000/uploads/avatars/avatar_1.jpg',
        description: 'URL to user\'s avatar image'
      },
      is_premium: {
        type: 'boolean',
        example: false,
        description: 'Whether user has premium subscription'
      },
      email_verified: {
        type: 'boolean',
        example: true,
        description: 'Whether email has been verified'
      },
      created_at: {
        type: 'string',
        format: 'date-time',
        example: '2024-01-15T10:30:00Z',
        description: 'Account creation timestamp'
      },
      updated_at: {
        type: 'string',
        format: 'date-time',
        example: '2024-01-20T14:45:00Z',
        description: 'Last profile update timestamp'
      }
    }
  },

  AuthResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: true
      },
      message: {
        type: 'string',
        example: 'Login successful'
      },
      data: {
        type: 'object',
        properties: {
          accessToken: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            description: 'JWT access token (valid for 15 minutes)'
          },
          user: {
            $ref: '#/components/schemas/User'
          }
        }
      }
    }
  },

  RefreshTokenResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: true
      },
      message: {
        type: 'string',
        example: 'Token refreshed successfully'
      },
      data: {
        type: 'object',
        properties: {
          accessToken: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            description: 'New JWT access token'
          }
        }
      }
    }
  }
};

module.exports = authSchemas;