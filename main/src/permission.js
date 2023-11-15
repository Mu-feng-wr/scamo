import router from './router'
import store from './store'
// import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import Layout from '@/layout'
import unificationPage from '@/views/unificationPage/index.vue';

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/register'] // 白名单

// 递归处理菜单
const menuRecursion = function(list) {
  let menuRouter = []
  menuRouter = list.map(item => {
    let obj = {
      path: item.path,
      name: item.name,
      meta: item.meta
    }
    if (item.children && item.children.length > 0) {
      obj.children = menuRecursion(item.children)
      obj.component = Layout
    }else{
      obj.component = unificationPage
    }
    return obj
  })
  return menuRouter
}



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
        const userInfo=store.getters.userInfo
        if(!userInfo.userId){
         await store.dispatch('user/getInfo')
        }
        if (!menuList || menuList.length <= 0) {
          // 请求并获取菜单
          let menuList = await store.dispatch('system/getMenulist')
          // 处理菜单
          let routerList=menuRecursion(menuList)
          // 调用路由方法  新增理由列表
          router.addRoutes(routerList)
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
