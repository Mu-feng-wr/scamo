
const getDefaultState = () => {
  return {
    dupToken: '',
    menuList: []
  }
}

const state = getDefaultState()
const mutations = {
  SET_DUP_TOKEN: (state, token) => {
  },
  SET_MENULIST: (state, menulist) => {
  }
}
const actions = {
  loginHandler({ commit }, formData) {

  },
  getMenulist({ commit }) {

  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
