/**
 * Upload API paths
 */

const uploadPaths = {
  '/api/upload': {
    post: {
      tags: ['Upload'],
      summary: 'Upload avatar/image',
      description: 'Upload an avatar or image file. Max file size: 2MB. Accepts image files only (jpg, jpeg, png, gif). Authentication required.',
      operationId: 'uploadAvatar',
      security: [
        { bearerAuth: [] },
        { cookieAuth: [] }
      ],
      requestBody: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              properties: {
                avatar: {
                  type: 'string',
                  format: 'binary',
                  description: 'Image file to upload'
                }
              },
              required: ['avatar']
            }
          }
        }
      },
      responses: {
        201: {
          description: 'File uploaded successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SuccessResponse'
              },
              example: {
                success: true,
                message: 'File uploaded successfully',
                data: {
                  url: 'http://localhost:3000/uploads/avatars/avatar_1_1705750200000.jpg',
                  filename: 'avatar_1_1705750200000.jpg',
                  size: 1048576,
                  mimetype: 'image/jpeg'
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
        413: {
          description: 'File too large',
          content: {
            'application/json': {
              example: {
                success: false,
                message: 'File too large. Maximum 2MB allowed.',
                code: 'FILE_TOO_LARGE'
              }
            }
          }
        },
        415: {
          description: 'Unsupported file type',
          content: {
            'application/json': {
              example: {
                success: false,
                message: 'Only image files are allowed (jpg, jpeg, png, gif)',
                code: 'UNSUPPORTED_FILE_TYPE'
              }
            }
          }
        },
        500: {
          $ref: '#/components/responses/InternalServerError'
        }
      }
    }
  }
};

module.exports = uploadPaths;