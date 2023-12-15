import request from '@/utils/request.js'

// 查询资产借用单信息列表
export function listBorrow (query) {
  return request({
    url: '/asset/borrow/list',
    method: 'get',
    params: query
  })
}

// 删除资产借用单信息
export function delBorrow (assetBorrowId) {
  return request({
    url: '/asset/borrow/' + assetBorrowId,
    method: 'delete'
  })
}

// 查询资产借用单信息详细
export function getBorrow (assetBorrowId) {
  return request({
    url: '/asset/borrow/' + assetBorrowId,
    method: 'get'
  })
}

// 新增资产借用单信息
export function addBorrow (data) {
  return request({
    url: '/asset/borrow',
    method: 'post',
    data: data
  })
}
// 修改资产借用单信息
export function updateBorrow (data) {
  return request({
    url: '/asset/borrow',
    method: 'put',
    data: data
  })
}

// 借用单信息流程操作
export function approveBorrow (data) {
  return request({
    url: '/asset/borrow/approve',
    method: 'post',
    data: data
  })
}