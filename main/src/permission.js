import router from './router'
import store from './store'
// import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // 白名单

router.beforeEach(async(to, from, next) => {
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
        if (!menuList || menuList.length <= 0) {
          await store.dispatch('system/getMenulist')
        }
        next()
      } catch (err) {
        console.log(err)
      }
      // const hasGetUserInfo = store.getters.name
      // if (hasGetUserInfo) {
      //   next()
      // } else {
      //   try {
      //     await store.dispatch('system/getMenulist')
      //     next({...to})
      //   } catch (error) {
      //     // await store.dispatch('user/resetToken')
      //     Message.error(error || 'Has Error')
      //     next(`/login`)
      //     NProgress.done()
      //   }
      // }
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
