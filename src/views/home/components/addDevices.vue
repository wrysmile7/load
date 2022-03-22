<template>
  <el-dialog
    :visible.sync="addVisible"
    width="450px"
    :show-close="false"
    class="addload"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div class="addload-box">
      <p>
        <span> {{ title }}设备 </span>
      </p>
      <el-form class="box" :model="form" :rules="rules" ref="ruleForm">
        <ul class="content">
          <li>
            <p>设备名称</p>
            <el-form-item class="inputs" prop="device_name">
              <el-input type="text" v-model="form.device_name"></el-input>
            </el-form-item>
          </li>
          <li>
            <p>设备信息</p>
            <el-form-item class="inputs" prop="device_info">
              <el-input
                type="textarea"
                v-model="form.device_info"
                :rows="6"
              ></el-input>
            </el-form-item>
          </li>
        </ul>
        <div class="btns">
          <button @click="addSubmit()">确认</button>
          <button @click="cancel()">取消</button>
        </div>
      </el-form>
    </div>
  </el-dialog>
</template>
<script>
import baseURL from '@/api/base'
import { load } from '@/api'
import bus from '@/utils/bus'

const { addDevices, editDevices } = load

export default {
  name: 'AddDevices',
  props: {
    addVisible: {
      type: Boolean,
      required: true
    },
    editData: {
      default: null
    }
  },
  data() {
    return {
      title: '新增',
      baseURL: baseURL,
      form: {
        device_name: '',
        device_info: ''
      },
      rules: {
        device_name: [
          { required: true, message: '请输入设备名称', trigger: 'blur' }
        ],
        device_info: [
          { required: true, message: '请输入设备信息', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    editData: {
      handler(val) {
        console.log(val)
        if (val !== null) {
          this.form = val
          this.title = '编辑'
          this.$forceUpdate()
        } else {
          this.form = {
            device_name: '',
            device_info: ''
          }
          this.title = '新增'
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    // 确认新增
    addSubmit() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          if (this.form.id) {
            // 编辑设备
            editDevices(this.form).then(res => {
              res = res.data
              if (res.code === 0) {
                this.$message({
                  type: 'success',
                  message: res.msg
                })
                this.$emit('update:addVisible', false)
                bus.$emit('addSuccess')
              } else {
                this.$message({
                  type: 'error',
                  message: res.msg
                })
              }
            })
          } else {
            // 新增设备
            addDevices(this.form).then(res => {
              res = res.data
              if (res.code === 0) {
                this.$message({
                  type: 'success',
                  message: res.msg
                })
                this.$emit('update:addVisible', false)
                bus.$emit('addSuccess')
                this.form = {
                  device_name: '',
                  device_info: ''
                }
              } else {
                this.$message({
                  type: 'error',
                  message: res.msg
                })
              }
            })
          }
        }
      })
    },
    cancel() {
      this.$emit('update:addVisible', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.addload {
  background: rgba($color: rgb(0, 20, 41), $alpha: 0.8);
  .addload-box {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    > p {
      width: 214px;
      height: 35px;
      line-height: 35px;
      margin: 0;
      color: #000;
      display: flex;
      justify-content: space-around;
      align-items: center;
      > span {
        width: 154px;
        height: 35px;
        font-size: 22px;
        font-weight: bold;
      }
    }
    .box {
      width: 100%;
      flex: 1;
      display: flex;
      flex-direction: column;
      .content {
        width: 100%;
        flex: 1;
        list-style: none;
        > li {
          height: 85px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          > p {
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
          .inputs {
            width: 295px;
            height: 30px;
            margin-left: 40px;
            .classify-icon {
              margin: 0;
              padding: 0;
              position: relative;
              top: -20px;
            }
            /deep/ .el-input--medium {
              width: 100%;
              height: 100%;
            }
            /deep/ .el-input__inner {
              width: 100%;
              height: 30px;
              background: transparent;
              color: #fff;
              border: 1px solid #3cbbfc;
              font-size: 14px;
              border-radius: 0;
            }
            /deep/ .el-input--medium .el-input__icon {
              color: #fff;
              line-height: 30px;
            }
            /deep/ .el-textarea__inner {
              background: transparent;
              color: #fff;
              border: 1px solid #3cbbfc;
              font-size: 14px;
              border-radius: 0;
            }
          }
        }
      }
      .btns {
        width: 100%;
        height: 30px;
        margin-bottom: 30px;
        > button {
          width: 70px;
          height: 28px;
          border: none;
          background: #3cbbfd;
          font-size: 16px;
          font-weight: bold;
          margin: 0 20px;
          cursor: pointer;
          opacity: 0.9;
          &:hover {
            opacity: 1;
          }
        }
      }
    }
  }
  /deep/ .el-dialog {
    height: 400px;
    margin-top: 30vh !important;
    background: #00101d url('../../../assets/images/bar_l.png') no-repeat;
    background-size: 100% 100%;
  }
  /deep/ .el-dialog__header {
    display: none;
  }
  /deep/ .el-dialog__body {
    padding: 0;
    height: 100%;
  }
}
</style>
