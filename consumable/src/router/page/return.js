export default [
  {
    path: '/consumable/return',
    name: 'Consumable-Return',
    component: () => import('@/views/return/index.vue'),
    meta: { title: '耗材归还' }
  },
  {
    path: '/consumable/return/add',
    name: 'Consumable-Return-ADd',
    component: () => import('@/views/return/edit.vue'),
    meta: { title: '新增耗材归还' }
  },
  {
    path: '/consumable/return/edit',
    name: 'Consumable-Return-Edit',
    component: () => import('@/views/return/edit.vue'),
    meta: { title: '编辑耗材归还' }
  },
  {
    path: '/consumable/return/detail',
    name: 'Consumable-Return-Detail',
    component: () => import('@/views/return/detail.vue'),
    meta: { title: '耗材归还详情' }
  }
]