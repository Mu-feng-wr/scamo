import request from '@/utils/request.js'

// 查询企业信息列表
export function listEnterprise(query) {
  return request({
    url: '/memberc/enterprise/list',
    method: 'get',
    params: query
  })
}

// 查询企业信息详细
export function getEnterprise(enterpriseId) {
  return request({
    url: '/memberc/enterprise/' + enterpriseId,
    method: 'get'
  })
}

// 通过客户ID查询企业信息详细
export function getEnterpriseByCustomerId(customerId) {
  return request({
    url: '/memberc/enterprise/getEnterpriseByCustomerId/' + customerId,
    method: 'get'
  })
}

// 通过客户唯一编码查询企业信息
export function findByUnifiedSystemNumber() {
  return request({
    url: '/memberc/api/enterprise/self',
    method: 'get'
  })
}

// 新增企业信息
export function addEnterprise(data) {
  return request({
    url: '/memberc/enterprise',
    method: 'post',
    data: data
  })
}

// 修改企业信息
export function updateEnterprise(data) {
  return request({
    url: '/memberc/enterprise',
    method: 'put',
    data: data
  })
}

// 删除企业信息
export function delEnterprise(enterpriseId) {
  return request({
    url: '/memberc/enterprise/' + enterpriseId,
    method: 'delete'
  })
}
