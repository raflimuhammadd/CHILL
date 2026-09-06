/**
 * User-related schemas
 */

const userSchemas = {
  UpdateUserRequest: {
    type: 'object',
    properties: {
      full_name: {
        type: 'string',
        minLength: 1,
        maxLength: 100,
        example: 'John Doe',
        description: 'Full name'
      },
      avatar: {
        type: 'string',
        example: 'avatar_1.jpg',
        description: 'Avatar filename'
      },
      avatar_url: {
        type: 'string',
        example: 'http://localhost:3000/uploads/avatars/avatar_1.jpg',
        description: 'Avatar URL'
      },
      password: {
        type: 'string',
        minLength: 6,
        example: 'newpassword123',
        description: 'New password (at least 6 characters)'
      },
      email: {
        type: 'string',
        format: 'email',
        example: 'newemail@example.com',
        description: 'New email address (triggers verification)'
      }
    }
  },

  UserProfile: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: true
      },
      message: {
        type: 'string',
        example: 'User profile retrieved successfully'
      },
      data: {
        $ref: '#/components/schemas/User'
      }
    }
  },

  FavoriteContentRequest: {
    type: 'object',
    required: ['contentId'],
    properties: {
      contentId: {
        type: 'integer',
        example: 101,
        description: 'Content ID to favorite'
      },
      notes: {
        type: 'string',
        maxLength: 500,
        example: 'One of my favorite movies of all time!',
        description: 'Optional notes about the content'
      }
    }
  },

  FavoriteContent: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        example: 1,
        description: 'Favorite record ID'
      },
      user_id: {
        type: 'integer',
        example: 1
      },
      content_id: {
        type: 'integer',
        example: 101
      },
      notes: {
        type: 'string',
        example: 'One of my favorite movies of all time!'
      },
      content: {
        $ref: '#/components/schemas/Content'
      },
      created_at: {
        type: 'string',
        format: 'date-time',
        example: '2024-01-15T10:30:00Z'
      }
    }
  },

  FavoritesList: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: true
      },
      message: {
        type: 'string',
        example: 'Favorites retrieved successfully'
      },
      data: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/FavoriteContent'
        }
      }
    }
  }
};

module.exports = userSchemas;