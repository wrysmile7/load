<template>
  <div class="update-box">
    <p>
      <span>修改IP</span>
    </p>
    <div class="box">
      <ul>
        <li :class="activeTab === ind?'active':''" v-for="(ite,ind) in activeConfig" :key="ind" @click="change(ind)">{{ite}}</li>
      </ul>
      <div class="content">
        <ul>
          <li v-for="(item,index) in form" :key="index">
            <p :style="activeTab?'opcaity:1':'opacity:0.5'">{{item.key}}</p>
            <div class="inputs">
              <div v-for="(ite,ind) in item.value" :key="ind">
                <el-input type="text" v-model="item.value[ind]" :disabled="activeTab?false:true"></el-input>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <p v-if="!activeTab">使用动态IP时无需配置，直接确认即可</p>
      <p v-if="activeTab" style="color:red;">{{tips}}</p>
      <div class="btns">
        <button @click="submit(activeTab)">确认</button>
        <button @click="cancel()">取消</button>
      </div>
    </div>
    <!-- 工具执行状态动画 -->
    <div class="execute-gif" v-if="executeState" :class="finished?'finished':''">
      <p v-show="finished">
        <span>IP设置成功</span>
        <button @click="back()">返回</button>
      </p>
    </div>
  </div>
</template>
<script>
import {load} from '@/api'
const {updateIPAddress} = load
export default {
  props: ['updateIPVisible'],
  data() {
    return {
      executeState: false,
      finished: false,
      activeTab: 0,
      activeConfig: ['动态IP地址', '静态IP地址'],
      form: [
        {
          key: 'IP',
          value: [,,,,]
        },
        {
          key: '子网掩码',
          value: [,,,,]
        },
        {
          key: '网关',
          value: [,,,,]
        },
        {
          key: 'DNS',
          value: [,,,,]
        }
      ],
      tips: ''
    }
  },
  methods: {
    back(){
      this.finished = false
      this.executeState = false
      this.$emit('update:updateIPVisible', false)
      this.$emit('reGetIP')
    },
    change(ind){
      this.activeTab = ind
      this.initForm()
    },
    cancel(){
     this.$emit('update:updateIPVisible', false)
     this.initForm()
     this.activeTab = 0
    },
    checkout(val,index,key){
      console.log(val,index,key)

      switch (key) {
        case 'IP':

          break
        case '子网掩码':

          break
        case '网关':

          break
        case 'DNS':

          break

        default:
          break
      }
    },
    submit(index){
      this.executeState = true
      if (index === 1) { // 静态IP
        let ipReg = /^(([01]?[0-9]?[0-9]|2([0-4][0-9]|5[0-5]))\.){3}([01]?[0-9]?[0-9]|2([0-4][0-9]|5[0-5]))$/
        let maskReg = /^(254|252|248|240|224|192|128|0)\.0\.0\.0|255\.(254|252|248|240|224|192|128|0)\.0\.0|255\.255\.(254|252|248|240|224|192|128|0)\.0|255\.255\.255\.(254|252|248|240|224|192|128|0)$/
        let gatewayReg = /^192\.168(\.(\d|([1-9]\d)|(1\d{2})|(2[0-4]\d)|(25[0-5]))){2}$/
        let dnsReg = /^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))$/
        if (ipReg.test(this.form[0].value.join('.'))) {
          if (maskReg.test(this.form[1].value.join('.'))) {
            if (gatewayReg.test(this.form[2].value.join('.'))) {
              if (dnsReg.test(this.form[3].value.join('.'))) {
                this.tips = ''
                let data = {
                  type: 'static',
                  ip: this.form[0].value.join('.'),
                  mask: this.form[1].value.join('.'),
                  gateway: this.form[2].value.join('.'),
                  dns: this.form[3].value.join('.')
                }
                console.log(data)
                updateIPAddress(data).then(res=>{
                  console.log(res)
                  this.finished = true
                })
              } else {
                this.tips = 'DNS输入有误，请重新输入！'
              }
            } else {
              this.tips = '网关输入有误，请重新输入！'
            }
          } else {
            this.tips = '子网掩码输入有误，请重新输入！'
          }
        } else {
          this.tips = 'IP地址输入有误，请重新输入！'
        }
      } else { // 动态IP
        updateIPAddress({type:'dynamic'}).then(res=>{
          console.log(res)
          this.finished = true
        })
      }
    },
    // form表单初始化
    initForm(){
      this.form = [
        {
          key: 'IP',
          value: [,,,,]
        },
        {
          key: '子网掩码',
          value: [,,,,]
        },
        {
          key: '网关',
          value: [,,,,]
        },
        {
          key: 'DNS',
          value: [,,,,]
        }
      ]
    }
  }
}
</script>
<style lang="scss" scoped>
.update-box{
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
      font-size: 22px;
      font-weight: bold;
    }
  }
  .box{
    width: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    >ul{
      height: 35px;
      list-style: none;
      display: flex;
      justify-content: center;
      border-bottom: 2px solid #3db9fc;
      padding: 0;
      margin: 40px 0 0 0;
      >li{
        width: 200px;
        height: 33px;
        background: #2575a1;
        color: #000;
        font-size: 16px;
        line-height: 33px;
        cursor: pointer;
        &:hover{
          background: #3cbbfd;
        }
      }
      .active{
        height: 35px;
        background: #00101D;
        border: 2px solid #3db9fc;
        border-bottom: none;
        color: #3db9fc;
        cursor: auto;
        &:hover{
          background: #00101D;
        }
      }
    }
    .content{
      width: 100%;
      flex: 1;
      >ul{
        list-style: none;
        >li{
          height: 90px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: space-around;
          >p{
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
          .inputs{
            height: 35px;
            padding-left: 40px;
            >div{
              width: 80px;
              height: 35px;
              display: inline-block;
              margin-right: 20px;
              position: relative;
              /deep/ .el-input--medium{
                height: 100%;
              }
              /deep/ .el-input__inner{
                width: 100%;
                height: 100%;
                background: transparent;
                color: #fff;
                border: 1px solid #3cbbfc;
                text-align: center;
                font-size: 16px;
                border-radius: 0;
              }
              /deep/ .el-input.is-disabled{
                opacity: .5;
              }
              &::after{
                content:'.';
                width: 2px;
                height: 2px;
                color: #3cbbfc;
                position: absolute;
                bottom: 15px;
                right: -10px;
                font-weight: bold;
              }
              &:last-child{
                &::after{
                  content: '';
                }
              }
            }

          }
        }
      }
    }
    >p{
      margin: 0 0 10px 0;
      color: #fff;
    }
    .btns{
      width: 100%;
      height: 33px;
      margin-bottom: 20px;
      >button{
        width: 80px;
        height: 33px;
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
  .execute-gif{
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
    background: url('../../../assets/images/finished.gif') no-repeat;
    background-position-x: 10px;
  }
}
</style>
