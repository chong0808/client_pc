let routers = [{
  path: '/wechat',
  name: 'wechat',
  components: {
    default: require('@/pages/wechat/center-content').default,
    right: require('@/pages/wechat/right-content').default
  },
  meta: {
    keepAlive: true // 不需要缓存
  }
}]
module.exports = routers
