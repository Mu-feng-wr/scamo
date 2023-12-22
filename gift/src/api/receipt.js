import request from '@/utils/request'

// 查询礼品入库单信息列表
export function listReceipt(query) {
  return request({
    url: '/gift/receipt/list',
    method: 'get',
    params: query
  })
}

// 查询礼品入库单信息详细
export function getReceipt(giftReceiptId) {
  return request({
    url: '/gift/receipt/' + giftReceiptId,
    method: 'get'
  })
}

// 新增礼品入库单信息
export function addReceipt(data) {
  return request({
    url: '/gift/receipt',
    method: 'post',
    data: data
  })
}

// 修改礼品入库单信息
export function updateReceipt(data) {
  return request({
    url: '/gift/receipt',
    method: 'put',
    data: data
  })
}

// 删除礼品入库单信息
export function delReceipt(giftReceiptId) {
  return request({
    url: '/gift/receipt/' + giftReceiptId,
    method: 'delete'
  })
}
