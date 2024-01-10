import request from '@/utils/request.js'

// 根据条件获取订单列表
export function findListByCondition(query) {
  return request({
    url: '/memberc/api/order/list',
    method: 'get',
    params: query
  })
}