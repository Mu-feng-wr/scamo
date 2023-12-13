import request from '@/utils/request.js'

// 查询资产调拨单信息列表
export function listTransfer (query) {
  return request({
    url: '/asset/transfer/list',
    method: 'get',
    params: query
  })
}

// 查询资产调拨单信息列表合计
export function getTotalAmount (query) {
  return request({
    url: '/asset/transfer/getTotalAmount',
    method: 'get',
    params: query
  })
}

// 删除资产调拨单信息
export function delTransfer (assetTransferId) {
  return request({
    url: '/asset/transfer/' + assetTransferId,
    method: 'delete'
  })
}
