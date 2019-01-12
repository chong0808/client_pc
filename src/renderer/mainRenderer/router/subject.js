let routers = [{
  path: '/subject',
  components: {
    default: require('@/pages/subject/center-content').default,
    right: require('@/pages/subject/right-content').default
  },
  children: [{
    path: '',
    components: {
      childSubject: require('@/pages/subject/todayManage').default
    }
  }, {
    path: 'todayManage',
    components: {
      childSubject: require('@/pages/subject/todayManage').default
    }
  }, {
    path: 'teacherManage',
    components: {
      childSubject: require('@/pages/subject/teacherManage').default
    },
    children: [{
      path: 'scheduleList',
      name: 'scheduleList',
      components: {
        scheduleDetail: require('@/pages/subject/classSchedule').default
      },
      props: (route) => ({ query: route.query.list })
    }]
  }, {
    path: 'subjectManage',
    components: {
      childSubject: require('@/pages/subject/manage/subjectManage').default
    },
    children: [{
      path: 'addsubject',
      name: 'addsubject',
      components: {
        addPage: require('@/pages/subject/manage/addPage').default
      },
      props: (route) => ({ query: route.query.user_id })
    }]
  }, {
    path: 'schedule',
    components: {
      childSubject: require('@/pages/subject/classSchedule/schedule').default
    },
    children: [{
      path: 'detailSchedule',
      name: 'detailSchedule',
      components: {
        detailSchedule: require('@/pages/subject/classSchedule/detailSchedule').default
      },
      props: (route) => ({ query: route.query.data })
    }]
  }, {
    path: 'awaitManage',
    components: {
      childSubject: require('@/pages/subject/awaitManage').default
    }
  }]
}]
module.exports = routers
