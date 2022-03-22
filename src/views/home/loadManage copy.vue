<!-- energy -->
<template>
  <div class="load-manage">
    <div class="GJ basis">
      <div class="box-scroll">
        <div class="type-box" @click="checkClassify(classifyData.basic)">
          <div class="bar">
            <i v-for="(ite,ind) in classifyData.basic.load" :key="ind">
              <!-- <img :src="require('../../assets/images/load/'+ite.name+'.png')" alt="" srcset="" onerror="defaultImg()"> -->
              <img src="../../assets/images/load/sub_04.png" alt="" srcset="">
            </i>
          </div>
          <p>{{classifyData.basic.name}}</p>
        </div>
      </div>
    </div>
    <div class="GJ custom">
      <div class="box-scroll">
        <div class="type-box">
          <div class="bar add" @click="addVisible=true"></div>
          <p>新增分类</p>
        </div>
        <div class="type-box" v-for="(item,index) in classifyData.customize" :key="index">
          <div class="bar scroll-none" @click="checkClassify(item)">
            <i v-for="(ite,ind) in item.load" :key="ind">
              <!-- <img :src="require('../../assets/images/load/'+ite.name+'.png')" alt="" srcset="" onerror="defaultImg()"> -->
              <img src="../../assets/images/load/sub_04.png" alt="" srcset="">
            </i>
          </div>
          <p>{{item.name}}</p>
        </div>
      </div>
    </div>
    <!-- 查看工具分类弹框 -->
    <el-dialog v-if="dialogVisible" :visible.sync="dialogVisible" width="602px" :show-close="false" class="check-classify" :close-on-press-escape="false">
      <div class="dialog-box">
        <p>
          <i class="del" v-if="editBool" @click="delClassify(dialogData.name)"></i>
          <span>
            <input type="text" v-model="dialogData.name" :disabled="dis" :style="!dis?'border: 1px solid #004d98':''" @blur="classifyHandle(dialogData.name, 'update')">
          </span>
          <i class="edit" v-if="editBool" @click="editTitle($event, dialogData.name)"></i>
        </p>
        <!-- 以跑马灯分页的形式展示工具列表 -->
        <el-carousel indicator-position="outside" :autoplay="false" trigger="click" height="420px" arrow="never">
          <el-carousel-item v-for="item in pageTotal" :key="item">
            <div class="box">
              <!-- 新增工具按钮 -->
              <dl class="add-load" v-if="editBool" @click="addLoadVisible = true">
                <dt></dt>
                <dd>新增工具</dd>
              </dl>
              <!-- 每一个工具块 -->
              <div v-for="(ite,ind) in pageData(item)" :key="ind" class="load-block">
                <div class="img" :title="ite.name">
                  <i v-if="editBool" @click="delLoad(ite.name)"></i>
                  <!-- <img :src="require('../../assets/images/load/'+ite.name+'.png')" alt=""> -->
                  <img src="../../assets/images/load/sub_04.png" alt="" srcset="">
                </div>
                <span :title="ite.name">{{ite.name}}</span>
                <p>
                  <i @click="downLoad(ite, editBool, dialogData.name)" v-if="ite.conf!==''" title="下载配置文件"></i>
                  <el-upload
                    class="upload-i"
                    ref="upload"
                    :data="uploadData"
                    :action="`${baseURL}/load/conf`"
                    :file-list="fileList"
                    :show-file-list="false"
                    :on-success="uploadSuccess"
                    :on-error="uploadError"
                    accept=".conf"
                    v-if="ite.conf!==''"
                    >
                    <i @click="uploadLoad(ite, editBool, dialogData.name)" title="上传配置文件"></i>
                  </el-upload>
                  <i @click="execute(ite.name,dialogData.name, ite.conf)" title="执行工具"></i>
                </p>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </div>
    </el-dialog>
    <!-- 确认删除弹框 -->
    <el-dialog :visible.sync="firmVisible" width="300px" :show-close="false" class="delfirm" :close-on-click-modal="false"  :close-on-press-escape="false">
      <div class="del-box">
        <p>确认要删除该{{delFirmTitle}}吗？</p>
        <div class="btns">
          <el-button @click="firmVisible=false">取消</el-button>
          <el-button type="danger" @click="classifyHandle(delName, 'delete')" v-if="delFirmTitle==='分类'">确认</el-button>
          <el-button type="danger" @click="delLoadConfirm()" v-if="delFirmTitle==='工具'">确认</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 工具执行状态动画 -->
    <div class="execute-gif" v-if="executeState" :class="finished?'finished':''">
      <p v-show="finished">
        <span>执行完成</span>
        <button @click="back()">返回</button>
      </p>
    </div>
    <!-- 新增分类弹框 -->
    <el-dialog :visible.sync="addVisible" width="300px" :show-close="false" class="addfirm" :close-on-click-modal="false"  :close-on-press-escape="false">
      <div class="add-box">
        <p>请输入分类名称：</p>
        <input type="text" v-model="classifyName">
        <div class="btns">
          <el-button @click="addVisible=false">取消</el-button>
          <el-button type="primary" @click="classifyHandle(classifyName, 'create')">确认</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 新增工具弹框 -->
    <el-dialog :visible.sync="addLoadVisible" width="450px" :show-close="false" class="addload" :close-on-click-modal="false" :close-on-press-escape="false">
      <div class="addload-box">
        <p>
          <span>
            新增工具
          </span>
        </p>
        <div class="box">
          <ul class="content">
            <li>
              <p>工具名称</p>
              <div class="inputs">
                <el-input type="text" v-model="form.name"></el-input>
              </div>
            </li>
            <li>
              <p>选择分类</p>
              <div class="inputs">
                <el-select v-model="form.classify" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <img src="../../assets/images/load/sub_05.png" class="classify-icon">
              </div>
            </li>
            <li>
              <p>上传工具</p>
              <div class="inputs up-inputs">
                <el-input type="text" v-model="form.filename" style="width:220px" suffix-icon="el-icon-more" disabled placeholder="点击按钮选择文件"></el-input>
                <el-upload
                    class="upload-i"
                    ref="uploadGJ"
                    :data="form"
                    :action="`${baseURL}/load/upload`"
                    :file-list="loadFileList"
                    :show-file-list="false"
                    :on-success="loadSuccess"
                    :on-error="loadError"
                    :on-change="loadChange"
                    :auto-upload="false"
                    accept=".zip"
                    >
                    <el-button class="upload-btn">选择</el-button>
                  </el-upload>
              </div>
            </li>
          </ul>
          <div class="btns">
            <button @click="loadSubmit()">确认</button>
            <button @click="addLoadVisible = false">取消</button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import baseURL from '@/api/base'
