export default [
  {
    path: '/inventory/report',
    name: 'Inventory-Report',
    component: () => import('@/views/report/index.vue'),
    meta: { title: '报告' }
  }
]