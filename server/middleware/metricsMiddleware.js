const {
  httpRequestDurationMicroseconds,
  httpRequestsTotal,
  httpErrorsTotal
} = require('../utils/metrics');

// Middleware untuk tracking HTTP requests
const metricsMiddleware = (req, res, next) => {
  const startTime = Date.now();
  
  // Capture response finish
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const route = req.route?.path || req.path || 'unknown';
    
    // Skip metrics endpoint itself
    if (route === '/metrics') return;
    
    // Label untuk metrics
    const labels = {
      method: req.method,
      route: route,
      status_code: res.statusCode.toString()
    };
    
    // Record metrics
    httpRequestDurationMicroseconds.observe(labels, duration);
    httpRequestsTotal.inc(labels);
    
    // Track errors (4xx, 5xx)
    if (res.statusCode >= 400) {
      httpErrorsTotal.inc(labels);
    }
  });
  
  next();
};

module.exports = metricsMiddleware;