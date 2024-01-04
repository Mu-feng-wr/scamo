export default [
  {
    path: '/system/menu',
    name: 'System-Menu',
    component: () => import('@/views/menu/index.vue'),
    meta: { title: '菜单' }
  }
]