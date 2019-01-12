let routers = [{
  path: '/setting',
  name: 'setting',
  components: {
    default: require('@/pages/setting/center-content').default,
    right: require('@/pages/setting/right-content').default
  },
  meta: {
    keepAlive: true // 不需要缓存
  }
}]
module.exports = routers
