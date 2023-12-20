const getDefaultState = () => {
  return {
    userInfo: {},
    permissions: [],
    roles: []
  }
}

const state = getDefaultState()

const mutations = {
  SET_USERINFO: (state, userInfo) => {
    state.userInfo = userInfo
  },
  SET_PERMISSIONS: (state, permissions) => {
    state.permissions = permissions
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = { }
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
