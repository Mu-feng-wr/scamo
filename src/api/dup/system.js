import request from '@/utils/request'

/** 登录 */
export function login(data) {
  return request({
    url: '/dup-cloud//sys/login',
    method: 'post',
    data
  })
}

/** 获取菜单 权限 */
export function getMenu(params) {
  return request({
    url: '/dup-cloud//sys/menu/nav',
    method: 'get',
    params
  })
}
