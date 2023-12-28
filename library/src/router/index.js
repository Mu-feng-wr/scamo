import Vue from 'vue'
import Router from 'vue-router'
import categoryRouter from './page/category.js'
import materialRouter from './page/material.js'
import brandRouter from './page/brand.js'
import addressRouter from './page/address.js'

Vue.use(Router)

export const constantRoutes = [
  ...categoryRouter,
  ...materialRouter,
  ...brandRouter,
  ...addressRouter,
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
