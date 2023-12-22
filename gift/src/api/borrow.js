import request from '@/utils/request.js'

// 查询礼品借用单信息列表
export function listBorrow(query) {
  return request({
    url: '/gift/borrow/list',
    method: 'get',
    params: query
  })
}

// 查询礼品借用单信息详细
export function getBorrow(giftBorrowId) {
  return request({
    url: '/gift/borrow/' + giftBorrowId,
    method: 'get'
  })
}

// 新增礼品借用单信息
export function addBorrow(data) {
  return request({
    url: '/gift/borrow',
    method: 'post',
    data: data
  })
}

// 修改礼品借用单信息
export function updateBorrow(data) {
  return request({
    url: '/gift/borrow',
    method: 'put',
    data: data
  })
}

// 删除礼品借用单信息
export function delBorrow(giftBorrowId) {
  return request({
    url: '/gift/borrow/' + giftBorrowId,
    method: 'delete'
  })
}
