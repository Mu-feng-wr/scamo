import Vue from 'vue'
import Router from 'vue-router'
import receiptRouter from './page/receipt.js'
import collectRouter from './page/collect.js'
import borrowRouter from './page/borrow.js'
import returnRouter from './page/return.js'
import distributeRouter from './page/distribute.js'
import reshuffleRouter from './page/reshuffle.js'
import transferRouter from './page/transfer.js'
import scrapRouter from './page/scrap.js'

Vue.use(Router)

export const constantRoutes = [
  ...receiptRouter,
  ...collectRouter,
  ...borrowRouter,
  ...returnRouter,
  ...distributeRouter,
  ...reshuffleRouter,
  ...transferRouter,
  ...scrapRouter,
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
