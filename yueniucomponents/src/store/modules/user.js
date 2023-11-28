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

const actions = { }
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
