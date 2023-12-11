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
    path: '/asset/receipt',
    name: 'asset-receipt',
    component: () => import('@/views/receipt/index.vue'),
    meta: { title: '资产入库' }
  },
  {
    path: '/asset/receipt/detail',
    name: 'asset-receipt-detail',
    component: () => import('@/views/receipt/detail.vue'),
    meta: { title: '资产入库详情' }
  },
  {
    path: '/asset/collect',
    name: 'asset-collect',
    component: () => import('@/views/collect/index.vue'),
    meta: { title: '资产领用' }
  },
  {
    path: '/asset/borrow',
    name: 'asset-borrow',
    component: () => import('@/views/borrow/index.vue'),
    meta: { title: '资产借用' }
  },
  {
    path: '/asset/return',
    name: 'asset-return',
    component: () => import('@/views/return/index.vue'),
    meta: { title: '资产归还' }
  },
  {
    path: '/asset/reshuffle',
    name: 'asset-reshuffle',
    component: () => import('@/views/reshuffle/index.vue'),
    meta: { title: '资产异动' }
  },
  {
    path: '/asset/transfer',
    name: 'asset-transfer',
    component: () => import('@/views/transfer/index.vue'),
    meta: { title: '资产调拨' }
  },
  {
    path: '/asset/repair',
    name: 'asset-repair',
    component: () => import('@/views/repair/index.vue'),
    meta: { title: '资产维修' }
  },
  {
    path: '/asset/scrap',
    name: 'asset-scrap',
    component: () => import('@/views/scrap/index.vue'),
    meta: { title: '资产处置' }
  },
  {
    path: '/asset/change',
    name: 'asset-change',
    component: () => import('@/views/change/index.vue'),
    meta: { title: '资产变更' }
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
