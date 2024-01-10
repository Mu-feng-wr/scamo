import request from '@/utils/request'

/**
 * 应用管理列表查询
 *
 * @param query
 * @returns {*}
 */
export function manageList (query) {
  return request({
    url: '/memberc/api/app/manage/app/list',
    method: 'get',
    params: query
  })
}

/**
 * 根据id获取应用详情
 *
 * @param id 应用id
 * @returns {*}
 */
export function getById (id) {
  return request({
    url: '/memberc/api/app/manage/app/' + id,
    method: 'get'
  })
}

/**
 * 获取应用服务树
 *
 * @returns {*}
 */
export function getServiceTree() {
  return request({
    url: '/memberc/api/app/manage/service/tree',
    method: 'get'
  })
}

