export default [
  {
    path: '/asset/return',
    name: 'Asset-Return',
    component: () => import('@/views/return/index.vue'),
    meta: { title: '资产归还' }
  },
  {
    path: '/asset/return/detail',
    name: 'Asset-Return-Detail',
    component: () => import('@/views/return/detail.vue'),
    meta: { title: '资产归还详情' }
  },
  {
    path: '/asset/return/edit',
    name: 'Asset-Return-Edit',
    component: () => import('@/views/return/edit.vue'),
    meta: { title: '编辑资产归还' }
  },
  {
    path: '/asset/return/add',
    name: 'Asset-Return-Add',
    component: () => import('@/views/return/edit.vue'),
    meta: { title: '新增资产归还' }
  }
]