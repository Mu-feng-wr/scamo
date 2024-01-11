import request from '@/utils/request.js'
// 新增通知公告信息
export function addNotice(data) {
  return request({
    url: '/memberc/notice',
    method: 'post',
    data: data
  })
}

// 修改通知公告信息
export function updateNotice(data) {
  return request({
    url: '/memberc/notice',
    method: 'put',
    data: data
  })
}