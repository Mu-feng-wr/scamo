import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = [] // 白名单

router.beforeEach(async(to, from, next) => {
  NProgress.start()

  document.title = getPageTitle(to.meta.title)

  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/') {
      next({ path: '/workbenche/todo' })
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.userInfo
      if (hasGetUserInfo.userId) {
        next()
      } else {
        try {
          const userInfo = window.$wujie.props.userInfo
          const permissions = window.$wujie.props.permissions
          const roles = window.$wujie.props.roles
          store.commit('user/SET_USERINFO', userInfo)
          store.commit('user/SET_PERMISSIONS', permissions)
          store.commit('user/SET_ROLES', roles)
          next({ path: to.redirectedFrom })
        } catch (error) {
          next(`/workbenche/todo`)
          NProgress.done()
        }
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next({ path: '/workbenche/todo' })
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
