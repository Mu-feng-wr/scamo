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
    path: '/standbook/classificationMaterialAccount',
    name: 'standbook-classificationMaterialAccount',
    component: () => import('@/views/library/index.vue'),
    meta: { title: '分类' },
    props: {
      type: 'classificationMaterialAccount'
    }
  },
  {
    path: '/standbook/organizationMaterialAccount',
    name: 'standbook0-organizationMaterialAccount',
    component: () => import('@/views/library/index.vue'),
    meta: { title: '组织' },
    props: {
      type: 'organizationMaterialAccount'
    }
  },
  {
    path: '/standbook/locationMaterialAccount',
    name: 'standbook-locationMaterialAccount',
    component: () => import('@/views/library/index.vue'),
    meta: { title: '库位' },
    props: {
      type: 'locationMaterialAccount'
    }
  },
  {
    path: '/standbook/indexMaterialAccount',
    name: 'standbook-indexMaterialAccount',
    component: () => import('@/views/library/index.vue'),
    meta: { title: '我的' },
    props: {
      type: 'personage'
    }
  },
  {
    path: '/standbook/materialPart',
    name: 'standbook-materialPart',
    component: () => import('@/views/materialPart/index.vue'),
    meta: { title: '配件' }
  },
  {
    path: '/standbook/materialRegister',
    name: 'standbook-materialRegister',
    component: () => import('@/views/materialRegister/index.vue'),
    meta: { title: '登记' }
  },
  {
    path: '/standbook/materialRegister/detail',
    name: 'standbook-materialRegister-detail',
    component: () => import('@/views/materialRegister/detail.vue'),
    meta: { title: '登记详情' }
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
