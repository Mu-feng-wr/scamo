import request from '@/utils/request.js'

// 查询合同基本信息列表
export function listContract(query) {
  return request({
    url: '/datac/contract/list',
    method: 'get',
    params: query
  })
}
// 查询合同基本信息列表
export function listContractQuery(query) {
  return request({
    url: '/datac/contract/queryList',
    method: 'get',
    params: query
  })
}

// 查询合同基本信息详细
export function getContract(contractId) {
  return request({
    url: '/datac/contract/' + contractId,
    method: 'get'
  })
}

// 新增合同基本信息
export function addContract(data) {
  return request({
    url: '/datac/contract',
    method: 'post',
    data: data
  })
}

// 修改合同基本信息
export function updateContract(data) {
  return request({
    url: '/datac/contract',
    method: 'put',
    data: data
  })
}

// 删除合同基本信息
export function delContract(contractId) {
  return request({
    url: '/datac/contract/' + contractId,
    method: 'delete'
  })
}

// 作废合同
export function invalidContract(data) {
  return request({
    url: '/datac/contract/invalid',
    method: 'post',
    data: data
  })
}

// 删除合同
export function deleteContract(data) {
  return request({
    url: '/datac/contract/delete',
    method: 'post',
    data: data
  })
}
