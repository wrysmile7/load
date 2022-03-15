<template>
  <div class="search-box">
    <div class="left">
      <el-input placeholder="请输入关键字" v-model="form.inputVal" class="input-with-select">
        <el-select v-model="form.selectVal" slot="prepend" placeholder="请选择">
          <el-option :label="item" :value="item" v-for="item in optionList" :key="item"></el-option>
        </el-select>
        <el-button slot="append" class="search-btn" @click="searchSubmit(form)"></el-button>
      </el-input>
    </div>
    <div class="right">
      <el-button class="delbtns" @click="deleteList('all')">全表删除</el-button>
      <el-button class="delbtns" @click="deleteList('select')">批量删除</el-button>
      按日期删除：
      <el-select v-model="delTime" placeholder="请选择" clear="del-select">
        <el-option v-for="item in timeOption" :key="item" :label="item" :value="item"></el-option>
      </el-select>
      <el-button class="del-btn" @click="deleteList('date')" :disabled="delTime===''"></el-button>
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
export default {
  name: 'Search',
  props: ['search', 'options', 'tablename'],
  data() {
    return {
      form: {
        selectVal: '',
        inputVal: ''
      },
      optionList: ['IP','名称','地址'],
      delTime: '',
      timeOption: ['一天前','三天前','七天前','一个月前'],
      firmVisible: false,
      tablenames: true,
      submitData: {}
    }
  },
  watch: {
    search: {
      handler(val){
        this.form = JSON.parse(JSON.stringify(val))
      },
      deep: true,
      immediate: true
    },
    options: {
      handler(val){
        this.optionList = JSON.parse(JSON.stringify(val))
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
    // 搜索提交
    searchSubmit(form){
      console.log(form)
      this.$emit('searchLoad', form)
    },
    // 打开删除弹框
    deleteList(type){
      this.submitData = {}
      this.submitData['type'] = type
      this.submitData['table'] = this.tablenames?'0':'1'
      switch (type) {
        case 'date':
          this.submitData['date'] = this.delTime
          break

        default:
          break
      }
      this.firmVisible = true
    },
    // 确认删除
    delSubmit(){
      if (this.tablenames) {
        this.$emit('delRcords',this.submitData)
      } else {
        this.$emit('delIPPost',this.submitData)
      }
      this.firmVisible = false
    }
  }
}
</script>
<style lang="scss" scoped>
.search-box{
  width: 100%;
  height: 34px;
  color: #fff;
  display: flex;
  justify-content: space-between;
  .left{
    height: 100%;
    .el-select {
      width: 100px;
    }
    /deep/ .el-input__inner{
      max-width: 200px;
      height: 34px;
      background: transparent;
      border-color: #3db9fc;
      border-right: none;
      color: #3db9fc;
      &::-webkit-input-placeholder{
        color: #3db9fd;
      }
    }
    /deep/ .el-select .el-input__inner{
      border-left: none;
      border-right: none;
    }
    /deep/ .el-select__caret{
      color: #3db9fc;
    }
    /deep/ .el-input-group__append, /deep/ .el-input-group__prepend{
      height: 34px;
      background: transparent;
      border-color: #3db9fc;
      border-radius: 0;
    }
    /deep/ .el-input-group__append{
      width: 34px;
      height: 34px;
      padding: 0;
      border: none;
      background: url('../../../assets/images/button-search.png') no-repeat;
      position: relative;
      opacity: .9;
      &:hover{
        opacity: 1;
      }
    }
    .search-btn{
      width: 100%;
      height: 100%;
      padding: 0;
      margin: 0;
      position: absolute;
      top: 0;
      left: 0;
      border: none;
    }
  }
  .right{
    height: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    /deep/ .el-input__inner{
      width: 200px;
      height: 34px;
      background: transparent;
      border-color: #3db9fd;
      border-radius: 0;
      border-right: none;
      color: #3db9fc;
      &::-webkit-input-placeholder{
        color: #3db9fc;
      }
    }
    .delbtns{
      height: 34px;
      border-color: #3db9fd;
      background: transparent;
      color: #3db9fc;
      margin: 0 10px;
      opacity: .9;
      &:hover{
        opacity: 1;
      }
    }
    .del-btn{
      width: 34px;
      height: 34px;
      padding: 0 !important;
      border: none;
      border-radius: 0;
      background: url('../../../assets/images/button-delete.png') no-repeat;
      opacity: .9;
      &:hover{
        opacity: 1;
      }
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
