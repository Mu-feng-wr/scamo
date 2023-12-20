export default [
  {
    path: '/gift/receipt',
    name: 'Gift-Receipt',
    component: () => import('@/views/receipt/index.vue'),
    meta: { title: '礼品入库' }
  },
  {
    path: '/gift/receipt/add',
    name: 'Gift-Receipt-Add',
    component: () => import('@/views/receipt/edit.vue'),
    meta: { title: '新增礼品入库' }
  },
  {
    path: '/gift/receipt/edit',
    name: 'Gift-Receipt-Edit',
    component: () => import('@/views/receipt/edit.vue'),
    meta: { title: '编辑礼品入库' }
  },
  {
    path: '/gift/receipt/detail',
    name: 'Gift-Receipt-Detail',
    component: () => import('@/views/receipt/detail.vue'),
    meta: { title: '礼品入库详情' }
  }
]