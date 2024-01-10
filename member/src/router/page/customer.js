export default [
  {
    path: '/member/customer',
    name: 'Member-Customer',
    component: () => import('@/views/customer/index.vue'),
    meta: { title: '客户' }
  },
  {
    path: '/member/customer/add',
    name: 'Member-Customer-Add',
    component: () => import('@/views/customer/edit.vue'),
    meta: { title: '新增客户' }
  },
  {
    path: '/member/customer/edit',
    name: 'Member-Customer-Edit',
    component: () => import('@/views/customer/edit.vue'),
    meta: { title: '编辑客户' }
  },
  {
    path: '/member/customer/detail',
    name: 'Member-Customer-Detail',
    component: () => import('@/views/customer/detail.vue'),
    meta: { title: '客户详情' }
  }
]