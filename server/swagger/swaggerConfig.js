/**
 * Swagger/OpenAPI Configuration
 * 
 * This file defines the main OpenAPI 3.0 specification for the Chill Streams API.
 * It imports all schemas, paths, and components from their respective files.
 */

const commonSchemas = require('./components/schemas/common.schema');
const authSchemas = require('./components/schemas/auth.schema');
const genreSchemas = require('./components/schemas/genre.schema');
const contentSchemas = require('./components/schemas/content.schema');
const userSchemas = require('./components/schemas/user.schema');
const watchHistorySchemas = require('./components/schemas/watchHistory.schema');
const paymentSchemas = require('./components/schemas/payment.schema');

const responses = require('./components/responses/responses');
const parameters = require('./components/parameters/parameters');
const tags = require('./tags');

const authPaths = require('./paths/auth.paths');
const genrePaths = require('./paths/genre.paths');
const contentPaths = require('./paths/content.paths');
const userPaths = require('./paths/user.paths');
const watchHistoryPaths = require('./paths/watchHistory.paths');
const uploadPaths = require('./paths/upload.paths');
const paymentPaths = require('./paths/payment.paths');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Chill Streams API',
    version: '1.0.0',
    description: `
Backend API for Chill Streams - A streaming platform for movies and series.

## Features
- User authentication with JWT tokens
- Content browsing with filtering and pagination
- User favorites and watch history tracking
- Payment integration with Midtrans
- File upload for avatars

## Rate Limiting
- **General**: 100 requests per 15 minutes (all endpoints)
- **Authentication**: 5 requests per 15 minutes (login, register, etc.)
- **Strict**: 3 requests per hour (logout, sensitive operations)

## Authentication
This API uses JWT (JSON Web Tokens) for authentication. Tokens can be provided in two ways:
1. **Authorization Header**: \`Bearer <token>\`
2. **Cookie**: \`accessToken\` cookie (automatically set on login)

To authenticate requests in Swagger UI:
1. Click the **Authorize** button (lock icon) at the top
2. Enter your JWT token in the format: \`Bearer <your-token-here>\`
3. Click **Authorize**
4. All subsequent requests will include the token automatically

## Getting Started
1. Register a new account: **POST /api/auth/register**
2. Login to get access token: **POST /api/auth/login**
3. Use the token to access protected endpoints

## API Versioning
Both versioned (\`/api/v1/...\`) and non-versioned (\`/api/...\`) routes are supported for backward compatibility.
    `.trim(),
    contact: {
      name: 'Chill Streams Team',
      email: 'chillstreamsss00@gmail.com'
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT'
    }
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server'
    }
  ],
  tags: tags,
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT token in the format: Bearer <token>'
      },
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'accessToken',
        description: 'JWT token stored in cookie (automatically set on login)'
      }
    },
    schemas: {
      ...commonSchemas,
      ...authSchemas,
      ...genreSchemas,
      ...contentSchemas,
      ...userSchemas,
      ...watchHistorySchemas,
      ...paymentSchemas
    },
    responses: responses,
    parameters: parameters
  },
  paths: {
    ...authPaths,
    ...genrePaths,
    ...contentPaths,
    ...userPaths,
    ...watchHistoryPaths,
    ...uploadPaths,
    ...paymentPaths,
    
    // System endpoints
    '/api/health': {
      get: {
        tags: ['System'],
        summary: 'Health check',
        description: 'Check if the API server is running and healthy',
        operationId: 'healthCheck',
        responses: {
          200: {
            description: 'Server is healthy',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: {
                      type: 'string',
                      example: 'ok'
                    },
                    message: {
                      type: 'string',
                      example: 'Chill Streams API is running'
                    },
                    timestamp: {
                      type: 'string',
                      format: 'date-time',
                      example: '2024-01-15T10:30:00Z'
                    },
                    environment: {
                      type: 'string',
                      example: 'development'
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api': {
      get: {
        tags: ['System'],
        summary: 'API information',
        description: 'Get API metadata and available endpoints',
        operationId: 'getApiInfo',
        responses: {
          200: {
            description: 'API information retrieved',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    name: {
                      type: 'string',
                      example: 'Chill Streams API'
                    },
                    version: {
                      type: 'string',
                      example: '1.0.0'
                    },
                    description: {
                      type: 'string',
                      example: 'Backend API for Chill Streams application'
                    },
                    documentation: {
                      type: 'string',
                      example: 'http://localhost:3000/api-docs'
                    },
                    endpoints: {
                      type: 'object',
                      additionalProperties: {
                        type: 'string'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

const swaggerOptions = {
  swaggerDefinition,
  apis: []
};

module.exports = swaggerOptions;