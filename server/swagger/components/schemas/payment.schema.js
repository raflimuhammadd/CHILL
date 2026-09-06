/**
 * Payment-related schemas
 */

const paymentSchemas = {
  Payment: {
    type: 'object',
    properties: {
      id: {
        type: 'integer',
        example: 1,
        description: 'Payment record ID'
      },
      user_id: {
        type: 'integer',
        example: 1,
        description: 'User ID'
      },
      plan_slug: {
        type: 'string',
        example: 'premium-monthly',
        description: 'Subscription plan slug'
      },
      status: {
        type: 'string',
        enum: ['pending', 'success', 'failed', 'expired'],
        example: 'pending',
        description: 'Payment status'
      },
      amount: {
        type: 'number',
        example: 99000,
        description: 'Payment amount in IDR'
      },
      payment_method: {
        type: 'string',
        example: 'credit_card',
        description: 'Payment method'
      },
      order_code: {
        type: 'string',
        example: 'ORDER-12345',
        description: 'Unique order code'
      },
      transaction_id: {
        type: 'string',
        example: 'TRX-67890',
        description: 'Midtrans transaction ID'
      },
      created_at: {
        type: 'string',
        format: 'date-time',
        example: '2024-01-15T10:30:00Z',
        description: 'Payment creation timestamp'
      },
      updated_at: {
        type: 'string',
        format: 'date-time',
        example: '2024-01-15T10:35:00Z',
        description: 'Payment update timestamp'
      }
    }
  },

  CreatePaymentRequest: {
    type: 'object',
    required: ['plan_slug'],
    properties: {
      plan_slug: {
        type: 'string',
        example: 'premium-monthly',
        description: 'Subscription plan to purchase'
      },
      payment_method: {
        type: 'string',
        example: 'credit_card',
        description: 'Payment method (optional, defaults to Midtrans)'
      },
      card: {
        type: 'object',
        description: 'Card details (if using direct credit card)',
        properties: {
          number: { type: 'string', example: '4811111111111114' },
          expiry_month: { type: 'string', example: '12' },
          expiry_year: { type: 'string', example: '2026' },
          cvv: { type: 'string', example: '123' }
        }
      }
    }
  },

  SnapTokenRequest: {
    type: 'object',
    required: ['plan_slug'],
    properties: {
      plan_slug: {
        type: 'string',
        example: 'premium-monthly',
        description: 'Subscription plan'
      }
    }
  },

  SnapTokenResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: true
      },
      message: {
        type: 'string',
        example: 'Snap token generated successfully'
      },
      data: {
        type: 'object',
        properties: {
          token: {
            type: 'string',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpCJ9...',
            description: 'Midtrans Snap token'
          },
          redirect_url: {
            type: 'string',
            example: 'https://app.sandbox.midtrans.com/snap/v2/vtweb/token',
            description: 'Redirect URL for payment'
          }
        }
      }
    }
  },

  PaymentResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: true
      },
      message: {
        type: 'string',
        example: 'Payment created successfully'
      },
      data: {
        $ref: '#/components/schemas/Payment'
      }
    }
  },

  ClientKeyResponse: {
    type: 'object',
    properties: {
      success: {
        type: 'boolean',
        example: true
      },
      message: {
        type: 'string',
        example: 'Client key retrieved'
      },
      data: {
        type: 'object',
        properties: {
          client_key: {
            type: 'string',
            example: 'SB-Mid-client-YourClientKeyHere',
            description: 'Midtrans client key for frontend'
          }
        }
      }
    }
  },

  MidtransNotification: {
    type: 'object',
    description: 'Midtrans webhook notification payload',
    properties: {
      transaction_time: { type: 'string', example: '2024-01-15 10:30:00' },
      transaction_status: { type: 'string', example: 'capture' },
      transaction_id: { type: 'string', example: 'TRX-67890' },
      status_code: { type: 'string', example: '200' },
      signature_key: { type: 'string' },
      order_id: { type: 'string', example: 'ORDER-12345' },
      merchant_id: { type: 'string' },
      gross_amount: { type: 'string', example: '99000.00' },
      fraud_status: { type: 'string', example: 'accept' },
      payment_type: { type: 'string', example: 'credit_card' }
    }
  }
};

module.exports = paymentSchemas;