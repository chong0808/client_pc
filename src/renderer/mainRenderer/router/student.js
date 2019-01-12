let routers = [{
  path: '/student',
  name: 'student',
  components: {
    default: require('@/pages/student/center-content').default
  },
  children: [
    {
      path: '/addStudent/:user_id',
      name: 'addStudent',
      components: {
        addPage: require('@/pages/student/addPage').default
      },
      props: (route) => ({ query: route.query.user_id })
    }
  ]
}
]
module.exports = routers
