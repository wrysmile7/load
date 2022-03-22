<template>
  <div class="device-list">
    <Search
      :search.sync="search"
      :options="tableConfig"
      @searchLoad="searchLoad"
      :tablename="'device'"
      @delDevices="delDevices"
    ></Search>
    <Table
      :tableDatas="tableData"
      :tableConfigs="tableConfig"
      :totals="total"
      @currentChange="currentChange"
      :tablename="'device'"
      :IDStr.sync="IDStr"
      @delDevices="delDevices"
    ></Table>
  </div>
</template>
<script>
import Search from './components/Search'
import Table from './components/Table'
import { load } from '@/api'
import bus from '@/utils/bus'
const { getDeviceList, delDevices } = load
export default {
  name: 'deviceManage',
  components: {
    Search,
    Table
  },
  data() {
    return {
      search: {
        selectVal: '',
        inputVal: ''
      },
      currentPage: 1,
      total: 0,
      tableData: [],
      tableConfig: [],
      IDStr: ''
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    bus.$on('addSuccess', () => {
      this.getList()
    })
  },
  methods: {
    getList() {
      this.tableData = []
      let params = {
        page_num: this.currentPage,
        fields: this.search.selectVal,
        keyword: this.search.inputVal,
        code: '0'
      }
      getDeviceList(params).then(res => {
        res = res.data
        if (res.code === 0) {
          this.total = res.total
          this.tableData = res.DataList
          this.tableConfig = Object.keys(res.DataList[0])
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    // 搜索
    searchLoad(val) {
      this.search = val
      this.getList()
    },
    // 分页
    currentChange(i) {
      this.currentPage = i
      this.getList()
    },
    // 删除
    delDevices(data) {
      if (data.type === 'select') {
        console.log(this.IDStr)
        if (this.IDStr !== '') {
          data['device_id'] = this.IDStr
          this.dalFun(data)
        } else {
          this.$message({
            message: '请先选择列中需要删除的行',
            type: 'error'
          })
        }
      } else {
        this.dalFun(data)
      }
    },
    // 删除方法封装
    dalFun(data) {
      console.log(data)
      delDevices(data).then(res => {
        res = res.data
        if (res.code === 0) {
          this.getList()
          this.$message({
            message: res.msg,
            type: 'success'
          })
        } else {
          this.$message({
            message: '删除失败',
            type: 'error'
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.device-list {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
