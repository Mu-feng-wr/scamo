import request from '@/utils/request.js'

// 查询项目信息列表
export function listProject(query) {
  return request({
    url: '/datac/project/list',
    method: 'get',
    params: query
  })
}

// 查询项目信息列表
export function listProjectQuery(query) {
  return request({
    url: '/datac/project/queryList',
    method: 'get',
    params: query
  })
}

// 查询项目信息详细
export function getProject(projectId) {
  return request({
    url: '/datac/project/' + projectId,
    method: 'get'
  })
}

// 新增项目信息
export function addProject(data) {
  return request({
    url: '/datac/project',
    method: 'post',
    data: data
  })
}

// 修改项目信息
export function updateProject(data) {
  return request({
    url: '/datac/project',
    method: 'put',
    data: data
  })
}

// 删除项目信息
export function delProject(projectId) {
  return request({
    url: '/datac/project/' + projectId,
    method: 'delete'
  })
}
