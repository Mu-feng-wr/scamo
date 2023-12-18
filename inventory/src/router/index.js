import Vue from 'vue'
import Router from 'vue-router'
import feedbackRouter from './page/feedback.js'
import gainRouter from './page/gain.js'
import lossRouter from './page/loss.js'
import planRouter from './page/plan.js'
import reportRouter from './page/report.js'
import taskRouter from './page/task.js'

Vue.use(Router)

export const constantRoutes = [
  ...feedbackRouter,
  ...gainRouter,
  ...lossRouter,
  ...planRouter,
  ...reportRouter,
  ...taskRouter,
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
