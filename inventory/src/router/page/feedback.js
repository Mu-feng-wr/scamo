export default [
  {
    path: '/inventory/feedback',
    name: 'Inventory-Feedback',
    component: () => import('@/views/feedback/index.vue'),
    meta: { title: '反馈' }
  }
]