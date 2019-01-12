let url = process.env.NODE_ENV === 'production' ? 'http://140.143.205.220:3001' : 'http://localhost:3001'
const config = {
  url: url,
  auth: '/auth',
  version: '/v1.0',
  router: '/E001-001',
  api: '/api',
  apiRouter: '/E002-50'
}

module.exports = config
