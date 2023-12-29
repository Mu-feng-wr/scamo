import request from '@/utils/request.js'

// 查询业务类型信息列表
export function listType(query) {
  return request({
    url: '/library/type/list',
    method: 'get',
    params: query
  })
}

// 查询业务类型信息列表
export function listTypeQuery(query) {
  return request({
    url: '/library/type/queryList',
    method: 'get',
    params: query
  })
}

// 查询业务类型信息详细
export function getType(businessId) {
  return request({
    url: '/library/type/' + businessId,
    method: 'get'
  })
}

// 新增业务类型信息
export function addType(data) {
  return request({
    url: '/library/type',
    method: 'post',
    data: data
  })
}

// 修改业务类型信息
export function updateType(data) {
  return request({
    url: '/library/type',
    method: 'put',
    data: data
  })
}

// 删除业务类型信息
export function delType(businessId) {
  return request({
    url: '/library/type/' + businessId,
    method: 'delete'
  })
}
