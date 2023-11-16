import { login, getRouters } from '@/api/system.js'
import { setToken } from '@/utils/auth'
import router from '../../router'
import Layout from '@/layout'
import unificationPage from '@/views/unificationPage/index.vue'
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
  loginHandler({ commit }, formData) {
    return new Promise((resolve, reject) => {
      login(formData).then(res => {
        commit('SET_TOKEN', res.data.access_token)
        setToken(res.data.access_token)
        resolve()
      })
    })
  },
  getMenulist({ commit }) {
    return new Promise((resolve, reject) => {
      getRouters().then(res => {
        commit('SET_MENULIST', res.data)
        const routerList = menuRecursion( res.data)
        router.addRoutes(routerList)
        resolve()
      })
    })
  }
}


// 递归处理菜单
const menuRecursion = function (list) {
  let menuRouter = []
  menuRouter = list.map(item => {
    const obj = {
      path: item.path,
      name: item.name,
      meta: item.meta
    }
    if (item.children && item.children.length > 0) {
      obj.children = menuRecursion(item.children)
      obj.component = Layout
    } else {
      obj.component = unificationPage
    }
    return obj
  })
  return menuRouter
}


export default {
  namespaced: true,
  state,
  mutations,
  actions
}

