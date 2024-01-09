import request from '@/utils/request'

// 查询用户列表
export function listUser(query) {
  return request({
    url: '/system/user/list',
    method: 'get',
    params: query
  })
}

// 查询用户详细
export function getUser(userId) {
  return request({
    url: '/system/user/' + parseStrEmpty(userId),
    method: 'get'
  })
}

// 删除用户
export function delUser(userId) {
  return request({
    url: '/system/user/' + userId,
    method: 'delete'
  })
}

// 根据公司ID查询部门下拉树结构
export function getDeptByCompanyId(companyId) {
  return request({
    url: '/system/user/getDeptByCompanyId/' + companyId,
    method: 'get'
  })
}

// 查询全部角色列表
export function getAllRole() {
  return request({
    url: '/system/api/role/all',
    method: 'get',
  })
}


// 根据所选角色获取相应的数据权限
export function getRolePermByRoleIds(roleIds) {
  return request({
    url: '/system/user/getRolePermByRoleIds/' + roleIds,
    method: 'get'
  })
}

// 查询用户详细
export function getExtendsUser(userId) {
  return request({
    url: '/system/user/extends/' + userId,
    method: 'get'
  })
}


// 查询用户详细
export function getUserRole(userId) {
  return request({
    url: '/system/api/role/user/' + userId,
    method: 'get'
  })
}
