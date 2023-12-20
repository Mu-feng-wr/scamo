export default [
  {
    path: '/consumable/distribute',
    name: 'Consumable-Distribute',
    component: () => import('@/views/distribute/index.vue'),
    meta: { title: '耗材派发' }
  },
  {
    path: '/consumable/distribute/add',
    name: 'Consumable-Distribute-Add',
    component: () => import('@/views/distribute/edit.vue'),
    meta: { title: '新增耗材派发' }
  },
  {
    path: '/consumable/distribute/edit',
    name: 'Consumable-Distribute-Edit',
    component: () => import('@/views/distribute/edit.vue'),
    meta: { title: '编辑耗材派发' }
  },
  {
    path: '/consumable/distribute/detail',
    name: 'Consumable-Distribute-Detail',
    component: () => import('@/views/distribute/detail.vue'),
    meta: { title: '耗材派发详情' }
  }
]