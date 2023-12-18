export default [
  {
    path: '/inventory/plan',
    name: 'Inventory-Plan',
    component: () => import('@/views/plan/index.vue'),
    meta: { title: '计划' }
  },
  {
    path: '/inventory/plan/add',
    name: 'Inventory-Plan-Add',
    component: () => import('@/views/plan/edit.vue'),
    meta: { title: '新增计划' }
  },
  {
    path: '/inventory/plan/edit',
    name: 'Inventory-Plan-Edit',
    component: () => import('@/views/plan/edit.vue'),
    meta: { title: '编辑计划' }
  }
]