export default [
  {
    path: '/asset/change',
    name: 'Asset-Change',
    component: () => import('@/views/change/index.vue'),
    meta: { title: '资产变更' }
  },
  {
    path: '/asset/change/add',
    name: 'Asset-Change-Add',
    component: () => import('@/views/change/edit.vue'),
    meta: { title: '新增资产变更' }
  },
  {
    path: '/asset/change/edit',
    name: 'Asset-Change-Edit',
    component: () => import('@/views/change/edit.vue'),
    meta: { title: '编辑资产变更' }
  },
  {
    path: '/asset/change/detail',
    name: 'Asset-Change-Detail',
    component: () => import('@/views/change/detail.vue'),
    meta: { title: '资产变更详情' }
  }
]