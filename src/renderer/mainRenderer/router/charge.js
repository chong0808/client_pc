let routers = [{
  path: '/charge',
  name: 'charge',
  components: {
    default: require('@/pages/charge/center-content').default,
    right: require('@/pages/charge/right-content').default
  },
  meta: {
    keepAlive: true // 不需要缓存
  }
}]
module.exports = routers
