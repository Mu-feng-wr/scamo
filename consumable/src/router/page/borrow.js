export default [
  {
    path: '/consumable/borrow',
    name: 'Consumable-Borrow',
    component: () => import('@/views/borrow/index.vue'),
    meta: { title: '耗材借用' }
  },
  {
    path: '/consumable/borrow/add',
    name: 'Consumable-Borrow-Add',
    component: () => import('@/views/borrow/edit.vue'),
    meta: { title: '新增耗材借用' }
  },
  {
    path: '/consumable/borrow/edit',
    name: 'Consumable-Borrow-Edit',
    component: () => import('@/views/borrow/edit.vue'),
    meta: { title: '编辑耗材借用' }
  },
  {
    path: '/consumable/borrow/detail',
    name: 'Consumable-Borrow-Detail',
    component: () => import('@/views/borrow/detail.vue'),
    meta: { title: '耗材借用详情' }
  }
]