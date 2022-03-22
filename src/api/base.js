/*
  多个接口域名管理
*/
// import axios from 'axios'
// import { Message } from 'element-ui'
// const isPro = Object.is(process.env.NODE_ENV, 'production')
// const urlStr = isPro ? '../../../config/' : 'http://120.27.240.66:8080/config/'
// const baseURL = {
//   commonUrl: axios.get(`${urlStr}config.json`).then(res => {
//     return `http://${res.data[0].server_ip}:8088`
//     // return `http://192.168.1.251:8080`
//   }).catch(() => {
//     Message({
//       type: 'error',
//       message: '没有找到配置文件'
//     })
//   }),
//   loginUrl: ''
// }
// 判断是否是生产环境
const isPro = Object.is(process.env.NODE_ENV, 'production')
const baseURL = isPro ? getProServeUrl() : `http://192.168.8.22:8100`
function getProServeUrl () {
  const os = require('os')
  return `http://${os.hostname()}:8100`
}
// const baseURL = isPro ? `http://192.168.8.74:8100` : `http://192.168.8.22:8100`
export default baseURL
