export default [
  {
    path: '/gift/reshuffle',
    name: 'Gift-Reshuffle',
    component: () => import('@/views/reshuffle/index.vue'),
    meta: { title: '礼品异动' }
  },
  {
    path: '/gift/reshuffle/add',
    name: 'Gift-Reshuffle-Add',
    component: () => import('@/views/reshuffle/edit.vue'),
    meta: { title: '新增礼品异动' }
  },
  {
    path: '/gift/reshuffle/edit',
    name: 'Gift-Reshuffle-Edit',
    component: () => import('@/views/reshuffle/edit.vue'),
    meta: { title: '编辑礼品异动' }
  },
  {
    path: '/gift/reshuffle',
    name: 'Gift-Reshuffle',
    component: () => import('@/views/reshuffle/detail.vue'),
    meta: { title: '礼品异动详情' }
  }
]