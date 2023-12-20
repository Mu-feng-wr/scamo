import request from '@/utils/request'
var requestFunc = request
if (window.$wujie) {
  requestFunc = window.$wujie.props.request
}


/** 获取待办列表 */
export const getReviewListIsCompleted = (query) => {
  return requestFunc({
    url: '/review/review/getReviewListIsCompleted',
    method: 'get',
    params: query
  })
}
