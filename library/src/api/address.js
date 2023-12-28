import request from '@/utils/request.js'

// 查询库位地址信息列表
export function listAddress (query) {
  return request({
    url: '/library/address/list',
    method: 'get',
    params: query
  })
}

// 查询库位地址信息列表
export function listAddressParent (query) {
  return request({
    url: '/library/address/queryParentList',
    method: 'get',
    params: query
  })
}


// 查询库位地址信息详细
export function getAddress (locationAddressId) {
  return request({
    url: '/library/address/' + locationAddressId,
    method: 'get'
  })
}

// 新增库位地址信息
export function addAddress (data) {
  return request({
    url: '/library/address',
    method: 'post',
    data: data
  })
}

// 修改库位地址信息
export function updateAddress (data) {
  return request({
    url: '/library/address',
    method: 'put',
    data: data
  })
}

// 删除库位地址信息
export function delAddress (locationAddressId) {
  return request({
    url: '/library/address/' + locationAddressId,
    method: 'delete'
  })
}