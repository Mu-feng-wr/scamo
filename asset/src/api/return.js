import request from '@/utils/request.js'

// 查询资产归还单信息列表
export function listReturn (query) {
  return request({
    url: '/asset/return/list',
    method: 'get',
    params: query
  })
}

// 删除资产归还单信息
export function delReturn (assetReturnId) {
  return request({
    url: '/asset/return/' + assetReturnId,
    method: 'delete'
  })
}