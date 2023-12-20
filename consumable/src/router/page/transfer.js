export default [
  {
    path: '/consumable/transfer',
    name: 'Consumable-Transfer',
    component: () => import('@/views/transfer/index.vue'),
    meta: { title: '耗材调拨' }
  },
  {
    path: '/consumable/transfer/add',
    name: 'Consumable-Transfer-Add',
    component: () => import('@/views/transfer/edit.vue'),
    meta: { title: '新增耗材调拨' }
  },
  {
    path: '/consumable/transfer/edit',
    name: 'Consumable-Transfer-Edit',
    component: () => import('@/views/transfer/edit.vue'),
    meta: { title: '编辑耗材调拨' }
  },
  {
    path: '/consumable/transfer/detail',
    name: 'Consumable-Transfer-Detail',
    component: () => import('@/views/transfer/detail.vue'),
    meta: { title: '耗材调拨详情' }
  }
]