export default [
  {
    path: '/asset/reshuffle',
    name: 'Asset-Reshuffle',
    component: () => import('@/views/reshuffle/index.vue'),
    meta: { title: '资产异动' }
  },
  {
    path: '/asset/reshuffle/edit',
    name: 'Asset-Reshuffle-Edit',
    component: () => import('@/views/reshuffle/edit.vue'),
    meta: { title: '编辑资产异动' }
  },
  {
    path: '/asset/reshuffle/add',
    name: 'Asset-Reshuffle-Add',
    component: () => import('@/views/reshuffle/edit.vue'),
    meta: { title: '新增资产异动' }
  },
  {
    path: '/asset/reshuffle/detail',
    name: 'Asset-Reshuffle-Detail',
    component: () => import('@/views/reshuffle/detail.vue'),
    meta: { title: '资产异动详情' }
  }
]