export default [
  {
    path: '/consumable/collect',
    name: 'Consumable-Collect',
    component: () => import('@/views/collect/index.vue'),
    meta: { title: '耗材借用' }
  },
  {
    path: '/consumable/collect/add',
    name: 'Consumable-Collect-Add',
    component: () => import('@/views/collect/edit.vue'),
    meta: { title: '新增耗材借用' }
  },
  {
    path: '/consumable/collect/edit',
    name: 'Consumable-Collect-Edit',
    component: () => import('@/views/collect/edit.vue'),
    meta: { title: '编辑耗材借用' }
  },
  {
    path: '/consumable/collect/detail',
    name: 'Consumable-Collect-Detail',
    component: () => import('@/views/collect/detail.vue'),
    meta: { title: '耗材借用详情' }
  }
]