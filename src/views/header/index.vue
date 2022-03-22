<!-- header -->
<template>
  <div class="wrap">
    <div class="container">
      <div class="nav item">
        <a
          v-for="item of menus"
          :key="item.key"
          :class="activeTab === item.key && 'active-items'"
          @click="changePage(item)"
          class="nav-items text-center"
        >{{ item.value }}</a>
      </div>
      <div class="titles">嵌入式ZZ平台</div>
      <ul class="dialog-list">
        <li v-for="item in dialogList" :key="item" @click="openDialog(item)">{{item}}</li>
      </ul>
    </div>
    <p>
      <span>{{activeName}}</span>
      <ul class="ip-list">
        <li>服务器IP：{{serviceInfo.ip}}</li>
        <li>子网掩码：{{serviceInfo.network}}</li>
      </ul>
    </p>
    <el-dialog :visible.sync="updateIPVisible" width="30%" :show-close="false" class="update-ip" :close-on-click-modal="false" :close-on-press-escape="false">
      <IPUpdate :updateIPVisible.sync="updateIPVisible" @reGetIP="getIP()"></IPUpdate>
    </el-dialog>
    <el-dialog :visible.sync="caughtVisible" width="202px" :show-close="false" class="caught" :close-on-press-escape="false" top="30vh">
      <div class="caught-box">
        <p>
          <span>数量</span>
          <el-input type="Number" v-model="caughtNum"></el-input>
          <span>个</span>
        </p>
        <i @mousedown="state = false" @mouseup="state = true" :class="state?'':'btnStyle'" @click="caughtStart()"></i>
      </div>
    </el-dialog>
    <!-- 抓取状态动画 -->
    <div class="caught-gif" v-if="caughtState" :class="finished?'finished':''">
      <p v-show="finished">
        <span>抓取完成</span>
        <button @click="back()">返回</button>
      </p>
    </div>
  </div>
</template>

<script>
import baseURL from '@/api/base'
import IPUpdate from '../home/components/IPUpdate'
import { load } from '@/api'
import {downloadByBlob} from '@/utils/download'

const {downloadResult, getNetwork} = load
export default {
  name: 'HeaderComponent',
  components: {
    IPUpdate
  },
  data () {
    return {
      finished: false,
      caughtState: false,
      updateIPVisible: false,
      caughtVisible: false,
      visible: false,
      menus: [
        { key: 'deviceManage', value: '设备管理', show: false },
        { key: 'loadManage', value: '工具管理', show: false },
        { key: 'resultList', value: '内网定位结果列表', show: false },
        { key: 'IPList', value: '主机端口扫描列表', show: false }
      ],
      dialogList: ['网段扫描','IP修改'],
      activeTab: this.$route.name,
      activeName: '',
      caughtNum: 1,
      state: true,
      ws: null,
      serviceInfo: {
        ip: '',
        network: ''
      }
    }
  },
  watch: {
    activeTab: {
      handler (newVal, oldVal) {
        this.$router.push(`/${newVal}`)
      },
      immediate: true
    },
    $route (newVal) {
      this.activeTab = newVal.name
    }
  },
  created(){
    localStorage.setItem('only', new Date().getTime())
    this.activeName = this.menus[this.menus.findIndex(item => item.key === this.activeTab)].value
    this.getIP()
  },
  mounted () {
    // this.ws = new WebSocket('ws://${baseURL.replace('http://','')}/scan_host/1')
    // this.ws.onopen = this.open
    // console.log(this.ws)
  },
  methods: {
    // 获取IP地址
    getIP(){
      getNetwork().then(res=>{
        res = res.data
        if (res.code === 0) {
          console.log(res)
          this.serviceInfo = res.DataList
        }
      })
    },
    changePage (item) {
      this.activeTab = item.key
      this.activeName = item.value
    },
    openDialog (item) {
      switch (item) {
        case 'IP修改':
          this.updateIPVisible = true
          break
        case '网段扫描':
          this.caughtVisible = true
          break

        default:
          break
      }
    },
    // 开始抓包
    caughtStart(){
      this.caughtState = true
      this.ws = new WebSocket(`ws://${baseURL.replace('http://','')}/get_pcap_file/1`)
      console.log(this.ws)
      this.executeState = true
      this.ws.onopen = this.onOpen
      this.ws.onerror = this.onError
      this.ws.onclose = this.onClose
      this.ws.onmessage = this.onMessage
    },
    onOpen(){
      console.log('成功连接')
      this.ws.send(this.caughtNum)
    },
    onError(err){
      console.log(err)
    },
    onClose(){
      console.log('连接断开')
    },
    onMessage(res){
      let re = JSON.parse(res.data)
      if (re.code === 2) {
        this.$message({
          message: re.msg,
          type: 'success'
        })
        this.finished = true
        window.open(baseURL+'/load/result?filename='+re.filename)
        // downloadResult({filename:re.filename}).then(res=>{
        //   console.log(res)
        //   let filename = res.headers['content-disposition'].split("'")
        //   res = res.data
        //   // downloadByBlob(res,filename[filename.length-1])
        //   console.log(baseURL+'/load/result?filename='+filename[filename.length-1])
        //   window.open(baseURL+'/load/result?filename='+filename[filename.length-1])
        // })
      }
    },
    // 返回
    back(){
      this.caughtState = false
      this.finished = false
    }
  }
}
</script>

