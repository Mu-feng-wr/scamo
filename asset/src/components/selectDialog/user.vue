<template>
  <vxe-modal v-model="dialogVisible" :title="title" width="80%" height="90%" esc-closable resize @hide="close">
    <el-container>
      <el-aside width="180" class="aside">
        <div class="treeBox">
          <div class="p-10">
            <el-input v-model="deptName" placeholder="请输入部门名称" size="small" clearable @change="changeInput" />
          </div>

          <el-tree
            ref="tree"
            v-loading="treeLoading"
            class="tree"
            :data="deptTreeList"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            default-expand-all
            highlight-current
            @node-click="handleNodeClick"
          />
        </div>
      </el-aside>
      <el-main>
        <div class="pl-10 pt-10 pr-10" style="height:100%">
          <el-container>
            <el-header class="mb-10">
              <el-row :gutter="14">
                <el-col :span="4">
                  <el-input v-model="queryParams.no" size="mini" placeholder="用户编号" clearable />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.loginName" size="mini" placeholder="登录账号" clearable />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.userName" size="mini" placeholder="用户姓名" clearable />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.parentUserNo" size="mini" placeholder="直接上级编号" clearable />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.parentUserName" size="mini" placeholder="直接上级名称" clearable />
                </el-col>
                <el-col :span="4">
                  <el-button type="primary" icon="el-icon-search" size="mini" @click="load">搜索</el-button>
                  <el-button icon="el-icon-refresh" size="mini" @click="reset">重置</el-button>
                </el-col>
              </el-row>
            </el-header>
            <el-main>
              <vxe-grid
                ref="xTable"
                height="auto"
                :loading="tableLoading"
                header-align="center"
                align="center"
                :data="tableData"
                :pager-config="tablePage"
                border
                :resizable="true"
                :columns="tableColumn"
                :row-config="{isHover:true,isCurrent:true}"
                class="vxeTable"
                auto-resize
                show-overflow="tooltip"
                @page-change="handlePageChange"
                @cell-click="cellClick"
              >
                <template #seqHeader>序号</template>
                <template #sex="{row}">
                  <dictDateView :value="row.sex" :dict-data-list="dictDataList" dict-code="SysUser-sex" />
                </template>
                <template #status="{row}">
                  <dictDateView :value="row.status" :dict-data-list="dictDataList" dict-code="System-status" />
                </template>
              </vxe-grid>
            </el-main>
            <el-footer style="height:35px;">
              <div class="text-right">
                <el-button icon="el-icon-circle-check" type="primary" size="small" @click="confirm">确认</el-button>
                <el-button icon="el-icon-circle-close" size="small" @click="close">关闭</el-button>
              </div>
            </el-footer>
          </el-container>
        </div>
      </el-main>
    </el-container>
  </vxe-modal>
</template>
<script>
import vxeTable from '@/mixins/vxeTable'
import { deptTreeSelect, listUser } from '@/api/base.js'
import { listDictItems } from '@/api/base.js'
export default {
  name: 'SelectUser',
  mixins: [vxeTable],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '选择用户'
    },
    selectType: {
      type: String,
      default: 'radio' // radio单选   checkbox多选
    }
  },
  data() {
    return {
      dialogVisible: false,
      treeLoading: false,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      deptTreeList: [],
      deptId: '',
      deptName: '',
      queryParams: {},
      dictDataList: [],
      tableColumn: [
        { type: this.selectType, width: 50, align: 'center', fixed: 'left' },
        { type: 'seq', width: 50, align: 'center', fixed: 'left', slots: { header: 'seqHeader' } },
        { field: 'no', title: '用户编号', width: 130, fixed: 'left' },
        { field: 'userName', title: '用户姓名', width: 130, fixed: 'left' },
        { field: 'loginName', title: '登录账号', width: 130 },
        { field: 'phonenumber', title: '手机号码', width: 130 },
        { field: 'jobLevel', title: '职称名称', width: 180 },
        { field: 'roleName', title: '角色名称', width: 180, showOverflow: true },
        { field: 'parentUserNo', title: '直接上级编号', width: 130 },
        { field: 'parentUserName', title: '直接上级名称', width: 130 },
        { field: 'deptName', title: '部门名称', width: 130 },
        { field: 'email', title: '邮箱地址', width: 200 },
        { field: 'companyName', title: '所属公司', width: 150 },
        { field: 'workDate', title: '入职时间', width: 150 },
        { field: 'sex', title: '性别', width: 90, slots: { default: 'sex' } },
        { field: 'remark', title: '备注', width: 120 },
        { field: 'updateTime', title: '最后更新时间', width: 200 },
        { field: 'status', title: '状态', width: 90, slots: { default: 'status' } }
      ]
    }
  },
  created() {
    this.dialogVisible = this.visible
    this.getDictData()
    this.getDeptTree()
    this.load()
  },
  methods: {
    load() {
      this.getQuery()
      this.reload()
    },
    getQuery() {
      this.queryParams = {
        ...this.queryParams,
        ...{
          deptId: this.deptId,
          pageNum: this.tablePage.currentPage,
          pageSize: this.tablePage.pageSize
        }
      }
    },
    reload() {
      this.tableLoading = true
      listUser(this.queryParams)
        .then((res) => {
          this.tableData = res.rows
          this.tablePage.total = res.total
        })
        .finally(() => {
          this.tableLoading = false
        })
    },
    handlePageChange({ currentPage, pageSize }) {
      this.tablePage.currentPage = currentPage
      this.tablePage.pageSize = pageSize
      // 触发列表请求
      this.load()
    },
    reset() {
      this.queryParams = {}
      this.load()
    },
    getDeptTree() {
      this.treeLoading = true
      deptTreeSelect()
        .then((res) => {
          this.deptTreeList = res.data
        })
        .finally(() => {
          this.treeLoading = false
        })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    changeInput(val) {
      this.$refs.tree.filter(val)
    },
    getDictData() {
      let dictCodes = 'SysUser-sex' // 性别
      dictCodes += ',System-status' // 状态
      listDictItems(dictCodes).then((res) => {
        this.dictDataList = res.sysDictionaryItemsList
      })
    },
    handleNodeClick(data) {
      this.deptId = data.id
      this.load()
    },
    confirm() {
      let data = ''
      if (this.selectType == 'radio') {
        data = this.$refs.xTable.getRadioRecord()
        if (!data) {
          this.$modal.msgWarning('请选择数据')
          return
        }
      } else if (this.selectType == 'checkbox') {
        data = this.$refs.xTable.getCheckboxRecords()
        if (!data) {
          this.$modal.msgWarning('至少选择一条数据')
          return
        }
      }
      this.$emit('confirm', data)
      this.close()
    },
    close() {
      this.$emit('update:visible', false)
    },
    cellClick({ row }) {
      if (this.selectType == 'radio') {
        this.$refs.xTable.setRadioRow(row, true)
      } else if (this.selectType == 'checkbox') {
        this.$refs.xTable.setCheckboxRow(row, true)
      }
    }
  }
}
</script>
<style lang="scss" scoped src="@/styles/vxeTable.scss"></style>

<style lang="scss" scoped>
.aside {
  background: #fff;
  padding: 0;
}
.tree {
  height: calc(100% - 56px);
  overflow: auto;
}
.form-table .section-card__body .el-row:first-child {
  border: none;
}
::v-deep .vxe-modal--header {
  background: #fff;
  border-bottom: 0px;
}
::v-deep .vxe-modal--title {
  font-weight: 500;
  font-size: 1.2em;
}
</style>
