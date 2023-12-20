export default [
  {
    path: '/consumable/reshuffle',
    name: 'Consumable-Reshuffle',
    component: () => import('@/views/reshuffle/index.vue'),
    meta: { title: '耗材异动' }
  },
  {
    path: '/consumable/reshuffle/add',
    name: 'Consumable-Reshuffle-Add',
    component: () => import('@/views/reshuffle/edit.vue'),
    meta: { title: '新增耗材异动' }
  },
  {
    path: '/consumable/reshuffle/edit',
    name: 'Consumable-Reshuffle-Edit',
    component: () => import('@/views/reshuffle/edit.vue'),
    meta: { title: '编辑耗材异动' }
  },
  {
    path: '/consumable/reshuffle/detail',
    name: 'Consumable-Reshuffle-Detail',
    component: () => import('@/views/reshuffle/detail.vue'),
    meta: { title: '耗材异动查看' }
  }
]