<template>
  <div class="card-container app-container">
    <el-container>
      <el-aside class="aside">
        <div class="treeBox">
          <div class="p-10">
            <el-input v-model="deptName" prefix-icon="el-icon-search" placeholder="请输入分类名称" size="small" clearable @change="changeInput" />
          </div>
          <el-tree
            ref="tree"
            v-loading="treeLoading"
            class="tree"
            :data="deptOption"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            default-expand-all
            highlight-current
            @node-click="handleNodeClick"
          />
        </div>
      </el-aside>
      <el-main>
        <el-container class="pl-20">
          <el-header>
            <SearchArea :show-all-search.sync="showAllSearch" class="p-16">
              <div class="flex">
                <div class="searchLeft">
                  <el-row :gutter="14">
                    <el-col :span="4">
                      <el-input v-model="queryParams.no" size="small" placeholder="请输入用户编号" clearable @keyup.enter.native="load" />
                    </el-col>
                    <el-col :span="4">
                      <el-input v-model="queryParams.userName" size="small" placeholder="请输入登录账号" clearable @keyup.enter.native="load" />
                    </el-col>
                    <el-col :span="4">
                      <el-input v-model="queryParams.loginName" size="small" placeholder="请输入用户姓名" clearable @keyup.enter.native="load" />
                    </el-col>
                    <el-col :span="4">
                      <el-input v-model="queryParams.parentUserNo" size="small" placeholder="请输入直接上级编号" clearable @keyup.enter.native="load" />
                    </el-col>
                    <el-col :span="4">
                      <el-input v-model="queryParams.parentUserName" size="small" placeholder="请输入直接上级名称" clearable @keyup.enter.native="load" />
                    </el-col>
                    <el-col :span="4">
                      <el-input v-model="queryParams.deptName" size="small" placeholder="请输入部门名称" clearable @keyup.enter.native="load" />
                    </el-col>
                  </el-row>
                  <el-row v-if="showAllSearch" :gutter="14" class="mt-10">
                    <el-col :span="4">
                      <el-input v-model="queryParams.phonenumber" size="small" placeholder="请输入手机号码" clearable @keyup.enter.native="load" />
                    </el-col>
                    <el-col :span="4">
                      <el-input v-model="queryParams.email" size="small" placeholder="请输入邮箱地址" clearable @keyup.enter.native="load" />
                    </el-col>
                    <el-col :span="4">
                      <el-select v-model="queryParams.postIdList" size="small" multiple placeholder="请选择职级名称" clearable collapse-tags @keyup.enter.native="load">
                        <el-option v-for="item in postOptions" :key="item.postId" :label="item.postName" :value="item.postId" />
                      </el-select>
                    </el-col>
                    <el-col :span="4">
                      <base-input
                        :value.sync="queryParams.companyId"
                        size="small"
                        base-code="companyList"
                        placeholder="请选择所属公司"
                        result-label="data"
                        value-name="deptId"
                        label-name="deptName"
                        clearable
                        @change="load"
                      />
                    </el-col>
                    <el-col :span="4">
                      <base-input :value.sync="queryParams.sex" size="small" :options-list="dictDataList" base-code="SysUser-sex" placeholder="请选择性别" clearable @change="load" />
                    </el-col>
                  </el-row>
                </div>
                <div class="ml-10 searchRight">
                  <el-button type="primary" icon="el-icon-search" size="mini" @click="load">搜索</el-button>
                  <el-button icon="el-icon-refresh" size="mini" @click="reset">重置</el-button>
                  <MoreQuery :filter-options="filterOptions" :form-data.sync="moreQueryParams" @reload="load" />
                </div>
              </div>
            </SearchArea>
          </el-header>
          <el-main>
            <el-container>
              <el-header>
                <el-row class="mb-15">
                  <el-col :span="12">
                    <el-button v-hasPermi="['system:user:add']" size="mini" type="primary" plain icon="el-icon-plus" @click="addOrUpdateHandle()">新增</el-button>
                    <el-button v-hasPermi="['system:user:import']" size="mini" type="info" plain icon="el-icon-upload2" @click="handleImport">导入</el-button>
                    <el-button v-hasPermi="['system:user:export']" size="mini" plain icon="el-icon-upload2" @click="handleExport">导出</el-button>
                  </el-col>
                  <el-col :span="12" class="text-right">
                    <el-button plain icon="el-icon-refresh" size="mini" @click="reload">刷新</el-button>
                    <TableHeaderConfig class="ml-10" :columns.sync="tableColumn" />
                  </el-col>
                </el-row>
              </el-header>
              <el-main>
                <vxe-grid
                  ref="multipleTable"
                  v-loading="tableLoading"
                  highlight-current-row
                  height="auto"
                  style="min-height: 500px"
                  header-align="center"
                  align="center"
                  :data="tableData"
                  border
                  :resizable="true"
                  :columns="tableColumn"
                  :row-config="{ isHover: true, isCurrent: true }"
                  class="vxeTable"
                  auto-resize
                  show-overflow="tooltip"
                >
                  <template #seqHeader>序号</template>
                  <template #sex="{ row }">
                    <dictDateView :value="row.sex" :dict-data-list="dictDataList" dict-code="SysUser-sex" />
                  </template>
                  <template #status="{ row }">
                    <dictDateView :value="row.status" :dict-data-list="dictDataList" dict-code="System-status" />
                  </template>
                  <template #todo="{ row }">
                    <div class="todo">
                      <el-button v-hasPermi="['system:dept:query']" size="small" type="text" @click="handleDetail(row.deptId)">查看</el-button>
                      <el-button v-hasPermi="['system:dept:edit']" size="mini" type="text" @click="handleUpdate(row.deptId)">修改</el-button>
                      <el-button v-hasPermi="['system:dept:remove']" size="mini" type="text" @click="handleDelete(row)">删除</el-button>
                    </div>
                  </template>
                  <template #pager>
                    <el-pagination
                      background
                      :current-page="tablePage.currentPage"
                      :page-sizes="[10, 20, 30, 50]"
                      :page-size="tablePage.pageSize"
                      layout="total, sizes, prev, pager, next, jumper"
                      :total="tablePage.total"
                      @size-change="handlePageChange($event,'pageSize')"
                      @current-change="handlePageChange($event,'currentPage')"
                    />
                  </template>
                </vxe-grid>
              </el-main>
            </el-container>
          </el-main>
        </el-container>
      </el-main>
    </el-container>
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div slot="tip" class="el-upload__tip text-center">
          <div slot="tip" class="el-upload__tip">
            <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的用户数据
          </div>
          <span>仅允许导入xls、xlsx格式文件。</span>
          <el-link type="primary" :underline="false" style="font-size: 12px; vertical-align: baseline" @click="importTemplate">下载模板</el-link>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import vxeTable from '@/mixins/vxeTable'
