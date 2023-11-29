import { login, getRouters } from '@/api/system.js'
import { setToken, removeToken } from '@/utils/auth'
import router from '../../router'
import Layout from '@/layout'
import { getUserInfo } from '@/api/user.js'
const getDefaultState = () => {
  return {
    token: '',
    menuList: [],
    cachedViews: [{ title: '首页', path: '/dashboard' }],
    userInfo: {},
    sidebarRouters: [],
    permissions: [],
    roles: []
  }
}

const state = getDefaultState()

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_MENULIST: (state, menulist) => {
    state.menuList = menulist
  },
  SET_CACHEVIEWS: (state, cachedViews) => {
    state.cachedViews = cachedViews
  },
  SET_USERINFO: (state, userInfo) => {
    state.userInfo = userInfo
  },
  SET_SIDEBARROUTERS: (state, sidebarRouters) => {
    state.sidebarRouters = sidebarRouters
  },
  SET_PERMISSIONS: (state, permissions) => {
    state.permissions = permissions
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
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
        const routerList = menuRecursion(res.data)
        commit('SET_MENULIST', routerList)
        commit('SET_SIDEBARROUTERS', routerList)
        router.addRoutes(routerList)
        resolve()
      })
    })
  },
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getUserInfo().then(res => {
        commit('SET_USERINFO', res.user)
        commit('SET_PERMISSIONS', res.permissions)
        commit('SET_ROLES', res.roles)
        resolve()
      })
    })
  },
  logout({ commit }) {
    commit('SET_MENULIST', [])
    commit('SET_USERINFO', {})
    removeToken()
    router.push('/login')
  }
}

// 递归处理菜单
const menuRecursion = function(list, parent) {
  let menuRouter = []
  menuRouter = list.map((item, i) => {
    const obj = {
      path: `${parent && parent.path ? parent.path + '/' : ''}${item.path}`,
      name: `${parent && parent.name ? parent.name + '-' : ''}${item.name}`,
      meta: { ...item.meta, module: parent && parent.name ? parent.name : '' }
    }
    if (item.children && item.children.length > 0) {
      obj.children = menuRecursion(item.children, item)
      obj.component = Layout
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

