/**
 * 整个生命周期内可重复使用的值
 */

const state = {
  subjectCache: [],
  teacherCache: [],
  salesCache: []
}

const mutations = {
  // 启动获取用户信息
  GET_APP_CACHE (state, data) {
    var _data = data.data || {}
    state.subjectCache = _data.subject || []
    state.teacherCache = _data.teacher || []
    state.roomCache = data.room || []
  }
}
const actions = {
  GET_APP_CACHE ({ commit, dispatch }) {
    dispatch('GET_USER_INFO')
    let params = {
      access_token: this.state.userInfo.access_token
    }
    this.$api.gobalCache(params).then(data => {
      commit('GET_APP_CACHE', data)
    })
  },
  GET_APP_NUM ({ commit, dispatch }) {
    let params = {
      access_token: this.state.userInfo.access_token
    }
    return this.$api.getAppNum(params)
  }
}

export default {
  state,
  mutations,
  actions
}
