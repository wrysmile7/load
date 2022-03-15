<template>
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
              <img src="../../../assets/images/load/sub_05.png" class="classify-icon">
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
          <button @click="cancel()">取消</button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import baseURL from '@/api/base'
import { load } from '@/api'

const {getLoad, downloadConf, downloadResult, classifyHandle, delLoad} = load

export default {
  name: 'addLoad',
  props: ['addLoadVisible','forms'],
  data() {
    return {
      baseURL: baseURL,
      loadFileList: [],
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
    }
  },
  watch: {
    forms:{
      handler(val){
        this.form = JSON.parse(JSON.stringify(val))
      },
      deep: true
    }
  },
  methods: {
    // 开始上传载荷文件
    loadSubmit() {
      this.$refs.uploadGJ.submit()
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
        this.form.name = ''
        this.form.classify = ''
        this.form.filename = null
        this.$emit('update:addLoadVisible', false)
        this.$emit('addSuccess')
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
    // 选择文件触发事件
    loadChange(file, files){
      if (file.status === 'ready') {
        this.form.filename = file.name
      }
    },
    cancel(){
      this.$emit('update:addLoadVisible', false)
    },
  },
}
</script>
<style lang="scss" scoped>
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
              background: url('../../../assets/images/point.png') no-repeat;
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
      background: #00101D url('../../../assets/images/bar_l.png') no-repeat;
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
</style>
