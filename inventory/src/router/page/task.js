export default [
  {
    path: '/inventory/task',
    name: 'Inventory-Task',
    component: () => import('@/views/task/index.vue'),
    meta: { title: '任务' }
  }
]