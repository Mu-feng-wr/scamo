import request from '@/utils/request.js'

// 查询盘点任务信息列表
export function listTask(query) {
  return request({
    url: '/inventory/task/list',
    method: 'get',
    params: query
  })
}

// 查询盘点任务信息详细
export function getTask(inventoryTaskId) {
  return request({
    url: '/inventory/task/' + inventoryTaskId,
    method: 'get'
  })
}

// 新增盘点任务信息
export function addTask(data) {
  return request({
    url: '/inventory/task',
    method: 'post',
    data: data
  })
}

// 修改盘点任务信息
export function updateTask(data) {
  return request({
    url: '/inventory/task',
    method: 'put',
    data: data
  })
}

// 删除盘点任务信息
export function delTask(inventoryTaskId) {
  return request({
    url: '/inventory/task/' + inventoryTaskId,
    method: 'delete'
  })
}
