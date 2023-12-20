import request from '@/utils/request'

// 查询耗材入库单信息列表
export function listReceipt(query) {
  return request({
    url: '/consume/receipt/list',
    method: 'get',
    params: query
  })
}

// 查询耗材入库单信息详细
export function getReceipt(consumableReceiptId) {
  return request({
    url: '/consume/receipt/' + consumableReceiptId,
    method: 'get'
  })
}

// 新增耗材入库单信息
export function addReceipt(data) {
  return request({
    url: '/consume/receipt',
    method: 'post',
    data: data
  })
}

// 修改耗材入库单信息
export function updateReceipt(data) {
  return request({
    url: '/consume/receipt',
    method: 'put',
    data: data
  })
}

// 删除耗材入库单信息
export function delReceipt(consumableReceiptId) {
  return request({
    url: '/consume/receipt/' + consumableReceiptId,
    method: 'delete'
  })
}
// 获取入库单合计
export function getTotalAmount (query) {
  return request({
    url: '/consume/receipt/getTotalAmount',
    method: 'get',
    params: query
  })
}