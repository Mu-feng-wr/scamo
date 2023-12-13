import request from '@/utils/request.js'

// 查询部门下拉树结构
export function addressTreeSelect () {
  return request({
    url: '/library/address/addressTree',
    method: 'get'
  })
}