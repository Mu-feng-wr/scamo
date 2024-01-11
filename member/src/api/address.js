import request from '@/utils/request.js'

// 查询邮寄地址列表
export function listAddress(query) {
  return request({
    url: '/memberc/address/list',
    method: 'get',
    params: query
  })
}

// 修改邮寄地址
export function addOrUpdate(data) {
  return request({
    url: '/memberc/address/addOrUpdate',
    method: 'post',
    data: data
  })
}

// 删除邮寄地址
export function delAddress(mailAddressId) {
  return request({
    url: '/memberc/address/' + mailAddressId,
    method: 'delete'
  })
}
