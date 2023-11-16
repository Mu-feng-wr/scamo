import router from './router'
import store from './store'
// import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/register'] // 白名单



router.beforeEach(async (to, from, next) => {
  NProgress.start()
  document.title = getPageTitle(to.meta.title)
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      try {
        const menuList = store.getters.menuList
        const userInfo = store.getters.userInfo
        if (!userInfo.userId) {
          await store.dispatch('user/getInfo')
        }
        if (!menuList || menuList.length <= 0) {
          // 请求并获取菜单
          await store.dispatch('system/getMenulist')
          next({ path: to.redirectedFrom})
        } else {
          next()
        }


      } catch (err) {
        console.log(err)
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
