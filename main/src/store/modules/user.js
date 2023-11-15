import { getUserInfo } from '@/api/user.js'
const getDefaultState = () => {
  return {
    userInfo: {}
  }
}

const state = getDefaultState()

const mutations = {
  SET_USERINFO: (state, userInfo) => {
    state.userInfo = userInfo
  }
}

const actions = {
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getUserInfo().then(res => {
        commit('SET_USERINFO', res.user)
        resolve()
      })
    })
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
