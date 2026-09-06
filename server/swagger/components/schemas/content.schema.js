/**
 * Content-related schemas
 */

const contentSchemas = {
  Content: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        example: 101,
        description: 'Content ID'
      },
      title: {
        type: 'string',
        example: 'The Matrix',
        description: 'Content title'
      },
      slug: {
        type: 'string',
        example: 'the-matrix',
        description: 'URL-friendly slug'
      },
      description: {
        type: 'string',
        example: 'A computer hacker learns about the true nature of reality and his role in the war against its controllers.',
        description: 'Content description'
      },
      content_type: {
        type: 'string',
        enum: ['movie', 'series'],
        example: 'movie',
        description: 'Type of content'
      },
      poster_url: {
        type: 'string',
        example: 'http://localhost:3000/uploads/posters/the-matrix.jpg',
        description: 'URL to poster image'
      },
      banner_url: {
        type: 'string',
        example: 'http://localhost:3000/uploads/banners/the-matrix.jpg',
        description: 'URL to banner image'
      },
      rating: {
        type: 'number',
        minimum: 0,
        maximum: 10,
        example: 8.7,
        description: 'Content rating (0-10)'
      },
      release_year: {
        type: 'integer',
        example: 1999,
        description: 'Release year'
      },
      age_rating: {
        type: 'string',
        example: 'R',
        description: 'Age rating (e.g., PG, PG-13, R, NC-17)'
      },
      duration: {
        type: 'integer',
        example: 136,
        description: 'Duration in minutes'
      },
      is_premium: {
        type: 'boolean',
        example: false,
        description: 'Whether content requires premium subscription'
      },
      genres: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/Genre'
        },
        example: [
          { id: 1, name: 'Action', slug: 'action' },
          { id: 5, name: 'Sci-Fi', slug: 'sci-fi' }
        ],
        description: 'List of genres'
      },
      created_at: {
        type: 'string',
        format: 'date-time',
        example: '2024-01-01T00:00:00Z'
      },
      updated_at: {
        type: 'string',
        format: 'date-time',
        example: '2024-01-15T12:00:00Z'
      }
    }
  },

  Episode: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        example: 1,
        description: 'Episode ID'
      },
      content_id: {
        type: 'integer',
        example: 101,
        description: 'Parent content ID'
      },
      episode_number: {
        type: 'integer',
        example: 1,
        description: 'Episode number within the series'
      },
      title: {
        type: 'string',
        example: 'Episode 1',
        description: 'Episode title'
      },
      description: {
        type: 'string',
        example: 'The beginning of the story.',
        description: 'Episode description'
      },
      duration: {
        type: 'integer',
        example: 45,
        description: 'Duration in minutes'
      },
      video_url: {
        type: 'string',
        example: 'http://localhost:3000/uploads/videos/episode1.mp4',
        description: 'URL to video file'
      },
      created_at: {
        type: 'string',
        format: 'date-time',
        example: '2024-01-01T00:00:00Z'
      }
    }
  },

  Recommendation: {
    type: 'object',
    properties: {
      content: {
        $ref: '#/components/schemas/Content'
      },
      similarity_score: {
        type: 'number',
        example: 0.85,
        description: 'Similarity score (0-1)'
      }
    }
  },

  ContentList: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: true
      },
      message: {
        type: 'string',
        example: 'Contents retrieved successfully'
      },
      data: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/Content'
        }
      },
      meta: {
        $ref: '#/components/schemas/PaginationMeta'
      }
    }
  },

  SearchContentRequest: {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        example: 'matrix',
        description: 'Search query'
      },
      type: {
        type: 'string',
        enum: ['movie', 'series'],
        example: 'movie',
        description: 'Filter by content type'
      },
      genre: {
        type: 'string',
        example: 'action',
        description: 'Filter by genre slug'
      }
    }
  }
};

module.exports = contentSchemas;