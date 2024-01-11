import request from '@/utils/request'

// 查询安全IP设置信息列表
export function listIp(query) {
  return request({
    url: '/memberc/ip/list',
    method: 'get',
    params: query
  })
}

// 查询安全IP设置信息详细
export function getIp(securityIpId) {
  return request({
    url: '/memberc/ip/' + securityIpId,
    method: 'get'
  })
}

// 新增安全IP设置信息
export function addIp(data) {
  return request({
    url: '/memberc/ip',
    method: 'post',
    data: data
  })
}

// 修改安全IP设置信息
export function updateIp(data) {
  return request({
    url: '/memberc/ip',
    method: 'put',
    data: data
  })
}

// 修改安全IP
export function addOrUpdate(data) {
  return request({
    url: '/memberc/ip/addOrUpdate',
    method: 'post',
    data: data
  })
}

// 删除安全IP设置信息
export function delIp(securityIpId) {
  return request({
    url: '/memberc/ip/' + securityIpId,
    method: 'delete'
  })
}
