export default [
  {
    path: '/inventory/loss',
    name: 'Inventory-Loss',
    component: () => import('@/views/loss/index.vue'),
    meta: { title: '盘亏' }
  }
]