import request from '@/utils/request.js'

// 查询角色列表
export function listRole (query) {
  return request({
    url: '/system/role/list',
    method: 'get',
    params: query
  })
}

// 新增角色
export function addRole (data) {
  return request({
    url: '/system/role',
    method: 'post',
    data: data
  })
}

// 修改角色
export function updateRole (data) {
  return request({
    url: '/system/api/role/'+data.roleId,
    method: 'put',
    data: data
  })
}

// 删除角色
export function delRole (roleId) {
  return request({
    url: '/system/role/' + roleId,
    method: 'delete'
  })
}