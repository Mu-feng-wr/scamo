export default [
  {
    path: '/gift/collect',
    name: 'Gift-Collect',
    component: () => import('@/views/collect/index.vue'),
    meta: { title: '礼品领用' }
  },
  {
    path: '/gift/collect/add',
    name: 'Gift-Collect-Add',
    component: () => import('@/views/collect/edit.vue'),
    meta: { title: '新增礼品领用' }
  },
  {
    path: '/gift/collect/edit',
    name: 'Gift-Collect-Edit',
    component: () => import('@/views/collect/edit.vue'),
    meta: { title: '编辑礼品领用' }
  },
  {
    path: '/gift/collect/detail',
    name: 'Gift-Collect-Detail',
    component: () => import('@/views/collect/detail.vue'),
    meta: { title: '礼品领用详情' }
  }
]