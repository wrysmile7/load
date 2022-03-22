<!-- energy -->
<template>
  <div class="load-manage">
    <!-- 基础工具 -->
    <div class="GJ basis">
      <div class="box-scroll">
        <div class="type-box" @click="checkClassify(classifyData.basic)">
          <div class="bar">
            <i v-for="(ite, ind) in classifyData.basic.load" :key="ind">
              <!-- <img :src="require('../../assets/images/load/'+ite.name+'.png')" alt="" srcset="" onerror="defaultImg()"> -->
              <img src="../../assets/images/load/sub_04.png" alt="" srcset="" />
            </i>
          </div>
          <p>{{ classifyData.basic.name }}</p>
        </div>
      </div>
    </div>
    <!-- 内网定位工具 -->
    <div class="GJ intranet">
      <div class="box-scroll">
        <!-- <div class="type-box">
          <div class="bar add" @click="addVisible = true"></div>
          <p>新增</p>
        </div> -->
        <div
          class="type-box"
          v-for="(item, index) in classifyData.intranet"
          :key="index"
        >
          <div class="bar scroll-none" @click="checkClassify(item)">
            <i v-for="(ite, ind) in item.load" :key="ind">
              <!-- <img :src="require('../../assets/images/load/'+ite.name+'.png')" alt="" srcset="" onerror="defaultImg()"> -->
              <img src="../../assets/images/load/sub_04.png" alt="" srcset="" />
            </i>
          </div>
          <p>{{ item.name }}</p>
        </div>
      </div>
    </div>
    <!-- ZCGJ工具 -->
    <div class="GJ custom">
      <div class="head">
        <span>ZCGJ工具</span>
        <!-- <el-pagination
          layout="prev, pager, next"
          :total="zcgj.total"
          prev-text="上一页"
          next-text="下一页"
          :page-size="15"
          :current-page="zcgj.currentPage"
          @current-change="currentChange"
        >
        </el-pagination> -->
      </div>
      <div class="box-scroll">
        <!-- <div class="type-box">
          <div class="bar add" @click="addVisible = true"></div>
          <p>新增</p>
        </div> -->
        <div
          class="type-box"
          v-for="(item, index) in classifyData.customize"
          :key="index"
        >
          <div class="bar scroll-none" @click="checkClassify(item)">
            <i v-for="(ite, ind) in item.load" :key="ind">
              <!-- <img :src="require('../../assets/images/load/'+ite.name+'.png')" alt="" srcset="" onerror="defaultImg()"> -->
              <img src="../../assets/images/load/sub_04.png" alt="" srcset="" />
            </i>
          </div>
          <p>{{ item.name }}</p>
        </div>
      </div>
    </div>
    <!-- 查看工具分类弹框 -->
    <Classify
      :dialogDatas="dialogData"
      :dialogVisible.sync="dialogVisible"
      @refreshLoad="refreshLoad"
    ></Classify>
    <!-- 新增分类弹框 -->
    <el-dialog
      :visible.sync="addVisible"
      width="300px"
      :show-close="false"
      class="addfirm"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="add-box">
        <p>请输入分类名称：</p>
        <input type="text" v-model="classifyName" />
        <div class="btns">
          <el-button @click="addVisible = false">取消</el-button>
          <el-button type="primary" @click="addClassify(classifyName, 'create')"
            >确认</el-button
          >
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import baseURL from '@/api/base'
import { load } from '@/api'
import { downloadByBlob } from '@/utils/download'
import Classify from './components/classify.vue'

const { getLoad, downloadConf, downloadResult, classifyHandle, delLoad } = load

export default {
  name: 'loadManage',
  components: {
    Classify: Classify
  },
  data() {
    return {
      zcgj: {
        total: 0,
        currentPage: 1
      },
      dialogVisible: false,
      addLoadVisible: false,
      baseURL: baseURL,
      loadData: {},
      classifyName: '',
      addVisible: false,
      dialogData: {},
      classifyData: {
        basic: [],
        intranet: [],
        customize: []
      },
      defaultClassify: {
        name: '基础工具',
        load: []
      },
      classifyList: [],
      pagingList: [],
      dis: true,
      delName: '',
      ws: null,
      form: {
        name: '',
        class: '',
        classify: '',
        filename: null
      },
      options: [
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
      delName: ''
    }
  },
  created() {
    this.getLoad()
  },
  mounted() {},
  methods: {
    // 刷新页面数据
    refreshLoad() {
      this.getLoad()
    },
    // 新增分类
    addClassify(name, type) {
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
      classifyHandle(params).then(res => {
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
    defaultImg() {
      console.log(234324)
    },
    getLoad() {
      // 获取载荷列表
      getLoad().then(res => {
        res = res.data
        if (res.code === 0) {
          this.classifyData = {
            basic: {
              name: 'basic',
              load: res.DataList.basic
            },
            intranet: {},
            customize: res.DataList.customize
          }
        }
        console.log(this.classifyData)
      })
    },
    // 查看工具分类
    checkClassify(val) {
      this.dialogData = JSON.parse(JSON.stringify(val))
      this.dialogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.load-manage {
  width: 100%;
  height: 100%;
  padding: 40px 0;
  box-sizing: border-box;
  display: flex;
  .GJ {
    height: 100%;
    border: 1px solid #3db9fd;
    padding-top: 40px;
    position: relative;
    .head {
      width: 100%;
      height: 40px;
      font-size: 18px;
      font-weight: bold;
      background-image: linear-gradient(#0671d7, #004384, #000);
      color: #fff;
      line-height: 35px;
      position: absolute;
      top: 0;
      left: 0;
    }
    .box-scroll {
      width: 100%;
      height: 100%;
      overflow-y: auto;
      display: flex;
      .type-box {
        width: 252px;
        height: 302px;
        margin: 35px;
        .bar {
          width: 252px;
          height: 302px;
          background: url('../../assets/images/bar_s.png') no-repeat;
          cursor: pointer;
          padding: 10px;
          overflow-y: auto;
          > i {
            width: 50px;
            height: 50px;
            float: left;
            margin: 13px;
            > img {
              width: 100%;
              height: 100%;
            }
          }
        }
        .add {
          background: url('../../assets/images/bar_add.png') no-repeat;
        }
        > p {
          color: #fff;
          margin: 5px 0;
        }
      }
    }
  }
  .basis {
    width: 350px;
    .box-scroll {
      flex-direction: column;
      align-items: center;
    }
    &::before {
      content: '基础工具';
    }
  }
  .intranet {
    flex: 1;
    margin-left: 40px;
    .box-scroll {
      flex-wrap: wrap;
    }
    &::before {
      content: '内网定位工具';
    }
  }
  .custom {
    flex: 1;
    margin-left: 40px;
    .box-scroll {
      flex-wrap: wrap;
    }
    // &::before {
    //   content: 'ZCGJ工具';
    // }
  }
  .addfirm {
    .add-box {
      height: 100%;
      color: #fff;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      > p {
        font-size: 18px;
        color: #fff;
        margin-bottom: 20px;
      }
      > input {
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
      .btns {
        > button {
          padding: 6px 12px;
        }
      }
    }
    /deep/ .el-dialog {
      height: 200px;
      background: #00101d url('../../assets/images/bar_s.png') no-repeat;
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
}
</style>
