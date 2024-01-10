import Vue from 'vue'
import Router from 'vue-router'
import appRouter from './page/app.js'
import orderRouter from './page/order.js'
import customerRouter from './page/customer.js'

Vue.use(Router)

export const constantRoutes = [
  ...appRouter,
  ...orderRouter,
  ...customerRouter,
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