<style lang="scss" scoped>
.wrap{
  display: flex;
  flex-direction: column;
  .container {
    width: 100%;
    height: 150px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: url('../../assets/images/header.png') no-repeat;
    background-size: 100% 100%;
    color: #fff;
    font-size: 16px;
    color: #3db9fd;
    .nav{
      width: calc(50% - 200px);
      display: flex;
      justify-content: flex-end;
      padding: 0 30px;
      box-sizing: border-box;
      a{
        height: 30px;
        line-height: 35px;
        margin: 0 30px;
        cursor: pointer;
        // &:hover{
        //   color: #00cdce;
        //   font-size: 18px;
        //   font-weight: bold;
        // }
      }
      .active-items {
          color: #00cdce;
          font-size: 18px;
          font-weight: bold;
        }
    }
    .titles{
      width: 400px;
      font-size: 24px;
      color: #fff;
      font-weight: bold;
    }
    .dialog-list{
      width: calc(50% - 200px);
      list-style: none;
      display: flex;
      margin: 0;
      padding: 0 30px;
      box-sizing: border-box;
      li{
        height: 30px;
        line-height: 35px;
        margin: 0 30px;
        cursor: pointer;
        // &:hover{
        //   color: #00cdce;
        //   font-size: 18px;
        //   font-weight: bold;
        // }
      }
    }
  }
  >p{
    height: 36px;
    background: url('../../assets/images/point.png') no-repeat;
    color: #fff;
    font-size: 24px;
    font-weight: bold;
    text-align: left;
    padding: 0 80px 0 40px;
    margin-left: 80px;
    display: flex;
    justify-content: space-between;
    .ip-list{
      list-style: none;
      font-size: 14px;
      padding: 0;
      margin: 0;
    }
  }
  .update-ip{
    background: rgba($color: rgb(0, 20, 41), $alpha: 0.6);
    /deep/ .el-dialog{
      height: 580px;
      background: #00101D url('../../assets/images/bar_l.png') no-repeat;
      background-size: 100% 100%;
    }
    /deep/ .el-dialog__header{
      display: none;
    }
    /deep/ .el-dialog__body{
      padding: 0;
      height: 100%;
    }
  }
  .caught{
    /deep/ .el-dialog{
      background: transparent;
    }
    /deep/ .el-dialog__header{
      display: none;
    }
    /deep/ .el-dialog__body{
      padding: 0;
      background: transparent;
    }
    .caught-box{
      height: 300px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      >p{
        width: 202px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        color: #fff;
        /deep/ .el-input{
          width: 80px;
          height: 35px;
        }
        /deep/ .el-input__inner{
          width: 100%;
          height: 100%;
          background: transparent;
          border-color: #3db9fd;
          border-radius: 0;
          color: #fff;
          text-align: center;
        }
      }
      >i{
        width: 202px;
        height: 202px;
        background: url('../../assets/images/button-catch-default.png') no-repeat;
        border-radius: 50%;
        cursor: pointer;
        // &:hover{
          // background: url('../../assets/images/button-catch-push.png') no-repeat;
        // }
      }
      .btnStyle{
        background: url('../../assets/images/button-catch-push.png') no-repeat;
      }
    }
  }
  .caught-gif{
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    background: url('../../assets/images/loading_demo.gif') no-repeat center;
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;
    >p{
      width: 80px;
      margin-top: 30px;
      display: flex;
      flex-direction: column;
      >span{
        font-size: 14px;
        color: #fff;
        margin-bottom: 10px;
      }
      >button{
        width: 80px;
        height: 30px;
        padding: 0;
        font-size: 14px;
        font-weight: bold;
        background: #3db9fd;
        border: none;
        cursor: pointer;
        opacity: .9;
        &:hover{
          opacity: 1;
        }
      }
    }
  }
  .finished{
    background: url('../../assets/images/finished.gif') no-repeat;
  }
}

</style>
