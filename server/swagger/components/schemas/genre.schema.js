/**
 * Genre-related schemas
 */

const genreSchemas = {
  Genre: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        example: 1,
        description: 'Genre ID'
      },
      name: {
        type: 'string',
        example: 'Action',
        description: 'Genre name'
      },
      slug: {
        type: 'string',
        example: 'action',
        description: 'URL-friendly slug'
      },
      created_at: {
        type: 'string',
        format: 'date-time',
        example: '2024-01-01T00:00:00Z',
        description: 'Creation timestamp'
      },
      updated_at: {
        type: 'string',
        format: 'date-time',
        example: '2024-01-15T12:00:00Z',
        description: 'Last update timestamp'
      }
    }
  },

  CreateGenreRequest: {
    type: 'object',
    required: ['name'],
    properties: {
      name: {
        type: 'string',
        minLength: 2,
        maxLength: 100,
        example: 'Action',
        description: 'Genre name (2-100 characters)'
      },
      slug: {
        type: 'string',
        minLength: 2,
        maxLength: 100,
        example: 'action',
        description: 'Optional slug, auto-generated if not provided'
      }
    }
  },

  UpdateGenreRequest: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        minLength: 2,
        maxLength: 100,
        example: 'Action',
        description: 'New genre name'
      },
      slug: {
        type: 'string',
        minLength: 2,
        maxLength: 100,
        example: 'action',
        description: 'New slug'
      }
    }
  },

  GenreList: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: true
      },
      message: {
        type: 'string',
        example: 'Genres retrieved successfully'
      },
      data: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/Genre'
        }
      }
    }
  }
};

module.exports = genreSchemas;