import { deptTreeSelect, listDictItems, optionSelect } from '@/api/base.js'
import { listUser, delUser } from '@/api/user.js'
import { getToken } from '@/utils/auth'

export default {
  mixins: [vxeTable],
  data() {
    return {
      treeLoading: false,
      deptOption: [],
      deptName: '',
      showAllSearch: false,
      currentParams: {},
      queryParams: {},
      tableColumn: [
        { type: 'seq', width: 70, align: 'center', fixed: 'left', visible: true, visibleDisabled: true, slots: { header: 'seqHeader' } },
        { field: 'no', title: '用户编号', width: 140, fixed: 'left', visible: true, visibleDisabled: true },
        { field: 'loginName', title: '用户姓名', width: 180, fixed: 'left', visible: true, visibleDisabled: true },
        { field: 'userName', title: '登录账号', width: 120, visible: true },
        { field: 'phonenumber', title: '手机号码', width: 120, visible: true },
        { field: 'jobLevel', title: '职称名称', width: 200, visible: true },
        { field: 'roleName', title: '角色名称', width: 120, visible: true },
        { field: 'parentUserNo', title: '直接上级编号', width: 120, visible: true },
        { field: 'parentUserName', title: '直接上级名称', width: 120, visible: true },
        { field: 'deptName', title: '部门名称', width: 120, visible: true },
        { field: 'email', title: '邮箱地址', width: 120, visible: true },
        { field: 'companyName', title: '所属公司', width: 120, visible: true },
        { field: 'workDate', title: '入职时间', width: 180, visible: true },
        { field: 'sex', title: '性别', width: 80, visible: true, slots: { default: 'sex' } },
        { field: 'remark', title: '备注', width: 180, visible: true },
        { field: 'status', title: '状态', width: 160, visible: true, slots: { default: 'status' } },
        { field: 'updateDate', title: '更新时间', width: 160, visible: true },
        { field: 'todo', title: '操作', width: 180, align: 'center', fixed: 'right', slots: { default: 'todo' }, visible: true, visibleDisabled: true }
      ],
      postOptions: [],
      dictDataList: [],
      upload: {
        open: false,
        title: '',
        isUploading: false,
        updateSupport: 0,
        headers: { Authorization: 'Bearer ' + getToken() },
        url: process.env.VUE_APP_BASE_API + '/system/user/importData'
      },
      filterOptions: [
        { label: '入职日期：', type: 'daterange', valueStart: 'dateRangeWorkDateStart', valueEnd: 'dateRangeWorkDateEnd' },
        { label: '创建日期：', type: 'daterange', valueStart: 'dateRangeCreateDateStart', valueEnd: 'dateRangeCreateDateEnd' }
      ]
    }
  },
  created() {
    this.getDeptTree()
    this.getDictData()
    this.load()
  },
  methods: {
    load() {
      this.getQuery()
      this.reload()
    },
    getQuery() {
      this.currentParams = {
        ...this.queryParams,
        ...{
          pageNum: this.tablePage.currentPage,
          pageSize: this.tablePage.pageSize
        }
      }
    },
    reload() {
      this.tableLoading = true
      listUser(this.currentParams)
        .then((res) => {
          this.tableData = res.rows
          this.tablePage.total = res.total
        })
        .finally(() => {
          this.tableLoading = false
        })
    },
    reset() {
      this.queryParams = {}
      this.load()
    },
    handlePageChange(value, type) {
      if (type == 'currentPage') {
        this.tablePage.currentPage = value
      }
      if (type == 'pageSize') {
        this.tablePage.pageSize = value
      }
      // 触发列表请求
      this.load()
    },
    getDeptTree() {
      this.treeLoading = true
      deptTreeSelect()
        .then((response) => {
          this.deptOption = response.data
        })
        .finally(() => {
          this.treeLoading = false
        })
    },
    getDictData() {
      var dictCodes = 'System-status' // 系统-状态
      dictCodes += ',SysUser-sex' // 性别
      listDictItems(dictCodes).then((res) => {
        this.dictDataList = res.sysDictionaryItemsList
      })
      // 岗位列表
      optionSelect().then((res) => {
        this.postOptions = res.data
      })
    },
    handleNodeClick(data) {
      this.queryParams.deptId = data.id
      this.load()
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    changeInput(val) {
      this.$refs.tree.filter(val)
    },
    handleExport() {
      this.download(
        '/system/user/export',
        {
          ...this.queryParams
        },
        `user_${new Date().getTime()}.xlsx`
      )
    },
    handleDelete(row) {
      this.$confirm('是否确认删除用户编号：["' + row.no + '"]，用户姓名：["' + row.loginName + '"]的数据项？', '', { type: 'warning' }).then(() => {
        delUser(row.userId).then(() => {
          this.getList()
          this.$modal.msgSuccess('删除成功')
        })
      })
    },
    handleImport() {
      this.upload.title = '用户导入'
      this.upload.open = true
    },
    importTemplate() {
      this.download('system/user/importTemplate', {}, `user_template_${new Date().getTime()}.xlsx`)
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false
      this.upload.isUploading = false
      this.$refs.upload.clearFiles()
      this.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + '</div>', '导入结果', { dangerouslyUseHTMLString: true })
      this.getList()
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit()
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
</style>