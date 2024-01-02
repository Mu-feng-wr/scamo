import Vue from 'vue'
import Router from 'vue-router'
import accountRouter from './page/account.js'
import consumeRouter from './page/consume.js'
import contractRouter from './page/contract.js'
import projectRouter from './page/project.js'
import schemeRouter from './page/scheme.js'
import smsRouter from './page/sms.js'
import supplierRouter from './page/supplier.js'
import agreementRouter from './page/agreement.js'

Vue.use(Router)

export const constantRoutes = [
  ...accountRouter,
  ...consumeRouter,
  ...contractRouter,
  ...projectRouter,
  ...schemeRouter,
  ...smsRouter,
  ...supplierRouter,
  ...agreementRouter,
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
