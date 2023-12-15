export default [
  {
    path: '/asset/scrap',
    name: 'Asset-Scrap',
    component: () => import('@/views/scrap/index.vue'),
    meta: { title: '资产处置' }
  },
  {
    path: '/asset/scrap/add',
    name: 'Asset-Scrap-Add',
    component: () => import('@/views/scrap/edit.vue'),
    meta: { title: '新增资产处置' }
  },
  {
    path: '/asset/scrap/edit',
    name: 'Asset-Scrap-Edit',
    component: () => import('@/views/scrap/edit.vue'),
    meta: { title: '编辑资产处置' }
  },
  {
    path: '/asset/scrap/detail',
    name: 'Asset-Scrap-Detail',
    component: () => import('@/views/scrap/detail.vue'),
    meta: { title: '资产处置详情' }
  }
]