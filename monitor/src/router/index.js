import Vue from 'vue'
import Router from 'vue-router'
import onlineRouter from './page/online.js'
import jobRouter from './page/job.js'

Vue.use(Router)

export const constantRoutes = [
  ...onlineRouter,
  ...jobRouter,
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
