/**
 * Common response definitions
 */

const responses = {
  // Success responses
  Success: {
    description: 'Successful operation',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/SuccessResponse'
        }
      }
    }
  },

  SuccessWithData: {
    description: 'Successful operation with data',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/SuccessResponse'
        }
      }
    }
  },

  PaginatedSuccess: {
    description: 'Successful paginated response',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/PaginatedResponse'
        }
      }
    }
  },

  Created: {
    description: 'Resource created successfully',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/SuccessResponse'
        }
      }
    }
  },

  // Error responses
  BadRequest: {
    description: 'Bad request - validation error or invalid input',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/ErrorResponse'
        },
        example: {
          success: false,
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: {
            errors: [
              {
                field: 'username',
                message: 'Username must be at least 3 characters',
                type: 'minLength'
              }
            ]
          }
        }
      }
    }
  },

  Unauthorized: {
    description: 'Unauthorized - authentication required or invalid credentials',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/ErrorResponse'
        },
        example: {
          success: false,
          message: 'Authentication required',
          code: 'UNAUTHORIZED'
        }
      }
    }
  },

  Forbidden: {
    description: 'Forbidden - insufficient permissions',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/ErrorResponse'
        },
        example: {
          success: false,
          message: 'Insufficient permissions',
          code: 'FORBIDDEN'
        }
      }
    }
  },

  NotFound: {
    description: 'Resource not found',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/ErrorResponse'
        },
        example: {
          success: false,
          message: 'Resource not found',
          code: 'NOT_FOUND'
        }
      }
    }
  },

  Conflict: {
    description: 'Conflict - resource already exists',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/ErrorResponse'
        },
        example: {
          success: false,
          message: 'Username already exists',
          code: 'CONFLICT'
        }
      }
    }
  },

  TooManyRequests: {
    description: 'Too many requests - rate limit exceeded',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/ErrorResponse'
        },
        example: {
          success: false,
          message: 'Rate limit exceeded. Try again in 15 minutes.',
          code: 'RATE_LIMIT_EXCEEDED',
          details: {
            windowMs: 900000,
            maxRequests: 5,
            remaining: 0,
            resetTime: '2024-01-15T10:45:00Z'
          }
        }
      }
    }
  },

  InternalServerError: {
    description: 'Internal server error',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/ErrorResponse'
        },
        example: {
          success: false,
          message: 'Internal server error',
          code: 'INTERNAL_SERVER_ERROR'
        }
      }
    }
  }
};

module.exports = responses;