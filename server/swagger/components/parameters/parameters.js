/**
 * Common parameter definitions
 */

const parameters = {
  // Path parameters
  genreId: {
    name: 'id',
    in: 'path',
    required: true,
    schema: {
      type: 'integer',
      example: 1
    },
    description: 'Genre ID'
  },

  contentId: {
    name: 'id',
    in: 'path',
    required: true,
    schema: {
      type: 'integer',
      example: 101
    },
    description: 'Content ID'
  },

  watchHistoryId: {
    name: 'id',
    in: 'path',
    required: true,
    schema: {
      type: 'integer',
      example: 1
    },
    description: 'Watch history record ID'
  },

  orderCode: {
    name: 'orderCode',
    in: 'path',
    required: true,
    schema: {
      type: 'string',
      example: 'ORDER-12345'
    },
    description: 'Payment order code'
  },

  // Query parameters
  limit: {
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
  },

  offset: {
    name: 'offset',
    in: 'query',
    required: false,
    schema: {
      type: 'integer',
      minimum: 0,
      default: 0,
      example: 0
    },
    description: 'Number of items to skip'
  },

  page: {
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

  type: {
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

  genre: {
    name: 'genre',
    in: 'query',
    required: false,
    schema: {
      type: 'string',
      example: 'action'
    },
    description: 'Filter by genre slug'
  },

  year: {
    name: 'year',
    in: 'query',
    required: false,
    schema: {
      type: 'integer',
      example: 2024
    },
    description: 'Filter by release year'
  },

  premium: {
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

  sort: {
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

  // Header parameters
  authorization: {
    name: 'Authorization',
    in: 'header',
    required: true,
    schema: {
      type: 'string',
      example: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
    },
    description: 'JWT access token'
  },

  // Body parameters
  registerBody: {
    name: 'body',
    in: 'body',
    required: true,
    description: 'User registration data',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/RegisterRequest'
        }
      }
    }
  },

  loginBody: {
    name: 'body',
    in: 'body',
    required: true,
    description: 'User login credentials',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/LoginRequest'
        }
      }
    }
  },

  verifyEmailBody: {
    name: 'body',
    in: 'body',
    required: true,
    description: 'Email verification token',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/VerifyEmailRequest'
        }
      }
    }
  },

  updateProfileBody: {
    name: 'body',
    in: 'body',
    required: true,
    description: 'User profile updates',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/UpdateUserRequest'
        }
      }
    }
  },

  favoriteBody: {
    name: 'body',
    in: 'body',
    required: true,
    description: 'Favorite content data',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/FavoriteContentRequest'
        }
      }
    }
  },

  watchHistoryBody: {
    name: 'body',
    in: 'body',
    required: true,
    description: 'Watch history data',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/WatchHistoryRequest'
        }
      }
    }
  },

  paymentBody: {
    name: 'body',
    in: 'body',
    required: true,
    description: 'Payment data',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/CreatePaymentRequest'
        }
      }
    }
  },

  snapTokenBody: {
    name: 'body',
    in: 'body',
    required: true,
    description: 'Snap token request data',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/SnapTokenRequest'
        }
      }
    }
  },

  genreCreateBody: {
    name: 'body',
    in: 'body',
    required: true,
    description: 'Genre creation data',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/CreateGenreRequest'
        }
      }
    }
  },

  genreUpdateBody: {
    name: 'body',
    in: 'body',
    required: true,
    description: 'Genre update data',
    content: {
      'application/json': {
        schema: {
          $ref: '#/components/schemas/UpdateGenreRequest'
        }
      }
    }
  }
};

module.exports = parameters;