const client = require('prom-client');

const collectDefaultMetrics = client.collectDefaultMetrics;

// Collect default metrics every 5 seconds
collectDefaultMetrics({
  timeout: 5000,
  prefix: 'nodejs_',
  gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5]
});

// HTTP request duration histogram (response time)
const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in milliseconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [10, 50, 100, 200, 500, 1000, 2000, 5000]
});

// HTTP request counter (total requests)
const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

// Error counter (for 4xx, 5xx errors)
const httpErrorsTotal = new client.Counter({
  name: 'http_errors_total',
  help: 'Total number of HTTP errors (4xx, 5xx)',
  labelNames: ['method', 'route', 'status_code']
});

// Database query duration
const dbQueryDuration = new client.Histogram({
  name: 'db_query_duration_ms',
  help: 'Duration of database queries in milliseconds',
  labelNames: ['operation', 'table'],
  buckets: [1, 5, 10, 25, 50, 100, 250, 500]
});

// Active users (gauge - bisa diupdate dari auth middleware)
const activeUsers = new client.Gauge({
  name: 'active_users_total',
  help: 'Number of currently active users (with valid JWT)'
});

// Custom metric: API health check
const apiHealth = new client.Gauge({
  name: 'api_health_status',
  help: 'API health status (1=healthy, 0=unhealthy)'
});

// Register metrics
const register = client.register;

module.exports = {
  client,
  register,
  httpRequestDurationMicroseconds,
  httpRequestsTotal,
  httpErrorsTotal,
  dbQueryDuration,
  activeUsers,
  apiHealth,
  metricsMiddleware: null  // Will be set below
};