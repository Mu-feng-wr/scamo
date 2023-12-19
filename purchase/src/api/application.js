import request from '@/utils/request.js'

// 查询申购单信息列表
export function listApplication (query) {
  return request({
    url: '/srm/application/list',
    method: 'get',
    params: query
  })
}

// 删除申购单信息
export function delApplication (purchaseApplicationId) {
  return request({
    url: '/srm/application/' + purchaseApplicationId,
    method: 'delete'
  })
}

// 获取列表头部统计值
export function getTotalAmount (query) {
  return request({
    url: '/srm/application/getTotalAmount',
    method: 'get',
    params: query
  })
}