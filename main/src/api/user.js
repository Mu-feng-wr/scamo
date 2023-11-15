import request from '@/utils/request'
// 获取用户信息
export function getUserInfo(param) {
  return request({
    url: '/system/user/getInfo',
      method: 'get',
  })
}