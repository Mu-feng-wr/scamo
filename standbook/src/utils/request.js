import axios from 'axios'
import { MessageBox, Message, Loading } from 'element-ui'
// import store from '@/store'
import { getToken } from '@/utils/auth'
import { tansParams, blobValidate } from '@/utils/index.js'
import { saveAs } from 'file-saver'

const errorCode = {
  '401': '认证失败，无法访问系统资源',
  '403': '当前操作没有权限',
  '404': '访问资源不存在',
  'default': '系统未知错误，请反馈给管理员'
}
var baseURL = process.env.VUE_APP_BASE_API
if (process.env.NODE_ENV == 'development' && window.$wujie) {
  baseURL = window.$wujie.props.origin
}
const service = axios.create({
  baseURL: baseURL
})

service.interceptors.request.use(
  config => {
    if (getToken()) {
      config.headers['Authorization'] = 'Bearer ' + getToken()
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(

  response => {
    const res = response.data

    if (res.code !== 200) {
      if (res.code == 500 || res.code == 500000) {
        Message({
          message: res.msg || res.message || 'Error',
          type: 'error',
          duration: 1500
        })
      }
      if (res.code == 401) {
        MessageBox.confirm('', res.msg, { showCancelButton: false }).then(() => {
          if (window.$wujie) {
            window.$wujie.props.logout()
          }
        })
      }
    }
    if (res.total) {
      res.total = Number(res.total)
    }
    return res
  },
  error => {
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service

var downloadLoadingInstance
// 通用下载方法
export function download(url, params, filename, config) {
  downloadLoadingInstance = Loading.service({ text: '正在下载数据，请稍候', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)' })
  return service.post(url, params, {
    transformRequest: [(params) => { return tansParams(params) }],
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    responseType: 'blob',
    ...config
  }).then(async(data) => {
    const isLogin = await blobValidate(data)
    if (isLogin) {
      const blob = new Blob([data])
      saveAs(blob, filename)
    } else {
      const resText = await data.text()
      const rspObj = JSON.parse(resText)
      const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode['default']
      Message.error(errMsg)
    }
    downloadLoadingInstance.close()
  }).catch((r) => {
    console.error(r)
    Message.error('下载文件出现错误，请联系管理员！')
    downloadLoadingInstance.close()
  })
}