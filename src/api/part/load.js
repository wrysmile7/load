import baseURL from '../base' // 导入接口地址
import service from '../http' // 导入http中创建的axios实例

//  get数据 params接收
//  post数据 data接收
const energy = {
  // 获取载荷
  getLoad (params) {
    return service({
      url: `${baseURL}/load/display`,
      method: 'get',
      params
    })
  },
  // 下载载荷配置文件
  downloadConf (params) {
    return service({
      url: `${baseURL}/load/conf`,
      method: 'get',
      params
    })
  },
  // 下载载荷执行结果文件
  downloadResult (params) {
    return service({
      url: `${baseURL}/load/result`,
      method: 'get',
      params
    })
  },
  // 新增/修改/删除分类
  classifyHandle (params) {
    return service({
      url: `${baseURL}/load/create/class`,
      method: 'get',
      params
    })
  },
  // 修改IP地址
  updateIPAddress (data) {
    return service({
      url: `${baseURL}/load/setting/ip`,
      method: 'post',
      data
    })
  },
  // 获取结果列表
  getResult (params) {
    return service({
      url: `${baseURL}/load/host`,
      method: 'get',
      params
    })
  },
  // 列表删除
  delList (data) {
    return service({
      url: `${baseURL}/load/delete`,
      method: 'post',
      data
    })
  },
  // 删除工具
  delLoad (data) {
    return service({
      url: `${baseURL}/load/delLoad`,
      method: 'post',
      data
    })
  },
  // 获取服务器子网掩码、IP地址
  getNetwork (params) {
    return service({
      url: `${baseURL}/load/network/ip`,
      method: 'get',
      params
    })
  },
  // 获取设备列表
  getDeviceList (params) {
    return service({
      url: `${baseURL}/device/display`,
      method: 'get',
      params
    })
  },
  // 新增设备
  addDevices (data) {
    return service({
      url: `${baseURL}/device/display`,
      method: 'post',
      data
    })
  },
  // 删除设备
  delDevices (params) {
    return service({
      url: `${baseURL}/device/edit`,
      method: 'get',
      params
    })
  },
  // 编辑设备
  editDevices (data) {
    return service({
      url: `${baseURL}/device/edit`,
      method: 'post',
      data
    })
  },
  // 获取设备下拉列表
  getDevices (params) {
    return service({
      url: `${baseURL}/device/list`,
      method: 'get',
      params
    })
  }
}

export default energy
