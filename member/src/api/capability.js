import request from '@/utils/request'

// 查询服务能力信息列表
export function listCapability(query) {
  return request({
    url: '/memberc/capability/list',
    method: 'get',
    params: query
  })
}

// 查询服务能力关联销售版本信息列表
export function selectServiceCapabilitySaleList(query) {
  return request({
    url: '/memberc/capability/selectServiceCapabilitySaleList',
    method: 'get',
    params: query
  })
}

// 查询服务能力信息详细
export function getCapability(serviceCapabilityId) {
  return request({
    url: '/memberc/capability/' + serviceCapabilityId,
    method: 'get'
  })
}

// 新增服务能力信息
export function addCapability(data) {
  return request({
    url: '/memberc/capability',
    method: 'post',
    data: data
  })
}

// 修改服务能力信息
export function updateCapability(data) {
  return request({
    url: '/memberc/capability',
    method: 'put',
    data: data
  })
}

// 删除服务能力信息
export function delCapability(serviceCapabilityId) {
  return request({
    url: '/memberc/capability/' + serviceCapabilityId,
    method: 'delete'
  })
}
