export default [
  {
    path: '/consumable/scrap',
    name: 'Consumable-Scrap',
    component: () => import('@/views/scrap/index.vue'),
    meta: { title: '耗材处置' }
  },
  {
    path: '/consumable/scrap/add',
    name: 'Consumable-Scrap-Add',
    component: () => import('@/views/scrap/edit.vue'),
    meta: { title: '新增耗材处置' }
  },
  {
    path: '/consumable/scrap/edit',
    name: 'Consumable-Scrap-Edit',
    component: () => import('@/views/scrap/edit.vue'),
    meta: { title: '编辑耗材处置' }
  },
  {
    path: '/consumable/scrap/detail',
    name: 'Consumable-Scrap-Detail',
    component: () => import('@/views/scrap/detail.vue'),
    meta: { title: '耗材处置详情' }
  }
]