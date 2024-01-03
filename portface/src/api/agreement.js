import request from '@/utils/request.js'

// 查询招标协议信息列表
export function listAgreement(query) {
  return request({
    url: '/datac/agreement/list',
    method: 'get',
    params: query
  })
}
// 查询招标协议信息列表（下拉）
export function listAgreementQuery(query) {
  return request({
    url: '/datac/agreement/queryList',
    method: 'get',
    params: query
  })
}

// 查询招标协议信息详细
export function getAgreement(tenderAgreementId) {
  return request({
    url: '/datac/agreement/' + tenderAgreementId,
    method: 'get'
  })
}

// 新增招标协议信息
export function addAgreement(data) {
  return request({
    url: '/datac/agreement',
    method: 'post',
    data: data
  })
}

// 修改招标协议信息
export function updateAgreement(data) {
  return request({
    url: '/datac/agreement',
    method: 'put',
    data: data
  })
}

// 删除招标协议信息
export function delAgreement(tenderAgreementId) {
  return request({
    url: '/datac/agreement/' + tenderAgreementId,
    method: 'delete'
  })
}
