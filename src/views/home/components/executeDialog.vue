<template>
  <div class="update-box">
    <p>
      <span>工具执行</span>
    </p>
    <div class="box">
      <div class="content">
        <ul>
          <!-- <li>
            <p>网段</p>
            <div class="inputs">
              <p>
                请输入IP地址前三位网段，eg:'192.168.1'
              </p>
              <div class="box-scroll">
                <div class="inputs-box">
                  <div v-for="(ite, ind) in form.ip" :key="ind">
                    <el-input type="text" v-model="form.ip[ind]"></el-input>
                  </div>
                </div>
              </div>
            </div>
          </li> -->
          <li>
            <p>IP地址</p>
            <div class="inputs">
              <p>
                请输入IP地址前三位网段，eg:'192.168.1'
              </p>
              <div class="box-scroll">
                <div class="inputs-box">
                  <div v-for="(ite, ind) in form.ip" :key="ind">
                    <el-input type="text" v-model="form.ip[ind]"></el-input>
                  </div>
                </div>
              </div>
            </div>
            <div class="inputs">
              <p>
                请以输入IP地址最后一位区间值
                <el-button type="primary" size="mini" @click="addIp()"
                  >添加</el-button
                >
              </p>
              <div class="box-scroll">
                <div
                  class="inputs-box"
                  v-for="(item, index) in form.section"
                  :key="index"
                >
                  <div class="port">
                    <el-input type="text" v-model="item.start"></el-input>
                  </div>
                  <span>—</span>
                  <div class="port">
                    <el-input type="text" v-model="item.end"></el-input>
                  </div>
                  <el-button type="danger" size="mini" @click="delIp(index)"
                    >删除</el-button
                  >
                </div>
              </div>
            </div>
          </li>
          <li>
            <p>端口</p>
            <div class="inputs">
              <p>
                请以依次输入端口,各端口之间用英文逗号分隔,eg:'80,8080'
              </p>
              <el-input type="text" v-model="ports"></el-input>
            </div>
          </li>
        </ul>
      </div>
      <div class="btns">
        <button @click="submit()">确认</button>
        <button @click="cancel()">取消</button>
      </div>
    </div>
    <!-- 工具执行状态动画 -->
    <div
      class="execute-gif"
      v-if="executeState"
      :class="finished ? 'finished' : ''"
    >
      <p v-show="finished">
        <span>工具执行完毕</span>
        <button @click="back()">返回</button>
      </p>
    </div>
  </div>
