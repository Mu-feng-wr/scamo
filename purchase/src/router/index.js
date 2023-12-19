import Vue from 'vue'
import Router from 'vue-router'
import applicationRouter from './page/application.js'
import rejectRouter from './page/reject.js'
import shipmentRouter from './page/shipment.js'
import purchaseRouter from './page/purchase.js'

Vue.use(Router)

export const constantRoutes = [
  ...applicationRouter,
  ...rejectRouter,
  ...shipmentRouter,
  ...purchaseRouter,
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
