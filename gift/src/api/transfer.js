import request from '@/utils/request.js'

// 查询礼品调拨单信息列表
export function listTransfer(query) {
  return request({
    url: '/gift/transfer/list',
    method: 'get',
    params: query
  })
}

// 查询礼品调拨单信息详细
export function getTransfer(giftTransferId) {
  return request({
    url: '/gift/transfer/' + giftTransferId,
    method: 'get'
  })
}

// 新增礼品调拨单信息
export function addTransfer(data) {
  return request({
    url: '/gift/transfer',
    method: 'post',
    data: data
  })
}

// 修改礼品调拨单信息
export function updateTransfer(data) {
  return request({
    url: '/gift/transfer',
    method: 'put',
    data: data
  })
}

// 删除礼品调拨单信息
export function delTransfer(giftTransferId) {
  return request({
    url: '/gift/transfer/' + giftTransferId,
    method: 'delete'
  })
}
