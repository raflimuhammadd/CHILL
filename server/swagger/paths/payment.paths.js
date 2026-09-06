/**
 * Payment API paths
 */

const paymentPaths = {
  '/api/payments': {
    post: {
      tags: ['Payments'],
      summary: 'Create payment',
      description: 'Create a new payment for subscription plan. Authentication required.',
      operationId: 'createPayment',
      security: [
        { bearerAuth: [] },
        { cookieAuth: [] }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/CreatePaymentRequest'
            },
            example: {
              plan_slug: 'premium-monthly',
              payment_method: 'credit_card'
            }
          }
        }
      },
      responses: {
        201: {
          description: 'Payment created successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/PaymentResponse'
              },
              example: {
                success: true,
                message: 'Payment created successfully',
                data: {
                  id: 1,
                  user_id: 1,
                  plan_slug: 'premium-monthly',
                  status: 'pending',
                  amount: 99000,
                  payment_method: 'credit_card',
                  order_code: 'ORDER-12345',
                  transaction_id: null,
                  created_at: '2024-01-15T10:30:00Z',
                  updated_at: '2024-01-15T10:30:00Z'
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
        500: {
          $ref: '#/components/responses/InternalServerError'
        }
      }
    }
  },

  '/api/payments/{orderCode}': {
    get: {
      tags: ['Payments'],
      summary: 'Get payment by order code',
      description: 'Retrieve payment details by order code. Authentication required.',
      operationId: 'getPaymentByOrderCode',
      security: [
        { bearerAuth: [] },
        { cookieAuth: [] }
      ],
      parameters: [
        {
          name: 'orderCode',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
            example: 'ORDER-12345'
          },
          description: 'Payment order code'
        }
      ],
      responses: {
        200: {
          description: 'Payment retrieved successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/PaymentResponse'
              },
              example: {
                success: true,
                message: 'Payment retrieved successfully',
                data: {
                  id: 1,
                  user_id: 1,
                  plan_slug: 'premium-monthly',
                  status: 'success',
                  amount: 99000,
                  payment_method: 'credit_card',
                  order_code: 'ORDER-12345',
                  transaction_id: 'TRX-67890',
                  created_at: '2024-01-15T10:30:00Z',
                  updated_at: '2024-01-15T10:35:00Z'
                }
              }
            }
          }
        },
        401: {
          $ref: '#/components/responses/Unauthorized'
        },
        404: {
          $ref: '#/components/responses/NotFound'
        },
        500: {
          $ref: '#/components/responses/InternalServerError'
        }
      }
    }
  },

  '/api/payments/{orderCode}/verify': {
    post: {
      tags: ['Payments'],
      summary: 'Verify payment status',
      description: 'Verify and update payment status from payment gateway. Authentication required.',
      operationId: 'verifyPayment',
      security: [
        { bearerAuth: [] },
        { cookieAuth: [] }
      ],
      parameters: [
        {
          name: 'orderCode',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
            example: 'ORDER-12345'
          },
          description: 'Payment order code'
        }
      ],
      responses: {
        200: {
          description: 'Payment verified successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/PaymentResponse'
              },
              example: {
                success: true,
                message: 'Payment verified successfully',
                data: {
                  id: 1,
                  user_id: 1,
                  plan_slug: 'premium-monthly',
                  status: 'success',
                  amount: 99000,
                  payment_method: 'credit_card',
                  order_code: 'ORDER-12345',
                  transaction_id: 'TRX-67890',
                  created_at: '2024-01-15T10:30:00Z',
                  updated_at: '2024-01-15T10:35:00Z'
                }
              }
            }
          }
        },
        401: {
          $ref: '#/components/responses/Unauthorized'
        },
        404: {
          $ref: '#/components/responses/NotFound'
        },
        500: {
          $ref: '#/components/responses/InternalServerError'
        }
      }
    }
  },

  '/api/payments/snap-token': {
    post: {
      tags: ['Payments'],
      summary: 'Create Midtrans Snap token',
      description: 'Generate Midtrans Snap token for payment page. Authentication required.',
      operationId: 'createSnapToken',
      security: [
        { bearerAuth: [] },
        { cookieAuth: [] }
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/SnapTokenRequest'
            },
            example: {
              plan_slug: 'premium-monthly'
            }
          }
        }
      },
      responses: {
        201: {
          description: 'Snap token generated successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SnapTokenResponse'
              },
              example: {
                success: true,
                message: 'Snap token generated successfully',
                data: {
                  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                  redirect_url: 'https://app.sandbox.midtrans.com/snap/v2/vtweb/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
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
        500: {
          $ref: '#/components/responses/InternalServerError'
        }
      }
    }
  },

  '/api/payments/midtrans/notification': {
    post: {
      tags: ['Payments'],
      summary: 'Midtrans payment notification webhook',
      description: 'Webhook endpoint for Midtrans payment notifications. Public endpoint (no authentication required).',
      operationId: 'midtransNotification',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/MidtransNotification'
            },
            example: {
              transaction_time: '2024-01-15 10:35:00',
              transaction_status: 'capture',
              transaction_id: 'TRX-67890',
              status_code: '200',
              signature_key: 'abc123def456...',
              order_id: 'ORDER-12345',
              merchant_id: 'M001234',
              gross_amount: '99000.00',
              fraud_status: 'accept',
              payment_type: 'credit_card'
            }
          }
        }
      },
      responses: {
        200: {
          description: 'Notification processed successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SuccessResponse'
              },
              example: {
                success: true,
                message: 'Notification processed successfully'
              }
            }
          }
        },
        400: {
          $ref: '#/components/responses/BadRequest'
        },
        500: {
          $ref: '#/components/responses/InternalServerError'
        }
      }
    }
  },

  '/api/payments/config/client-key': {
    get: {
      tags: ['Payments'],
      summary: 'Get Midtrans client key',
      description: 'Retrieve Midtrans client key for frontend integration. Public endpoint.',
      operationId: 'getMidtransClientKey',
      responses: {
        200: {
          description: 'Client key retrieved successfully',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ClientKeyResponse'
              },
              example: {
                success: true,
                message: 'Client key retrieved',
                data: {
                  client_key: 'SB-Mid-client-bGn-S0lemItUxobg'
                }
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

module.exports = paymentPaths;