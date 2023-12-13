import request from '@/utils/request.js'

// 查询资产领用单信息列表
export function listCollect (query) {
  return request({
    url: '/asset/collect/list',
    method: 'get',
    params: query
  })
}

// 获取入库单合计
export function getTotalAmount (query) {
  return request({
    url: '/asset/collect/getTotalAmount',
    method: 'get',
    params: query
  })
}

// 删除资产领用单信息
export function delCollect (assetCollectId) {
  return request({
    url: '/asset/collect/' + assetCollectId,
    method: 'delete'
  })
}