</template>
<script>
import baseURL from '@/api/base'
import { load } from '@/api'
const { updateIPAddress } = load
export default {
  props: ['executeVisible', 'executeData'],
  data() {
    return {
      executeState: false,
      finished: false,
      data: {},
      form: {
        ip: [, , ,],
        section: [
          {
            start: '',
            end: ''
          }
        ]
      },
      ports: ''
    }
  },
  methods: {
    // 添加IP
    addIp() {
      this.form.section.push({
        start: '',
        end: ''
      })
    },
    // 删除IP
    delIp(i) {
      this.form.section.splice(i, 1)
    },
    // 取消
    cancel() {
      this.$emit('update:executeVisible', false)
      this.initForm()
    },
    // 提交执行
    submit() {
      this.data = {
        load_classify: this.executeData.load_classify,
        load_name: this.executeData.load_name,
        params: {
          network: '',
          ip: [],
          port: ''
        }
      }
      this.form.section.forEach(v => {
        this.data.params.ip.push(`${v.start}-${v.end}`)
      })
      this.data.params.network = this.form.ip.join('.')
      this.data.params.port = this.ports
      console.log(this.data)
      this.ws = new WebSocket(
        `ws://${baseURL.replace('http://', '')}/position/1`
      )
      console.log(this.ws)
      this.executeState = true
      this.ws.onopen = this.onOpen
      this.ws.onerror = this.onError
      this.ws.onclose = this.onClose
      this.ws.onmessage = this.onMessage
    },
    onOpen() {
      console.log('成功连接')
      this.ws.send(JSON.stringify(this.data))
    },
    onError(err) {
      console.log(err)
    },
    onClose() {
      console.log('连接断开')
    },
    onMessage(res) {
      let re = JSON.parse(res.data)
      console.log(re)
      if (re.code === 2) {
        this.$message({
          message: re.msg,
          type: 'success'
        })
        this.finished = true
      } else if (re.code === 1) {
        this.$message({
          message: re.msg,
          type: 'error'
        })
        this.finished = true
        this.executeState = false
      }
    },
    // form表单初始化
    initForm() {
      this.form = {
        ip: [, , ,],
        section: [
          {
            start: '',
            end: ''
          }
        ]
      }
      this.ports = ''
    },
    // 返回
    back() {
      this.executeState = false
      this.finished = false
    }
  }
}
</script>
<style lang="scss" scoped>
.update-box {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 30px 20px 30px;
  > p {
    width: 214px;
    height: 40px;
    line-height: 40px;
    margin: 0;
    color: #000;
    display: flex;
    justify-content: space-around;
    align-items: center;
    > span {
      width: 154px;
      height: 32px;
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
      padding-top: 20px;
      > ul {
        list-style: none;
        padding: 0 40px;
        > li {
          // height: 90px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: space-around;
          > p {
            height: 35px;
            background: url('../../../assets/images/point.png') no-repeat;
            background-size: 35px 35px;
            font-size: 18px;
            font-weight: bold;
            color: #fff;
            padding: 0 40px;
            margin: 0;
            line-height: 35px;
          }
          .inputs {
            width: 100%;
            // height: 35px;
            padding-left: 0px;
            > p {
              display: flex;
              justify-content: space-between;
              color: #eee;
            }
            .box-scroll {
              max-height: 120px;
              overflow: auto;
              .inputs-box {
                margin-bottom: 10px;
                display: flex;
                align-items: center;
                > div {
                  width: 60px;
                  height: 35px;
                  display: inline-block;
                  margin-right: 15px;
                  position: relative;
                  /deep/ .el-input--medium {
                    height: 100%;
                  }
                  /deep/ .el-input__inner {
                    width: 100%;
                    height: 100%;
                    background: transparent;
                    color: #fff;
                    border: 1px solid #3cbbfc;
                    text-align: center;
                    font-size: 16px;
                    border-radius: 0;
                  }
                  /deep/ .el-input.is-disabled {
                    opacity: 0.5;
                  }
                  &::after {
                    content: '.';
                    width: 2px;
                    height: 2px;
                    color: #3cbbfc;
                    position: absolute;
                    bottom: 15px;
                    right: -10px;
                    font-weight: bold;
                  }
                  &:last-child {
                    margin-right: 0;
                    &::after {
                      content: '';
                    }
                  }
                }
                .port {
                  margin: 0 5px;
                  &::after {
                    content: '';
                  }
                }
              }
            }
            /deep/ .el-input__inner {
              background: transparent;
              border-radius: 0;
              border-color: #3cbbfd;
              color: #fff;
            }
          }
        }
      }
    }
    > p {
      margin: 0 0 10px 0;
      color: #fff;
    }
    .btns {
      width: 100%;
      height: 33px;
      margin-bottom: 20px;
      > button {
        width: 80px;
        height: 33px;
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
  .execute-gif {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    background: url('../../../assets/images/loading.gif') no-repeat center;
    background-size: cover;
    display: flex;
    justify-content: center;
    align-items: center;
    > p {
      width: 80px;
      margin-top: 30px;
      display: flex;
      flex-direction: column;
      // position: fixed;
      // top: 520px;
      // left: 0;
      // right: 0;
      // margin: auto;
      > span {
        font-size: 14px;
        color: #fff;
        margin-bottom: 10px;
      }
      > button {
        width: 80px;
        height: 30px;
        padding: 0;
        font-size: 14px;
        font-weight: bold;
        background: #3db9fd;
        border: none;
        cursor: pointer;
        opacity: 0.9;
        &:hover {
          opacity: 1;
        }
      }
    }
  }
  .finished {
    background: url('../../../assets/images/finished.gif') repeat-y;
    background-position-x: 10px;
  }
}
</style>
