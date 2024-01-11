import request from '@/utils/request'

// 查询订购版本信息列表
export function listVersion(query) {
  return request({
    url: '/memberc/version/list',
    method: 'get',
    params: query
  })
}

// 查询订购版本信息详细
export function getVersion(orderVersionId) {
  return request({
    url: '/memberc/version/' + orderVersionId,
    method: 'get'
  })
}

// 新增订购版本信息
export function addVersion(data) {
  return request({
    url: '/memberc/version',
    method: 'post',
    data: data
  })
}

// 修改订购版本信息
export function updateVersion(data) {
  return request({
    url: '/memberc/version',
    method: 'put',
    data: data
  })
}

// 删除订购版本信息
export function delVersion(orderVersionId) {
  return request({
    url: '/memberc/version/' + orderVersionId,
    method: 'delete'
  })
}
