export default {
  '/api': {
    target: 'http://localhost:8887/service/',
    changeOrigin: true,
    pathRewrite: {
      '^/api': ''
    }
  },
  '/mock': {
    target: 'http://127.0.0.1:4523/m1/2242039-0-default/',
    changeOrigin: true,
    pathRewrite: {
      '^/mock': ''
    }
  }
};
