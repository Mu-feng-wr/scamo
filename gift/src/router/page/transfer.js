export default [
  {
    path: '/gift/transfer',
    name: 'Gift-Transfer',
    component: () => import('@/views/transfer/index.vue'),
    meta: { title: '礼品调拨' }
  },
  {
    path: '/gift/transfer/add',
    name: 'Gift-Transfer-Add',
    component: () => import('@/views/transfer/edit.vue'),
    meta: { title: '新增礼品调拨' }
  },
  {
    path: '/gift/transfer/edit',
    name: 'Gift-Transfer-Edit',
    component: () => import('@/views/transfer/edit.vue'),
    meta: { title: '编辑礼品调拨' }
  },
  {
    path: '/gift/transfer/detail',
    name: 'Gift-Transfer-Detail',
    component: () => import('@/views/transfer/detail.vue'),
    meta: { title: '礼品调拨详情' }
  }
]