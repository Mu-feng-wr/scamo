import request from '@/utils/request'

// 查询邮箱域名信息列表
export function listDomain(query) {
  return request({
    url: '/memberc/domain/list',
    method: 'get',
    params: query
  })
}

// 查询邮箱域名信息详细
export function getDomain(mailboxDomainId) {
  return request({
    url: '/memberc/domain/' + mailboxDomainId,
    method: 'get'
  })
}

// 新增邮箱域名信息
export function addDomain(data) {
  return request({
    url: '/memberc/domain',
    method: 'post',
    data: data
  })
}

// 修改邮箱域名信息
export function updateDomain(data) {
  return request({
    url: '/memberc/domain',
    method: 'put',
    data: data
  })
}

// 修改邮寄地址
export function addOrUpdate(data) {
  return request({
    url: '/memberc/domain/addOrUpdate',
    method: 'post',
    data: data
  })
}

// 删除邮箱域名信息
export function delDomain(mailboxDomainId) {
  return request({
    url: '/memberc/domain/' + mailboxDomainId,
    method: 'delete'
  })
}
