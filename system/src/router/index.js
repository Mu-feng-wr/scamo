import Vue from 'vue'
import Router from 'vue-router'
import configRouter from './page/config.js'
import deptRouter from './page/dept.js'
import dictionariesRouter from './page/dictionaries.js'
import logRouter from './page/log.js'
import menuRouter from './page/menu.js'
import noticeRouter from './page/notice.js'
import postRouter from './page/post.js'
import roleRouter from './page/role.js'
import userRouter from './page/user.js'

Vue.use(Router)

export const constantRoutes = [
  ...configRouter,
  ...deptRouter,
  ...dictionariesRouter,
  ...logRouter,
  ...menuRouter,
  ...noticeRouter,
  ...postRouter,
  ...roleRouter,
  ...userRouter,
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

export default router
