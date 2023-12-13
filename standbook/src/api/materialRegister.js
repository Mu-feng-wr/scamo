import request from '@/utils/request'

// 查询物资台账登记信息列表
export function listRegister(query) {
  return request({
    url: '/library/materialRegister/list',
    method: 'get',
    params: query
  })
}