import request from '@/utils/request'

/** 获取登录验证码 */
export function getCode(params) {
  return request({
    url: '/code',
    method: 'get',
    params
  })
}
