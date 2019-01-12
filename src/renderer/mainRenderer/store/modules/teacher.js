const state = {
  lists: {
    data: [],
    paging: {
      page: 1,
      limit: 10,
      total: 10
    }
  },
  teacherForm: {
    name: '',
    phone: '',
    level: '',
    note: '',
    subjectsUuid: '',
    birth: '',
    desc: '',
    join_time: new Date(),
    job_status: 10,
    address: ''
  }
}
const mutations = {
  // 启动获取用户信息
  TEACHER_GET_LIST (state, data) {
    state.lists = data
  },
  TEACHER_CHANGE_SIZE (state, data) {
    if (data.limit) {
      state.lists.paging.limit = data.limit
    }
    if (data.page) {
      state.lists.paging.page = data.page
    }
  },
  TEACHER_GET_STUDENT (state, data) {
    var _data = null
    try {
      _data = JSON.stringify(state.lists.data[data.user_id])
      _data = JSON.parse(_data)
      delete _data.id
    } catch (error) {
    }
    if (_data) {
      state.teacherForm = _data
    }
  },
  TEACHER_CLEAR_CACHE (state) {
    for (let key in state.teacherForm) {
      if (typeof state.teacherForm[key] !== 'object') {
        state.teacherForm[key] = ''
      } else {
        for (let _key in state.teacherForm[key]) {
          state.teacherForm[key][_key] = ''
        }
      }
    }
  },
  TEACHER_UPDATE_FORM (state, obj) {
    state.teacherForm[obj.type] = obj.value
  },
  TEACHER_DELETE_USER (state, index) {
    state.lists.data.splice(0, index)
  }
}
const actions = {
  TEACHER_GET_LIST ({ commit, dispatch }) {
    let params = {
      access_token: this.state.userInfo.access_token,
      data: this.state.teacher.lists.paging
    }
    return this.$api.teacherList(params)
  },
  TEACHER_CHANGE_SIZE ({ commit, dispatch }, data) {
    commit('TEACHER_CHANGE_SIZE', data)
    return dispatch('TEACHER_GET_LIST')
  },
  TEACHER_SUBMIT_FORM ({ commit, dispatch }) {
    var params = {
      access_token: this.state.userInfo.access_token,
      data: this.state.teacher.teacherForm
    }
    if (!this.state.teacher.teacherForm.uuid) {
      return this.$api.addTeacher(params)
    } else {
      return this.$api.updateTeacher(params)
    }
  },
  TEACHER_DELETE_USER ({ commit, dispatch }, data) {
    if (this.state.teacher.lists.data[data]) {
      var params = {
        access_token: this.state.userInfo.access_token,
        data: {
          uuid: this.state.teacher.lists.data[data].uuid
        }
      }
      return this.$api.deleteTeacher(params)
    } else {
      return Promise.resolve({ success: false })
    }
  }
}
export default {
  state,
  mutations,
  actions
}
