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

// 获取秘钥
export function getSecretKey(param) {
  return request({
    url: '/system/api/security/authorization/center/application/secret',
      method: 'get',
  })
}

// 发送短信
export function sendSMS(param) {
  let headers = param.headerParam;
  delete param.headerParam;
  return request({
    url: '/system/api/common/sms/send',
    method: 'post',
    data: param,
    headers: headers
  })
}

// 注册方法
export function register(data) {
  return request({
    url: '/auth/register',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

