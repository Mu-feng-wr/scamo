import request from '@/utils/request'

/** 获取登录验证码 */
export function getVerificationCode(params) {
  return request({
    url: '/code',
    method: 'get',
    params
  })
}
