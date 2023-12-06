import request from '@/utils/request.js'
var requestFunc = request
if (window.$wujie) {
  requestFunc = window.$wujie.props.request
}

// 查询部门下拉树结构
export function addressTreeSelect () {
  return requestFunc({
    url: '/library/address/addressTree',
    method: 'get'
  })
}