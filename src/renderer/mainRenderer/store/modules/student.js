const state = {
  loding: false,
  lists: {
    data: [],
    paging: {
      page: 1,
      limit: 10,
      total: 0
    }
  },
  studentForm: {
    name: '',
    phone: '',
    parent_name: '',
    parent_phone: '',
    sex: '',
    level: '',
    note: '',
    teacherUuid: '',
    birth: '',
    address: '',
    age: '',
    status: 10,
    subjects: []
  }
}
const mutations = {
  GET_STUENT_LISTS (state, data) {
    state.lists = data.data
  },
  CHANGE_SIZE (state, data) {
    if (data.limit) {
      state.lists.paging.limit = data.limit
    }
    if (data.page) {
      state.lists.paging.page = data.page
    }
  },
  LODING (state) {
    state.loding = !state.loding
  },

  GET_STUDENT (state, data) {
    var _data = null
    try {
      _data = JSON.stringify(state.lists.data[data.user_id])
      _data = JSON.parse(_data)
      delete _data.id
    } catch (error) {
    }

    if (_data) {
      state.studentForm = _data
    }
  },
  CLEAR_CACHE (state) {
    for (let key in state.studentForm) {
      if (typeof state.studentForm[key] !== 'object') {
        state.studentForm[key] = ''
      } else {
        for (let _key in state.studentForm[key]) {
          state.studentForm[key][_key] = ''
        }
      }
    }
  },
  UPDATE_FORM (state, obj) {
    if (obj.subjects) {
      state.studentForm.subjects[obj.type] = obj.value
    } else {
      state.studentForm[obj.type] = obj.value
    }
  },
  ADD_FORM (state) {
    state.studentForm.subjects.push({
      teacherUuid: '',
      subjectUuid: '',
      total: '',
      count: ''
    })
  },
  REMOVE_FORM (state, index) {
    state.studentForm.subjects.splice(index, 1)
  },
  DELETE_USER (state, index) {
    state.lists.data.splice(index, 1)
  },
  GET_STUENT_ITEM (state, data) {
    state.studentForm = data
  }
}
const actions = {
  GET_STUENT_LISTS ({ commit, dispatch }) {
    commit('LODING')
    this.$api.getStudentList({
      access_token: this.state.userInfo.access_token,
      data: {
        limit: this.state.student.lists.paging.limit,
        page: this.state.student.lists.paging.page
      }
    }).then(data => {
      commit('GET_STUENT_LISTS', data)
      commit('LODING')
    })
  },
  CHANGE_SIZE ({ commit, dispatch }, data) {
    commit('CHANGE_SIZE', data)
    dispatch('GET_STUENT_LISTS')
  },
  GET_STUDENT ({ commit, dispatch }, data) {
    commit('GET_STUDENT', data)
  },
  SUBMIT_FORM ({ commit, dispatch }) {
    commit('LODING')
    var params = {
      access_token: this.state.userInfo.access_token,
      data: this.state.student.studentForm
    }
    if (!this.state.student.studentForm.uuid) {
      return this.$api.addStudent(params)
    } else {
      return this.$api.updateStudent(params)
    }
  },
  DELETE_USER ({ commit, dispatch }, data) {
    if (this.state.student.lists.data[data]) {
      var params = {
        access_token: this.state.userInfo.access_token,
        data: {
          uuid: this.state.student.lists.data[data].uuid
        }
      }
      return this.$api.deleteStudent(params)
    } else {
      return Promise.resolve({success: false})
    }
  },
  GET_STUENT_ITEM ({ commit, dispatch }, data) {
    var params = {
      access_token: this.state.userInfo.access_token,
      data: {
        uuid: data.uuid
      }
    }
    return this.$api.getStudentItem(params)
  }
}
export default {
  state,
  mutations,
  actions
}
