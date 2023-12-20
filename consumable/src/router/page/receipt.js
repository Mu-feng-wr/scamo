export default [
  {
    path: '/consumable/receipt',
    name: 'Consumable-Receipt',
    component: () => import('@/views/receipt/index.vue'),
    meta: { title: '耗材入库' }
  },
  {
    path: '/consumable/receipt/add',
    name: 'Consumable-Receipt-Add',
    component: () => import('@/views/receipt/edit.vue'),
    meta: { title: '新增耗材入库' }
  },
  {
    path: '/consumable/receipt/edit',
    name: 'Consumable-Receipt-Edit',
    component: () => import('@/views/receipt/edit.vue'),
    meta: { title: '编辑耗材入库' }
  },
  {
    path: '/consumable/receipt/detail',
    name: 'Consumable-Receipt-Detail',
    component: () => import('@/views/receipt/detail.vue'),
    meta: { title: '耗材入库详情' }
  }
]