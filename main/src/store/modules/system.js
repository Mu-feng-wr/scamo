import { login, getRouters } from "@/api/system.js"
import { setToken } from '@/utils/auth'
const getDefaultState = () => {
  return {
    token: '',
    menuList: []
  }
}

const state = getDefaultState()

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_MENULIST: (state, menulist) => {
    state.menuList = menulist
  }
}

const actions = {
  loginHandler ({ commit }, formData) {
    return new Promise((resolve, reject) => {
      login(formData).then(res => {
        commit('SET_TOKEN', res.data.access_token)
        setToken(res.data.access_token)
        resolve()
      })
    })
  },
  getMenulist ({ commit }) {
    return new Promise((resolve, reject) => {
      getRouters().then(res => {
        commit('SET_MENULIST', res.data)
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
