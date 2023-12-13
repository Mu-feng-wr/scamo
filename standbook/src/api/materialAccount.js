import request from '@/utils/request'

// 查询物资台账信息列表
export function listAccount(query) {
  return request({
    url: '/library/materialAccount/list',
    method: 'get',
    params: query
  })
}
// 查询物资台账信息列表
export function listAccountMy(query) {
  return request({
    url: '/library/materialAccount/myList',
    method: 'get',
    params: query
  })
}

// 查询物资台账信息详细
export function getAccount(materialAccountId) {
  return request({
    url: '/library/materialAccount/' + materialAccountId,
    method: 'get'
  })
}