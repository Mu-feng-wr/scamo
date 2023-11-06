
import { login, getMenu } from '@/api/dup/system.js'
import Cookies from 'js-cookie'
const getDefaultState = () => {
  return {
    dupToken: '',
    menuList: []
  }
}

const state = getDefaultState()
const mutations = {
  SET_DUP_TOKEN: (state, token) => {
    state.dupToken = token
  },
  SET_MENULIST: (state, menulist) => {
    state.menuList = menulist
  }
}
const actions = {
  loginHandler({ commit }, formData) {
    return new Promise((resolve, reject) => {
      login(formData).then(res => {
        Cookies.set('dupToken', res.token)
        getMenu().then(res => {
          commit('SET_MENULIST', res.menuList)
        })
        resolve(res)
      })
    })
  },
  getMenulist({ commit }) {
    getMenu().then(res => {
      commit('SET_MENULIST', res.menuList)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
