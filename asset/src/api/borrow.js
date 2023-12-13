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