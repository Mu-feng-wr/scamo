import request from '@/utils/request'

/** 获取登录验证码 */
export function getVerificationCode(params) {
  return request({
    url: '/code',
    method: 'get',
    params
  })
}

/** 登录系统 */
export function login(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  })
}

/** 获取菜单 */
export function getRouters(params) {
  return request({
    url: '/system/menu/getRouters',
    method: 'get',
    params
  })
}
