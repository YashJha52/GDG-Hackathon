const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    [
      '/login', 
      '/get-tasks', 
      '/analyze-and-save', 
      '/get-dashboard-data',
      '/get-future-plan',
      '/test-analysis',
      '/health'
    ],
    createProxyMiddleware({
      target: 'http://localhost:5001',
      changeOrigin: true,
    })
  );
};