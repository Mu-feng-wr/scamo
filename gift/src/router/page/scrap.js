export default [
  {
    path: '/gift/scrap',
    name: 'Gift-Scrap',
    component: () => import('@/views/scrap/index.vue'),
    meta: { title: '礼品处置' }
  },
  {
    path: '/gift/scrap/add',
    name: 'Gift-Scrap-Add',
    component: () => import('@/views/scrap/edit.vue'),
    meta: { title: '新增礼品处置' }
  },
  {
    path: '/gift/scrap/edit',
    name: 'Gift-Scrap-Edit',
    component: () => import('@/views/scrap/edit.vue'),
    meta: { title: '编辑礼品处置' }
  },
  {
    path: '/gift/scrap/detail',
    name: 'Gift-Scrap-Detail',
    component: () => import('@/views/scrap/detail.vue'),
    meta: { title: '礼品处置详情' }
  }
]