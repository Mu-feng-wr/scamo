import request from '@/utils/request'

// 根据条件获取订单列表
export function findListByCondition(query) {
  return request({
    url: '/memberc/api/order/list',
    method: 'get',
    params: query
  })
}

/**
 * 查询自己的试用订单
 * @returns 
 */
export function findSelfTrial(){
  return request({
    url: '/memberc/api/order/self/trial',
    method: 'get',
  })
}

/**
 * 申请试用
 * @returns 
 */
export function createExperienceOrder(versionSaleId){
  return request({
    url: '/memberc/api//order/application/trial/' + versionSaleId,
    method: 'post',
  })
}

// 查询客户信息详细
export function getCustomer(customerId) {
  return request({
    url: '/memberc/customer/' + customerId,
    method: 'get'
  })
}


// 查询客户信息详细
export function getAllInfo() {
  return request({
    url: '/memberc/customer/getAllInfo/',
    method: 'get'
  })
}

// 新增客户信息
export function addCustomer(data) {
  return request({
    url: '/memberc/customer',
    method: 'post',
    data: data
  })
}

// 修改客户信息
export function updateCustomer(data) {
  return request({
    url: '/memberc/customer',
    method: 'put',
    data: data
  })
}

// 删除客户信息
export function delCustomer(customerId) {
  return request({
    url: '/memberc/customer/' + customerId,
    method: 'delete'
  })
}
