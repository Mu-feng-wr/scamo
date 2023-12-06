import request from '@/utils/request'
var requestFunc = request
if (window.$wujie) {
  requestFunc = window.$wujie.props.request
}

// 查询物资台账信息列表
export function listAccount(query) {
  return requestFunc({
    url: '/library/materialAccount/list',
    method: 'get',
    params: query
  })
}