export default [
  {
    path: '/asset/repair',
    name: 'Asset-Repair',
    component: () => import('@/views/repair/index.vue'),
    meta: { title: '资产维修' }
  },
  {
    path: '/asset/repair/add',
    name: 'Asset-Repair-Add',
    component: () => import('@/views/repair/edit.vue'),
    meta: { title: '新增资产维修' }
  },
  {
    path: '/asset/repair/edit',
    name: 'Asset-Repair-Edit',
    component: () => import('@/views/repair/edit.vue'),
    meta: { title: '修改资产维修' }
  },
  {
    path: '/asset/repair/detail',
    name: 'Asset-Repair-Detail',
    component: () => import('@/views/repair/detail.vue'),
    meta: { title: '资产维修详情' }
  }
]