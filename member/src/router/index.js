import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export const constantRoutes = [
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  { path: '*', redirect: '/404', hidden: true },
  {
    path: '/workbenche/todo',
    name: 'workbenche-todo',
    component: () => import('@/views/todo/index.vue'),
    meta: { title: '待办' }
  },
  {
    path: '/workbenche/done',
    name: 'workbenche-done',
    component: () => import('@/views/done/index.vue'),
    meta: { title: '已办' }
  }
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