import { load } from '@/api'
import {downloadByBlob} from '@/utils/download'

const {getLoad, downloadConf, downloadResult, classifyHandle, delLoad} = load

export default {
  name: 'loadManage',
  components: {

  },
  data () {
    return {
      addLoadVisible: false,
      baseURL:baseURL,
      loadData: {},
      uploadData: {},
      fileList: [],
      loadFileList: [],
      classifyName: '',
      addVisible:false,
      finished: false,
      executeState:false,
      firmVisible: false,
      editBool: false,
      dialogVisible: false,
      dialogData: {
        id: 0,
        name: '',
        load: []
      },
      classifyData: {
        basic: [],
        customize: []
      },
      defaultClassify:{
        name: '基础工具',
        load: []
        },
      classifyList: [],
      pagingList: [],
      pageTotal: 1,
      dis: true,
      delName: '',
      delFirmTitle: '',
      ws: null,
      form: {
        name: '',
        class: '',
        classify: '',
        filename: null
      },
      options:[
        {
          label: 'GJ工具',
          value: 'GJ工具'
        },
        {
          label: 'ZC工具',
          value: 'ZC工具'
        }
      ],
      oldname: '',
      delName: '',
      executeData: {
        load_name: '',
        load_classify: '',
        load_conf: '',
        load_type: ''
      }
    }
  },
  created(){
    this.getLoad()
  },
  mounted () {
  },
  methods: {
    defaultImg(){
      console.log(234324)
    },
    getLoad(){
      // 获取载荷列表
      getLoad().then(res=>{
        res = res.data
        if (res.code === 0) {
          this.classifyData = {
            basic: {
              name: 'basic',
              load: res.DataList.basic
            },
            customize: res.DataList.customize
          }
        }
        console.log(this.classifyData)
      })
    },
    // 开始上传载荷文件
    loadSubmit() {
      this.$refs.uploadGJ.submit()
    },
    // 选择文件触发事件
    loadChange(file, files){
      if (file.status === 'ready') {
        this.form.filename = file.name
      }
    },
    // 上传载荷文件成功
    loadSuccess(res, file, files){
      console.log(res,file,files)
      if (res.code === 0) {
        this.$message({
          message: res.msg,
          type: 'success'
        })
        this.$refs.uploadGJ.clearFiles()
        this.form = {
          name: '',
          class: '',
          classify: '',
          filename: null
        }
        this.addLoadVisible = false
        this.dialogVisible = false
        this.getLoad()
        this.$forceUpdate()
      } else {
        this.$refs.uploadGJ.clearFiles()
        this.form.filename = null
        this.$message({
          message: res.msg,
          type: 'error'
        })
      }
    },
    // 上传载荷文件失败
    loadError(err, file, filelist){
      console.log(err)
    },
    // 上传载荷配置文件成功
    uploadSuccess(res, file, files) {
      console.log(res)
      this.$message({
        message: res.msg,
        type: 'success'
      })
      localStorage.setItem('filename',res.filename)
    },
    // 上传载荷配置文件失败
    uploadError(err, file, fileList) {
      console.log(err);
    },
    // 下载载荷配置文件
    downLoad(ite, bool, classname){
      console.log(bool)
      let params = {
        load_type:bool?'customize':'basic',
        load_name:ite.name,
        conf_name:ite.conf,
        class_name: bool?classname:null
      }
      downloadConf(params).then(res=>{
        res = res.data
        downloadByBlob(res,ite.conf)
      })

    },
    // 上传配置文件点击事件
    uploadLoad(ite, bool, classname){
      console.log(`${baseURL}/load/conf`)
      this.uploadData = {
        load_type:bool?'customize':'basic',
        load_name:ite.name,
        conf_name:ite.conf,
        class_name: bool?classname:null
      }
    },
    // 新增分类
    classifyHandle(name, type){
      let params = {}
      if (type === 'update') {
        params = {
          class: name,
          oldname: this.oldName,
          type: type
        }
      } else {
        params = {
          class: name,
          type: type
        }
      }
      classifyHandle(params).then(res=>{
        res = res.data
        if (res.code === 0) {
          this.$message({
            message: res.msg,
            type: 'success'
          })
          switch (type) {
            case 'create':
              this.addVisible = false
              break
            case 'update':
              this.dis = true
              break
            case 'delete':
              this.firmVisible = false
              this.dialogVisible = false
              break

            default:
              break
          }
          this.getLoad()
          this.$forceUpdate()
        }
      })
    },
    // 数据分页渲染
    pageData(index){
      let arr = []
      let len = 12
      if (index === 1) {
        len = 11
      }
      if (this.dialogData.load.length) {
        for (let i = ((index-1)*len); i < (index*len); i++) {
          if (this.dialogData.load[i]) {
            arr.push(this.dialogData.load[i])
          }
        }
        return arr
      }
    },
    // 查看工具分类
    checkClassify(val){
      if (val.name === 'basic') {
        this.editBool = false
      } else {
        this.editBool = true
        this.form.class = val.name
      }
      this.pageTotal = Math.ceil(val.load.length / 11)
      if (!this.pageTotal) {
        this.pageTotal = 1
      }
      this.dialogData = JSON.parse(JSON.stringify(val))
      this.dialogVisible = true
    },
    // 修改分类名称
    editTitle(e, name){
      this.dis = false
      this.oldName = name
      this.$nextTick(()=>{
        e.currentTarget.previousElementSibling.firstElementChild.focus()
      })
    },
    // 打开删除分类弹框
    delClassify(name){
      this.delFirmTitle = '分类'
      this.delName = name
      this.firmVisible = true
    },
    // 执行工具
    execute(name,classifyName, conf){
      console.log(conf)
      if (localStorage.getItem('filename') === '' && conf !== '') {
        this.$message({
          message: '请先上传载荷配置文件',
          type: 'error'
        })
      } else {
        this.executeData.load_name = name
        if (classifyName === 'basic') {
          this.executeData.load_type = classifyName
          this.executeData.load_classify = ''
        } else {
          this.executeData.load_type = 'customize'
          this.executeData.load_classify = classifyName
        }
        this.ws = new WebSocket(`ws://${baseURL.replace('http://','')}/load/execute/${localStorage.getItem('only')}`)
        console.log(this.ws)
        this.executeState = true
        this.ws.onopen = this.onOpen
        this.ws.onerror = this.onError
        this.ws.onclose = this.onClose
        this.ws.onmessage = this.onMessage

      }
    },
    onOpen(){
      console.log('成功连接')
      this.executeData.load_conf = localStorage.getItem('filename')
      console.log(JSON.stringify(this.executeData))
      this.ws.send(JSON.stringify(this.executeData))
    },
    onError(err){
      console.log(err)
    },
    onClose(){
      console.log('连接断开')
    },
    onMessage(res){
      let re = JSON.parse(res.data)
      console.log(re)
      if (re.code === 2) {
        localStorage.setItem('filename','')
        this.finished = true
        downloadResult({filename:re.filename}).then(res=>{
          console.log(res)
          res = res.data
          let arr = re.filename.split('.')
          console.log(arr[arr.length - 1])
          if (arr[arr.length - 1] === 'pcap') {
            window.open(baseURL+'/load/result?filename='+re.filename)
          } else {
            downloadByBlob(res,re.filename)
          }
        })
      } else if (re.code === 1) {
        this.$message({
          message: re.msg,
          type: 'error'
        })
        localStorage.setItem('filename','')
        this.executeState = false
      }
    },
    // 返回
    back(){
      this.executeState = false
      this.finished = false
    },
    // 打开删除工具弹框
    delLoad(ite){
      // console.log(ite)
      this.delName = ite
      this.delFirmTitle = '工具'
      this.firmVisible = true
    },
    // 确认删除工具
    delLoadConfirm(){
      let data = {
        classifyName: this.form.class,
        name: this.delName
      }
      delLoad(data).then(res=>{
        res = res.data
        if (res.code === 0) {
          console.log(res)
          this.$message({
            message: res.msg,
            type: 'success'
          })
          this.firmVisible = false
          this.dialogVisible = false
          this.getLoad()
          this.$forceUpdate()
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.load-manage{
  width: 100%;
  height: 100%;
  padding: 40px 0;
  box-sizing: border-box;
  display: flex;
  .GJ{
    height: 100%;
    border: 1px solid #3db9fd;
    padding-top: 40px;
    position: relative;
    .box-scroll{
      width: 100%;
      height: 100%;
      overflow-y: auto;
      display: flex;
      .type-box{
        width: 252px;
        height: 302px;
        margin: 35px;
        .bar{
          width: 252px;
          height: 302px;
          background: url('../../assets/images/bar_s.png') no-repeat;
          cursor: pointer;
          padding: 10px;
          overflow-y: auto;
          >i{
            width: 50px;
            height: 50px;
            float: left;
            margin: 13px;
            >img{
              width: 100%;
              height: 100%;
            }
          }
        }
        .add{
          background: url('../../assets/images/bar_add.png') no-repeat;
        }
        >p{
          color: #fff;
          margin: 5px 0;
        }
      }
    }
    &::before{
      width: 100%;
      height: 40px;
      font-size: 18px;
      font-weight: bold;
      background-image: linear-gradient(#0671D7,#004384,#000);
      color: #fff;
      line-height: 35px;
      position: absolute;
      top: 0;
      left: 0;
    }
  }
  .basis{
    width: 350px;
    .box-scroll{
      flex-direction: column;
      align-items: center;
    }
    &::before{
      content: '基础工具';
    }
  }
  .custom{
    flex: 1;
    margin-left: 40px;
    padding-left: 35px;
    .box-scroll{
      flex-wrap: wrap;
    }
    &::before{
      content: '自定义工具';
    }
  }
  .check-classify{
    background: rgba($color: rgb(0, 20, 41), $alpha: 0.6);
    .dialog-box{
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0 30px 20px 30px;
      >p{
        width: 214px;
        height: 40px;
        line-height: 40px;
        margin: 0;
        color: #000;
        display: flex;
        justify-content: space-around;
        align-items: center;
        >span{
          width: 154px;
          height: 32px;
          >input{
            width: 154px;
            height: 100%;
            text-align: center;
            font-size: 22px;
            font-weight: bold;
            background: none;
            border: none;
            border-radius: 3px;
            outline: none;
            &:disabled{
              color: #000;
            }
          }
        }
        >i{
          width: 22px;
          height: 22px;
          cursor: pointer;
          opacity: .8;
          &:hover{
            opacity: 1;
          }
        }
        .del{
          background: url('../../assets/images/icon_del_1.png') no-repeat;
        }
        .edit{
          background: url('../../assets/images/icon_edit.png') no-repeat;
        }
      }
      .box{
        width: 100%;
        flex: 1;
        // display: flex;
        // justify-content: flex-start;
        // flex-wrap: wrap;
        padding-top: 10px;
        .add-load{
          width: 70px;
          height: 100px;
          padding-top: 20px;
          margin: 20px 32px;
          cursor: pointer;
          float: left;
          &:hover{
            >dt{
              opacity: 1;
            }
          }
          >dt{
            width: 100%;
            height: 41px;
            background: url('../../assets/images/sub_add.png') no-repeat center;
            margin-bottom: 15px;
            opacity: .8;
          }
          >dd{
            margin: 0;
            color: #fff;
          }
        }
        .load-block{
          width: 70px;
          height: 125px;
          margin: 20px 32px;
          display: flex;
          flex-direction: column;
          align-items: center;
          float: left;
          .img{
            width: 62px;
            height: 62px;
            position: relative;
            >img{
              width: 100%;
              height: 100%;
            }
            >i{
              width: 22px;
              height: 22px;
              background: url('../../assets/images/icon_del_2.png') no-repeat;
              position: absolute;
              top: -8px;
              right: -8px;
              cursor: pointer;
              opacity: .8;
              &:hover{
                opacity: 1;
              }
            }
          }
          >span{
            width: 100%;
            color: #fff;
            font-size: 16px;
            // overflow: hidden;
            // white-space: nowrap;
            // text-overflow: ellipsis;
            text-overflow: -o-ellipsis-lastline;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;
          }
          >p{
            width: 100%;
            margin: 0;
            display: flex;
            justify-content: space-around;
            >i{
              width: 22px;
              height: 22px;
              cursor: pointer;
              opacity: .8;
              &:hover{
                opacity: 1;
              }
              &:nth-child(1){
                background: url('../../assets/images/icon_downloads.png') no-repeat;
              }
              &:nth-child(2){
                background: url('../../assets/images/icon_uploads.png') no-repeat;
              }
              &:last-child{
                background: url('../../assets/images/icon_run.png') no-repeat;
              }
            }
            .upload-i{
              width: 22px;
              i{
                display: inline-block;
                width: 22px;
                height: 22px;
                cursor: pointer;
                opacity: .8;
                background: url('../../assets/images/icon_uploads.png') no-repeat;
                &:hover{
                  opacity: 1;
                }
              }

            }
          }
        }
      }
      /deep/ .el-carousel{
        width: 100%;
      }
      /deep/ .el-carousel__button{
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #00d9db;
      }
    }
    /deep/ .el-dialog{
      height: 516px;
      background: #00101D url('../../assets/images/bar_l.png') no-repeat;
    }
    /deep/ .el-dialog__header{
      display: none;
    }
    /deep/ .el-dialog__body{
      padding: 0;
      height: 100%;
    }
  }
  .delfirm{
    .del-box{
      height: 100%;
      color: #fff;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      >p{
        font-size: 18px;
        color: #ff2828;
        margin-bottom: 30px;
      }
      .btns{
        >button{
          padding: 6px 12px;
        }
      }
    }
    /deep/ .el-dialog{
      height: 200px;
      background: #00101D url('../../assets/images/bar_s.png') no-repeat;
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
  .execute-gif{
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    background: url('../../assets/images/loading.gif') no-repeat center;
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;
    >p{
      width: 80px;
      margin-top: 30px;
      display: flex;
      flex-direction: column;
      // position: fixed;
      // top: 520px;
      // left: 0;
      // right: 0;
      // margin: auto;
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
    background-position-x: 10px;
  }
  .addfirm{
    .add-box{
      height: 100%;
      color: #fff;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      >p{
        font-size: 18px;
        color: #fff;
        margin-bottom: 20px;
      }
      >input{
        width: 150px;
        height: 35px;
        background: transparent;
        border: 1px solid #3db9fd;
        border-radius: 0;
        outline: none;
        margin-bottom: 30px;
        color: #fff;
        padding: 0 15px;
      }
      .btns{
        >button{
          padding: 6px 12px;
        }
      }
    }
    /deep/ .el-dialog{
      height: 200px;
      background: #00101D url('../../assets/images/bar_s.png') no-repeat;
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
  .addload{
    background: rgba($color: rgb(0, 20, 41), $alpha: 0.8);
    .addload-box{
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      >p{
        width: 214px;
        height: 35px;
        line-height: 35px;
        margin: 0;
        color: #000;
        display: flex;
        justify-content: space-around;
        align-items: center;
        >span{
          width: 154px;
          height: 35px;
          font-size: 22px;
          font-weight: bold;
        }
      }
      .box{
        width: 100%;
        flex: 1;
        display: flex;
        flex-direction: column;
        .content{
          width: 100%;
          flex: 1;
          list-style: none;
          >li{
            height: 85px;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            >p{
              height: 30px;
              background: url('../../assets/images/point.png') no-repeat;
              background-size: 30px 30px;
              font-size: 18px;
              font-weight: bold;
              color: #fff;
              padding: 0 40px;
              margin: 0;
              line-height: 35px;
              margin-bottom: 5px;
            }
            .inputs{
              width: 295px;
              height: 30px;
              margin-left: 40px;
              .classify-icon{
                margin: 0;
                padding: 0;
                position: relative;
                top: -20px;
              }
              /deep/ .el-select{
                width: 200px;
                height: 100%;
                float: left;
              }
              /deep/ .el-input--medium{
                width: 100%;
                height: 100%;
              }
              /deep/ .el-input__inner{
                width: 100%;
                height: 100%;
                background: transparent;
                color: #fff;
                border: 1px solid #3cbbfc;
                font-size: 14px;
                border-radius: 0;
              }
              /deep/ .el-input--medium .el-input__icon{
                color: #fff;
                line-height: 30px;
              }
            }
            .up-inputs{
              display: flex;
              .upload-btn{
                width: 70px;
                height: 30px;
                line-height: 30px;
                padding: 0;
                margin: 0;
                border: none;
                background: #3cbbfd;
                color: #000;
                border-radius: 0;
                font-weight: bold;
              }
              /deep/ .upload-i{
                height: 30px;
              }
              /deep/ .el-input__inner{
                height: 30px;
              }
              /deep/ .el-input--medium .el-input__icon{
                color: #3cbbfd;
              }
            }
          }
        }
        .btns{
          width: 100%;
          height: 30px;
          margin-bottom: 30px;
          >button{
            width: 70px;
            height: 28px;
            border: none;
            background: #3cbbfd;
            font-size: 16px;
            font-weight: bold;
            margin: 0 20px;
            cursor: pointer;
            opacity: .9;
            &:hover{
              opacity: 1;
            }
          }
        }
      }
    }
    /deep/ .el-dialog{
      height: 400px;
      margin-top: 30vh !important;
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
}
</style>
