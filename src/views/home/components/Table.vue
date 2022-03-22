<template>
  <div class="table-box">
    <div class="top">
      <el-table
        :data="tableData"
        border
        style="width: 100%"
        max-height="680px"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column
          v-for="item in tableConfig"
          :prop="item"
          :label="translate(item)"
          :key="item"
        >
        </el-table-column>
        <!-- v-show="!['ID'].includes(item)" -->
        <el-table-column
          label="操作"
          :width="tablename === 'device' ? 260 : 120"
        >
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="checkLoad(scope.$index, scope.row)"
              v-if="tablename === 'device'"
              >查看工具</el-button
            >
            <el-button
              type="success"
              size="mini"
              @click="edit(scope.$index, scope.row)"
              v-if="tablename === 'device'"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="mini"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="bottom">
      <el-pagination
        layout="prev, pager, next"
        :total="total"
        prev-text="上一页"
        next-text="下一页"
        :page-size="15"
        :current-page="currentPage"
        @current-change="currentChange"
      >
      </el-pagination>
    </div>
    <!-- 确认删除弹框 -->
    <el-dialog
      :visible.sync="firmVisible"
      width="300px"
      :show-close="false"
      class="delfirm"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="del-box">
        <p>确认要删除吗？</p>
        <div class="btns">
          <el-button @click="firmVisible = false">取消</el-button>
          <el-button type="danger" @click="delSubmit()">确认</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 编辑弹框 -->
    <EditDevices
      :addVisible.sync="editVisible"
      :editData="editData"
    ></EditDevices>
    <!-- 查看工具弹框 -->
    <LoadDialog
      :loadVisible.sync="loadVisible"
      :deviceData="deviceData"
    ></LoadDialog>
  </div>
</template>
<script>
import EditDevices from './addDevices.vue'
import LoadDialog from './loadDialog.vue'
import { load } from '@/api'
const { delList } = load
export default {
  name: 'Table',
  props: ['tableDatas', 'tableConfigs', 'totals', 'tablename', 'IDStr'],
  components: {
    EditDevices,
    LoadDialog
  },
  data() {
    return {
      loadVisible: false,
      editVisible: false,
      currentPage: 1,
      total: 0,
      tableConfig: [],
      tableData: [],
      firmVisible: false,
      id: null,
      ip: null,
      tablenames: true,
      submitData: {},
      translateConfig: {
        device_name: '设备名称',
        device_info: '设备信息'
      },
      editData: {},
      deviceData: {}
    }
  },
  watch: {
    tableDatas: {
      handler(val) {
        this.tableData = JSON.parse(JSON.stringify(val))
      },
      deep: true,
      immediate: true
    },
    tableConfigs: {
      handler(val) {
        this.tableConfig = JSON.parse(JSON.stringify(val)).filter(
          v => !['ID', 'id'].includes(v)
        )
      },
      deep: true,
      immediate: true
    },
    totals: {
      handler(val) {
        this.total = val
      },
      deep: true,
      immediate: true
    },
    tablename: {
      handler(val) {
        this.tablenames = val
      },
      immediate: true
    }
  },
  methods: {
    // 查看工具
    checkLoad(index, row) {
      this.deviceData = row
      this.loadVisible = true
    },
    // 打开编辑弹框
    edit(index, row) {
      this.editData = row
      this.editVisible = true
    },
    // 翻译
    translate(val) {
      return this.translateConfig[val] ? this.translateConfig[val] : val
    },
    // 逐条删除
    handleDelete(index, row) {
      switch (this.tablenames) {
        case 'device':
          this.submitData['type'] = 'id'
          this.submitData['device_id'] = row.id
          break
        case 'result':
          this.submitData['type'] = 'id'
          this.submitData['id'] = row.ID
          break
        case 'port':
          this.submitData['type'] = 'ip'
          this.submitData['ip'] = row['主机IP']
          break

        default:
          break
      }
      this.firmVisible = true
      // console.log(index,row)
    },
    // 确认删除
    delSubmit() {
      switch (this.tablenames) {
        case 'device':
          this.$emit('delDevices', this.submitData)
          break
        case 'result':
          this.submitData['table'] = '0'
          this.$emit('delRcords', this.submitData)
          break
        case 'port':
          this.submitData['table'] = '1'
          this.$emit('delIPPost', this.submitData)
          break

        default:
          break
      }
      this.firmVisible = false
    },
    // 当前页切换
    currentChange(i) {
      this.currentPage = i
      this.$emit('currentChange', i)
    },
    // 多选
    handleSelectionChange(rows) {
      console.log(rows)
      let arr = []
      switch (this.tablenames) {
        case 'device':
          rows.map(val => {
            arr.push(val.id)
          })
          break
        case 'result':
          rows.map(val => {
            arr.push(val.ID)
          })
          break
        case 'port':
          rows.map(val => {
            arr.push(val['主机IP'])
          })
          break

        default:
          break
      }
      this.$emit('update:IDStr', arr.join(','))
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
    /deep/ .el-table {
      background: transparent;
      color: #fff;
      border-color: #3db9fd;
      font-size: 16px;
    }
    /deep/ .el-table tr {
      background: transparent;
    }
    /deep/ .el-table th {
      font-size: 18px;
    }
    /deep/ .el-table td,
    /deep/ .el-table th {
      height: 40px;
      padding: 0;
      background: transparent;
      text-align: center;
      color: #fff;
      border-color: #3db9fd;
    }
    /deep/ .el-table::before,
    /deep/ .el-table--border::after {
      height: 0;
    }
    .del-btns {
      width: 22px;
      height: 22px;
      background: url('../../../assets/images/icon_del_3.png') no-repeat;
      border: none;
      padding: 0;
      opacity: 0.9;
      &:hover {
        opacity: 1;
      }
    }
  }
  .bottom {
    width: 100%;
    height: 34px;
    margin-top: 15px;
    /deep/ .el-pagination button,
    /deep/ .el-pager li {
      background: transparent;
      color: #3db9fc;
      font-size: 16px;
    }
    /deep/ .el-pager li.active {
      color: #00c9ce;
      font-size: 18px;
      font-weight: bold;
      text-decoration: underline;
    }
  }
  .delfirm {
    .del-box {
      height: 100%;
      color: #fff;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      > p {
        font-size: 18px;
        color: #ff2828;
        margin-bottom: 30px;
      }
      .btns {
        > button {
          padding: 6px 12px;
        }
      }
    }
    /deep/ .el-dialog {
      height: 200px;
      background: #00101d url('../../../assets/images/bar_s.png') no-repeat;
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
