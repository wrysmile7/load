<template>
  <div class="table-box">
    <div class="top">
      <el-table :data="tableData" border style="width: 100%" max-height="680px" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="80"></el-table-column>
        <el-table-column :prop="item" :label="item" v-for="(item,index) in tableConfig" :key="index"></el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)" class="del-btns"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="bottom">
      <el-pagination layout="prev, pager, next" :total="total" prev-text="上一页" next-text="下一页" :page-size="15" :current-page="currentPage" @current-change="currentChange">
      </el-pagination>
    </div>
    <!-- 确认删除弹框 -->
    <el-dialog :visible.sync="firmVisible" width="300px" :show-close="false" class="delfirm" :close-on-click-modal="false"  :close-on-press-escape="false">
      <div class="del-box">
        <p>确认要删除吗？</p>
        <div class="btns">
          <el-button @click="firmVisible=false">取消</el-button>
          <el-button type="danger" @click="delSubmit()">确认</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { load } from '@/api'
const {delList} = load
export default {
  name: 'Table',
  props:['tableDatas', 'tableConfigs', 'totals', 'tablename', 'IDStr'],
  data() {
    return {
      currentPage: 1,
      total: 0,
      tableConfig: [],
      tableData: [],
      firmVisible: false,
      id: null,
      ip: null,
      tablenames: true,
      submitData: {}
    }
  },
  watch: {
    tableDatas: {
      handler(val){
        this.tableData = JSON.parse(JSON.stringify(val))
      },
      deep: true,
      immediate: true
    },
    tableConfigs: {
      handler(val){
        this.tableConfig = JSON.parse(JSON.stringify(val))
      },
      deep: true,
      immediate: true
    },
    totals: {
      handler(val){
        this.total = val
      },
      deep: true,
      immediate: true
    },
    tablename: {
      handler(val){
        this.tablenames = val
      },
      immediate: true
    }
  },
  methods: {
    // 逐条删除
    handleDelete(index,row){
      this.submitData['table'] = this.tablenames?'0':'1'
      if (this.tablenames) {
        this.submitData['type'] = 'id'
        this.submitData['id'] = row.ID
      } else {
        this.submitData['type'] = 'ip'
        this.submitData['ip'] = row['主机IP']
      }
      this.firmVisible = true
      // console.log(index,row)
    },
    // 确认删除
    delSubmit(){
      if (this.tablenames) {
        this.$emit('delRcords',this.submitData)
      } else {
        this.$emit('delIPPost',this.submitData)
      }
      this.firmVisible = false
    },
    // 当前页切换
    currentChange(i){
      this.currentPage = i
      this.$emit('currentChange', i)
    },
    // 多选
    handleSelectionChange(rows){
      console.log(rows)
      let arr = []
      if (this.tablenames) {
        rows.map(val=>{
          arr.push(val.ID)
        })
      } else {
        rows.map(val=>{
          arr.push(val['主机IP'])
        })
      }
      console.log(arr.join(','))
      this.$emit('update:IDStr',arr.join(','))
    }
  }
}
</script>
<style lang="scss" scoped>
.table-box {
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 15px;
  padding-bottom: 50px;
  .top {
    width: 100%;
    flex: 1;
    /deep/ .el-table{
      background: transparent;
      color: #fff;
      border-color: #3db9fd;
      font-size: 16px;

    }
    /deep/ .el-table tr{
      background: transparent;
    }
    /deep/ .el-table th{
      font-size: 18px;
    }
    /deep/ .el-table td, /deep/ .el-table th{
      height: 40px;
      padding: 0;
      background: transparent;
      text-align: center;
      color: #fff;
      border-color: #3db9fd;
    }
    /deep/ .el-table::before, /deep/ .el-table--border::after{
      height: 0;
    }
    .del-btns{
      width: 22px;
      height: 22px;
      background: url('../../../assets/images/icon_del_3.png') no-repeat;
      border: none;
      padding: 0;
      opacity: .9;
      &:hover{
        opacity: 1;
      }
    }
  }
  .bottom {
    width: 100%;
    height: 34px;
    margin-top: 15px;
    /deep/ .el-pagination button, /deep/ .el-pager li{
      background: transparent;
      color: #3db9fc;
      font-size: 16px;
    }
    /deep/ .el-pager li.active{
      color: #00c9ce;
      font-size: 18px;
      font-weight: bold;
      text-decoration: underline;
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
      background: #00101D url('../../../assets/images/bar_s.png') no-repeat;
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
