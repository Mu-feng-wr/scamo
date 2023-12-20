export default [
  {
    path: '/gift/borrow',
    name: 'Gift-Borrow',
    component: () => import('@/views/borrow/index.vue'),
    meta: { title: '礼品借用' }
  },
  {
    path: '/gift/borrow/add',
    name: 'Gift-Borrow-Add',
    component: () => import('@/views/borrow/edit.vue'),
    meta: { title: '新增礼品借用' }
  },
  {
    path: '/gift/borrow/edit',
    name: 'Gift-Borrow-Edit',
    component: () => import('@/views/borrow/edit.vue'),
    meta: { title: '编辑礼品借用' }
  },
  {
    path: '/gift/borrow/detail',
    name: 'Gift-Borrow-Detail',
    component: () => import('@/views/borrow/detail.vue'),
    meta: { title: '礼品借用详情' }
  }
]