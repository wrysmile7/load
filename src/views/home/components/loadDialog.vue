<template>
  <el-dialog
    :visible.sync="loadVisible"
    width="80%"
    :show-close="false"
    class="check-load"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <div class="check-load-box">
      <ul class="bar-box">
        <li
          :class="activeTab === index ? 'active' : ''"
          v-for="(item, index) in barConfig"
          :key="index"
        >
          {{ item }}
        </li>
      </ul>
      <div class="box">
        <div class="content">
          <!-- <Table
            :tableDatas="tableData"
            :tableConfigs="tableConfig"
            :totals="total"
            @currentChange="currentChange"
            :tablename="'device'"
            :IDStr.sync="IDStr"
            @delDevices="delDevices"
          ></Table> -->
        </div>
        <div class="btns">
          <button @click="cancel()">关闭</button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import baseURL from '@/api/base'
import { load } from '@/api'
import bus from '@/utils/bus'
import Table from './Table'

const { addDevices, editDevices } = load

export default {
  name: 'loadDialog',
  components: {
    Table
  },
  props: {
    loadVisible: {
      type: Boolean,
      required: true
    },
    deviceData: {
      default: null
    }
  },
  data() {
    return {
      barConfig: ['内网定位工具', 'ZCGJ工具'],
      activeTab: 0
    }
  },
  watch: {
    deviceData: {
      handler(val) {
        console.log(val)
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
                this.$emit('update:loadVisible', false)
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
                this.$emit('update:loadVisible', false)
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
      this.$emit('update:loadVisible', false)
    }
  }
}
</script>
<style lang="scss" scoped>
.check-load {
  background: rgba($color: rgb(0, 20, 41), $alpha: 0.8);
  .check-load-box {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    .bar-box {
      width: 100%;
      height: 35px;
      list-style: none;
      display: flex;
      border-bottom: 2px solid #3db9fc;
      padding: 0;
      margin: 0;
      > li {
        width: 200px;
        height: 33px;
        background: #177eb6;
        color: #fff;
        font-size: 16px;
        line-height: 33px;
        cursor: pointer;
        &:hover {
          background: #3cbbfd;
        }
      }
      .active {
        height: 35px;
        background: #00101d;
        border: 2px solid #3db9fc;
        border-bottom: none;
        color: #3db9fc;
        font-weight: bold;
        cursor: auto;
        &:hover {
          background: #00101d;
        }
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
        margin-bottom: 10px;
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
    height: 75%;
    box-shadow: 0 0 20px 18px #005ebb inset;
    background: transparent;
    border: 1px solid #3cbbfd;
    border-radius: 10px;
    padding: 20px;
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
