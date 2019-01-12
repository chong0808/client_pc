const state = {
  subjectList: {
    data: [],
    paging: {
      page: 1,
      limit: 10,
      total: 50
    }
  },
  unScheduleList: {
    data: [],
    paging: {
      page: 1,
      limit: 10,
      total: 50
    }
  },
  isReload: false
}

const mutations = {
  // 启动获取用户信息
  SUBJECT_GET_LIST (state, data) {
    var _data = data.data || {}
    state.subjectList.data = _data.data || []
    state.subjectList.paging = _data.paging || {}
  },
  SUBJECT_CHANGE_SIZE (state, data) {
    if (data.limit) {
      state.subjectList.paging.limit = data.limit
    }
    if (data.page) {
      state.subjectList.paging.page = data.page
    }
  },
  SUBJECT_SUBMIT_FORM (state, data) {
    console.log(state)
  },
  GET_UNSCHEDULELISTS (state, data) {
    state.unScheduleList = data
  },
  RELOAD_DATA (state, data) {
    state.isReload = data
  }
}
const actions = {
  SUBJECT_GET_LIST ({ commit, dispatch }) {
    let params = {
      access_token: this.state.userInfo.access_token,
      data: this.state.subject.subjectList.paging
    }
    return this.$api.subjectList(params)
  },
  SUBJECT_SUBMIT_FORM ({ commit, dispatch }, data) {
    let params = {
      access_token: this.state.userInfo.access_token,
      data: data
    }
    if (!data.uuid) {
      return this.$api.subjectAdd(params)
    } else {
      return this.$api.subjectupdate(params)
    }
  },
  // 删除学生
  DELETE_SUBJECT ({commit, dispatch}, index) {
    let params = {
      access_token: this.state.userInfo.access_token,
      data: {
        uuid: this.state.subject.subjectList.data[index].uuid
      }
    }
    return this.$api.deletesubject(params)
  },
  // 取未排课的学生
  GET_UNSEDULE_LIST ({ commit, dispatch }, data = {}) {
    let params = {
      access_token: this.state.userInfo.access_token,
      data: data
    }
    return new Promise((resolve, reject) => {
      this.$api.getClassUnSchedule(params).then(data => {
        commit('GET_UNSCHEDULELISTS', data.data)
        resolve({success: true})
      }).catch(e => {
        resolve({ success: false })
      })
    })
  },
  SUBMIT_SCHEDULE ({ commit, dispatch }, data = {}) {
    let params = {
      access_token: this.state.userInfo.access_token,
      data: data
    }
    return this.$api.submitSchedule(params)
  },
  SCHEDULE_LISTS ({ commit, dispatch }, data = {}) {
    let params = {
      access_token: this.state.userInfo.access_token,
      data: data
    }
    return this.$api.scheduleList(params)
  },
  QUERRY_SCHEDULE ({ commit, dispatch }, data = []) {
    let params = {
      access_token: this.state.userInfo.access_token,
      data: data
    }
    return this.$api.querySchedule(params)
  },
  UPDATE_SCHEDULE ({ commit, dispatch }, data = {}) {
    let params = {
      access_token: this.state.userInfo.access_token,
      data: data
    }
    return this.$api.updateSchedule(params)
  },
  ADDATENDANCE ({ commit, dispatch }, data) {
    let params = {
      access_token: this.state.userInfo.access_token,
      data: data
    }
    return this.$api.addAttendance(params)
  },
  ATENDANCELIST ({ commit, dispatch }, data) {
    let params = {
      access_token: this.state.userInfo.access_token,
      data: data
    }
    return this.$api.attendanceLists(params)
  }

}

export default {
  state,
  mutations,
  actions
}
