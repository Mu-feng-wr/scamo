import Vue from 'vue'
import Router from 'vue-router'
import receiptRouter from './page/receipt.js'
import collectRouter from './page/collect.js'
import borrowRouter from './page/borrow.js'
import returnRouter from './page/return.js'
import reshuffleRouter from './page/reshuffle.js'
import transferRouter from './page/transfer.js'
import repairRouter from './page/repair.js'
import scrapRouter from './page/scrap.js'
import changeRouter from './page/change.js'

Vue.use(Router)

export const constantRoutes = [
  ...receiptRouter,
  ...collectRouter,
  ...borrowRouter,
  ...returnRouter,
  ...reshuffleRouter,
  ...transferRouter,
  ...repairRouter,
  ...scrapRouter,
  ...changeRouter,
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
