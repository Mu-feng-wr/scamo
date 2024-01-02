import request from '@/utils/request.js'

// 查询银行账户信息列表
export function listAccount(query) {
  return request({
    url: '/datac/account/list',
    method: 'get',
    params: query
  })
}
export function listAccountQuery(query) {
  return request({
    url: '/datac/account/queryList',
    method: 'get',
    params: query
  })
}

// 查询银行账户信息详细
export function getAccount(accountId) {
  return request({
    url: '/datac/account/' + accountId,
    method: 'get'
  })
}

// 新增银行账户信息
export function addAccount(data) {
  return request({
    url: '/datac/account',
    method: 'post',
    data: data
  })
}

// 修改银行账户信息
export function updateAccount(data) {
  return request({
    url: '/datac/account',
    method: 'put',
    data: data
  })
}

// 删除银行账户信息
export function delAccount(accountId) {
  return request({
    url: '/datac/account/' + accountId,
    method: 'delete'
  })
}
