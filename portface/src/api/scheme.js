import request from '@/utils/request'

// 查询方案信息列表
export function listScheme(query) {
  return request({
    url: '/datac/scheme/list',
    method: 'get',
    params: query
  })
}

// 查询方案信息列表
export function listSchemeQuery(query) {
  return request({
    url: '/datac/scheme/queryList',
    method: 'get',
    params: query
  })
}

// 查询方案信息详细
export function getScheme(schemeId) {
  return request({
    url: '/datac/scheme/' + schemeId,
    method: 'get'
  })
}

// 新增方案信息
export function addScheme(data) {
  return request({
    url: '/datac/scheme',
    method: 'post',
    data: data
  })
}

// 修改方案信息
export function updateScheme(data) {
  return request({
    url: '/datac/scheme',
    method: 'put',
    data: data
  })
}

// 删除方案信息
export function delScheme(schemeId) {
  return request({
    url: '/datac/scheme/' + schemeId,
    method: 'delete'
  })
}
