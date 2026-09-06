/**
 * Common response schemas used across the API
 */

const commonSchemas = {
  SuccessResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: true,
        description: 'Indicates if the request was successful'
      },
      message: {
        type: 'string',
        description: 'Success message'
      },
      data: {
        type: 'object',
        description: 'Response data'
      }
    }
  },

  ErrorResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: false,
        description: 'Indicates if the request failed'
      },
      message: {
        type: 'string',
        description: 'Error message'
      },
      code: {
        type: 'string',
        description: 'Error code for programmatic handling'
      },
      details: {
        type: 'object',
        description: 'Additional error details (development only)'
      }
    }
  },

  PaginationMeta: {
    type: 'object',
    properties: {
      total: {
        type: 'integer',
        example: 100,
        description: 'Total number of items'
      },
      page: {
        type: 'integer',
        example: 1,
        description: 'Current page number'
      },
      limit: {
        type: 'integer',
        example: 20,
        description: 'Number of items per page'
      },
      totalPages: {
        type: 'integer',
        example: 5,
        description: 'Total number of pages'
      }
    }
  },

  PaginatedResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: true
      },
      message: {
        type: 'string',
        example: 'Data retrieved successfully'
      },
      data: {
        type: 'array',
        items: {
          type: 'object'
        }
      },
      meta: {
        $ref: '#/components/schemas/PaginationMeta'
      }
    }
  },

  ValidationError: {
    type: 'object',
    properties: {
      field: {
        type: 'string',
        example: 'username'
      },
      message: {
        type: 'string',
        example: 'Username must be at least 3 characters long'
      },
      type: {
        type: 'string',
        example: 'minLength'
      }
    }
  },

  RateLimitInfo: {
    type: 'object',
    properties: {
      windowMs: {
        type: 'integer',
        example: 900000,
        description: 'Rate limit window in milliseconds (15 minutes)'
      },
      maxRequests: {
        type: 'integer',
        example: 5,
        description: 'Maximum requests allowed in the window'
      },
      remaining: {
        type: 'integer',
        example: 4,
        description: 'Requests remaining in the current window'
      },
      resetTime: {
        type: 'string',
        format: 'date-time',
        description: 'Time when the rate limit resets'
      }
    }
  }
};

module.exports = commonSchemas;