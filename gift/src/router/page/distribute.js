export default [
  {
    path: '/gift/distribute',
    name: 'Gift-Distribute',
    component: () => import('@/views/distribute/index.vue'),
    meta: { title: '礼品派发' }
  },
  {
    path: '/gift/distribute/add',
    name: 'Gift-Distribute-Add',
    component: () => import('@/views/distribute/edit.vue'),
    meta: { title: '新增礼品派发' }
  },
  {
    path: '/gift/distribute/edit',
    name: 'Gift-Distribute-Edit',
    component: () => import('@/views/distribute/edit.vue'),
    meta: { title: '编辑礼品派发' }
  },
  {
    path: '/gift/distribute',
    name: 'Gift-Distribute',
    component: () => import('@/views/distribute/detail.vue'),
    meta: { title: '礼品派发查看' }
  }
]