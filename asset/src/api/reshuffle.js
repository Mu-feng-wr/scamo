import request from '@/utils/request.js'

// 查询资产异动单信息列表
export function listReshuffle(query) {
  return request({
    url: '/asset/reshuffle/list',
    method: 'get',
    params: query
  })
}

// 删除资产异动单信息
export function delReshuffle(assetReshuffleId) {
  return request({
    url: '/asset/reshuffle/' + assetReshuffleId,
    method: 'delete'
  })
}

// 查询资产调拨单信息列表合计
export function getTotalAmount(query) {
  return request({
    url: '/asset/reshuffle/getTotalAmount',
    method: 'get',
    params: query
  })
}