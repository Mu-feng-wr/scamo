export default [
  {
    path: '/inventory/plan',
    name: 'Inventory-Plan',
    component: () => import('@/views/plan/index.vue'),
    meta: { title: '计划' }
  }
]