import request from '@/utils/request.js'

// 查询发货单信息列表
export function listShipment (query) {
  return request({
    url: '/srm/shipment/list',
    method: 'get',
    params: query
  })
}

// 查询发货单信息详细
export function getShipment (shipmentId) {
  return request({
    url: '/srm/shipment/' + shipmentId,
    method: 'get'
  })
}

// 新增发货单信息
export function addShipment (data) {
  return request({
    url: '/srm/shipment',
    method: 'post',
    data: data
  })
}

// 修改发货单信息
export function updateShipment (data) {
  return request({
    url: '/srm/shipment',
    method: 'put',
    data: data
  })
}

// 删除发货单信息
export function delShipment (shipmentId) {
  return request({
    url: '/srm/shipment/' + shipmentId,
    method: 'delete'
  })
}
// 获取发货单表尾合计
export function getTotalAmount (query) {
  return request({
    url: '/srm/shipment/getTotalAmount',
    method: 'get',
    params: query
  })
}
