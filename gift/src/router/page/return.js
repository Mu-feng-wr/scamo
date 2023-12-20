export default [
  {
    path: '/gift/return',
    name: 'Gift-Return',
    component: () => import('@/views/return/index.vue'),
    meta: { title: '礼品归还' }
  },
  {
    path: '/gift/return/add',
    name: 'Gift-Return-Add',
    component: () => import('@/views/return/edit.vue'),
    meta: { title: '新增礼品归还' }
  },
  {
    path: '/gift/return/edit',
    name: 'Gift-Return-Edit',
    component: () => import('@/views/return/edit.vue'),
    meta: { title: '编辑礼品归还' }
  },
  {
    path: '/gift/return/detail',
    name: 'Gift-Return-Detail',
    component: () => import('@/views/return/detail.vue'),
    meta: { title: '礼品归还详情' }
  }
]