let routers = [{
  path: '/teacher',
  name: 'teacher',
  components: {
    default: require('@/pages/teacher/right-content').default
    // right: require('@/pages/teacher/right-content').default
  },
  meta: {
    keepAlive: false // 是否需要缓存
  },
  children: [
    {
      path: '/addTeacher',
      name: 'addTeacher',
      components: {
        addPage: require('@/pages/teacher/addPage').default
      },
      props: (route) => ({ query: route.query.user_id })
    }
  ]
}]
module.exports = routers
