/**
 * Watch History-related schemas
 */

const watchHistorySchemas = {
  WatchHistoryRequest: {
    type: 'object',
    required: ['filmId'],
    properties: {
      filmId: {
        type: 'string',
        example: 'the-matrix',
        description: 'Content slug or ID'
      },
      currentEpisode: {
        type: 'integer',
        minimum: 1,
        example: 1,
        description: 'Current episode number (for series)'
      },
      rating: {
        type: 'integer',
        minimum: 1,
        maximum: 10,
        example: 8,
        description: 'User rating (1-10)'
      },
      note: {
        type: 'string',
        maxLength: 500,
        example: 'Great series!',
        description: 'User notes about the content'
      },
      status: {
        type: 'string',
        enum: ['watching', 'completed', 'dropped'],
        example: 'watching',
        description: 'Watch status'
      },
      progressSeconds: {
        type: 'integer',
        minimum: 0,
        example: 3600,
        description: 'Progress in seconds'
      },
      durationSeconds: {
        type: 'integer',
        minimum: 0,
        example: 7200,
        description: 'Total duration in seconds'
      }
    }
  },

  WatchHistoryRecord: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        example: 1,
        description: 'Watch history record ID'
      },
      user_id: {
        type: 'integer',
        example: 1
      },
      content_id: {
        type: 'integer',
        example: 101
      },
      current_episode: {
        type: 'integer',
        example: 1,
        description: 'Current episode for series'
      },
      rating: {
        type: 'integer',
        example: 8,
        description: 'User rating'
      },
      note: {
        type: 'string',
        example: 'Great series!'
      },
      status: {
        type: 'string',
        enum: ['watching', 'completed', 'dropped'],
        example: 'watching'
      },
      progress_seconds: {
        type: 'integer',
        example: 3600
      },
      duration_seconds: {
        type: 'integer',
        example: 7200
      },
      last_watched_at: {
        type: 'string',
        format: 'date-time',
        example: '2024-01-20T18:30:00Z'
      },
      content: {
        $ref: '#/components/schemas/Content'
      },
      created_at: {
        type: 'string',
        format: 'date-time',
        example: '2024-01-15T10:30:00Z'
      },
      updated_at: {
        type: 'string',
        format: 'date-time',
        example: '2024-01-20T18:30:00Z'
      }
    }
  },

  WatchHistoryList: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: true
      },
      message: {
        type: 'string',
        example: 'Watch history retrieved successfully'
      },
      data: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/WatchHistoryRecord'
        }
      }
    }
  }
};

module.exports = watchHistorySchemas;