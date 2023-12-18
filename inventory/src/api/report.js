import request from '@/utils/request.js'

// 查询盘点报告信息列表
export function listReport(query) {
  return request({
    url: '/inventory/report/list',
    method: 'get',
    params: query
  })
}

// 查询盘点报告信息详细
export function getReport(inventoryReportId) {
  return request({
    url: '/inventory/report/' + inventoryReportId,
    method: 'get'
  })
}

// 新增盘点报告信息
export function addReport(data) {
  return request({
    url: '/inventory/report',
    method: 'post',
    data: data
  })
}

// 修改盘点报告信息
export function updateReport(data) {
  return request({
    url: '/inventory/report',
    method: 'put',
    data: data
  })
}

// 删除盘点报告信息
export function delReport(inventoryReportId) {
  return request({
    url: '/inventory/report/' + inventoryReportId,
    method: 'delete'
  })
}