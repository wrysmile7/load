
// 判断是否是生产环境
const isPro = Object.is(process.env.NODE_ENV, 'production')
const baseURL = isPro ? `http://192.168.8.61:8100` : `http://192.168.8.22:8100`
export default baseURL
