import request from '@/utils/request.js'

// 查询耗材借用单信息列表
export function listBorrow(query) {
  return request({
    url: '/consume/borrow/list',
    method: 'get',
    params: query
  })
}

// 查询耗材借用单信息详细
export function getBorrow(consumableBorrowId) {
  return request({
    url: '/consume/borrow/' + consumableBorrowId,
    method: 'get'
  })
}

// 新增耗材借用单信息
export function addBorrow(data) {
  return request({
    url: '/consume/borrow',
    method: 'post',
    data: data
  })
}

// 修改耗材借用单信息
export function updateBorrow(data) {
  return request({
    url: '/consume/borrow',
    method: 'put',
    data: data
  })
}

// 删除耗材借用单信息
export function delBorrow(consumableBorrowId) {
  return request({
    url: '/consume/borrow/' + consumableBorrowId,
    method: 'delete'
  })
}

// 获取入库单合计
export function getTotalAmount (query) {
  return request({
    url: '/consume/borrow/getTotalAmount',
    method: 'get',
    params: query
  })
}

// 借用单信息流程操作
export function approveBorrow (data) {
  return request({
    url: '/consume/borrow/approve',
    method: 'post',
    data: data
  })
}
