<template>
  <div class="card-container app-container" :return-url="returnUrl">
    <el-container>
      <el-header>
        <SearchArea :show-all-search.sync="showAllSearch" class="p-16">
          <div class="flex">
            <div class="searchLeft">
              <el-row :gutter="14">
                <el-col :span="4">
                  <el-input v-model="queryParams.projectCode" size="small" placeholder="请输入项目编号" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.projectName" size="small" placeholder="请输入项目名称" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.abbreviation" size="small" placeholder="请输入项目简称" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.longitude" size="small" placeholder="请输入经度" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.latitude" size="small" placeholder="请输入纬度" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <base-input
                    size="small"
                    :value.sync="queryParams.invoiceType"
                    :options-list="dictDataList"
                    base-code="PmProject-taxCalculation"
                    placeholder="请选择计税方法"
                    clearable
                    @change="load"
                  />
                </el-col>
              </el-row>
              <el-row v-if="showAllSearch" :gutter="14" class="mt-10">
                <el-col :span="4">
                  <el-date-picker v-model="queryParams.completionTime" size="small" clearable type="date" value-format="yyyy-MM-dd" placeholder="请选择完工时间" @change="load" />
                </el-col>
                <el-col :span="4">
                  <el-date-picker v-model="queryParams.downTime" clearable size="small" type="date" value-format="yyyy-MM-dd" placeholder="请选择停工时间" @change="load" />
                </el-col>
                <el-col :span="4">
                  <el-date-picker v-model="queryParams.resumpteTime" clearable size="small" type="date" value-format="yyyy-MM-dd" placeholder="请选择复工时间" @change="load" />
                </el-col>
                <el-col :span="4">
                  <base-input
                    size="small"
                    :value.sync="queryParams.settingMethod"
                    :options-list="dictDataList"
                    base-code="PmProject-focusType"
                    placeholder="请选择重点类型"
                    clearable
                    @change="load"
                  />
                </el-col>
                <el-col :span="4">
                  <base-input
                    size="small"
                    :value.sync="queryParams.procurementMethod"
                    :options-list="dictDataList"
                    base-code="PmProject-isFocusProject"
                    placeholder="请选择是否重点项目"
                    clearable
                    @change="load"
                  />
                </el-col>
                <el-col :span="4">
                  <el-date-picker v-model="queryParams.agreedCompleteTime" clearable size="small" type="date" value-format="yyyy-MM-dd" placeholder="请选择约定完工时间" @change="load" />
                </el-col>
              </el-row>
            </div>
            <div class="ml-10 searchRight">
              <el-button type="primary" icon="el-icon-search" size="mini" @click="load">搜索</el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="reset">重置</el-button>
              <MoreQuery :filter-options="filterOptions" :form-data.sync="queryParams" @reload="load" />
            </div>
          </div>
        </SearchArea>
      </el-header>
      <el-main style="padding:0;">
        <el-container>
          <el-header>
            <el-row class="mb-15">
              <el-col :span="12">
                <el-button v-hasPermi="['datac:project:add']" type="primary" plain icon="el-icon-plus" size="mini" @click="addOrUpdateHandle()">新增</el-button>
                <el-button v-hasPermi="['datac:project:export']" plain icon="el-icon-upload2" size="mini" @click="handleExport">导出</el-button>
              </el-col>
              <el-col :span="12" class="text-right">
                <el-button plain icon="el-icon-refresh" size="mini" @click="reload">刷新</el-button>
                <TableHeaderConfig class="ml-10" :columns.sync="tableColumn" />
              </el-col>
            </el-row>
          </el-header>
          <el-main>
            <vxe-grid
              v-loading="tableLoading"
              height="auto"
              header-align="center"
              align="center"
              :data="tableData"
              border
              :resizable="true"
              :columns="tableColumn"
              :row-config="{isHover:true,isCurrent:true}"
              class="vxeTable"
              auto-resize
              show-overflow="tooltip"
            >
              <template #seqHeader>序号</template>
              <template #address="{ row }">{{ row.provinceName }}{{ row.cityName }}{{ row.districtName }}{{ row.address }}</template>
              <template #taxCalculation="{row}">
                <dictDateView :value="row.taxCalculation" :dict-data-list="dictDataList" dict-code="PmProject-taxCalculation" />
              </template>
              <template #focusType="{row}">
                <dictDateView :value="row.focusType" :dict-data-list="dictDataList" dict-code="PmProject-focusType" />
              </template>
              <template #isFocusProject="{row}">
                <dictDateView :value="row.isFocusProject" :dict-data-list="dictDataList" dict-code="PmProject-isFocusProject" />
              </template>
              <template #status="{row}">
                <dictDateView :value="row.status" :dict-data-list="dictDataList" dict-code="System-status" />
              </template>
              <template v-slot:todo="{ row }">
                <div class="todo">
                  <el-button v-hasPermi="['datac:project:list']" size="small" type="text" @click="handleDetail(row.projectId)">查看</el-button>
                  <el-button v-hasPermi="['datac:project:edit']" size="mini" type="text" @click="addOrUpdateHandle(row.projectId)">修改</el-button>
                  <el-button v-hasPermi="['datac:project:remove']" size="mini" type="text" @click="handleDelete(row)">删除</el-button>
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
  </div>
</template>

<script>
import vxeTable from '@/mixins/vxeTable'
import { listProject, delProject } from '@/api/project.js'
import { listDictItems } from '@/api/base.js'
export default {
  mixins: [vxeTable],
  data() {
    return {
      returnUrl: '/portface/project',
      showAllSearch: false,
      queryParams: {},
      dictDataList: [],
      tableColumn: [
        // { type: "checkbox", width: 50, align: "center", fixed: "left" },
        { type: 'seq', width: 70, align: 'center', fixed: 'left', visible: true, visibleDisabled: true, slots: { header: 'seqHeader' } },
        { field: 'projectCode', title: '项目编号', width: 150, fixed: 'left', visible: true, visibleDisabled: true },
        { field: 'projectName', title: '项目名称', width: 200, fixed: 'left', visible: true, visibleDisabled: true },
        { field: 'abbreviation', title: '项目简称', width: 180, visible: true, visibleDisabled: true },
        { field: 'provinceName', title: '项目地址', width: 250, visible: true, slots: { default: 'address' } },
        { field: 'longitude', title: '经度', width: 130, visible: true },
        { field: 'latitude', title: '纬度', width: 180, visible: true },
        { field: 'taxCalculation', title: '计税方法', width: 180, visible: true, slots: { default: 'taxCalculation' } },
        { field: 'focusType', title: '重点类型', width: 180, visible: true, slots: { default: 'focusType' } },
        { field: 'completionTime', title: '完工时间', width: 180, visible: true },
        { field: 'downTime', title: '停工时间', width: 180, visible: true },
        { field: 'resumpteTime', title: '复工时间', width: 180, visible: true },
        { field: 'isFocusProject', title: '是否重点项目', width: 180, visible: true, slots: { default: 'isFocusProject' } },
        { field: 'constructeContent', title: '工作内容', width: 150, visible: true },
        { field: 'projectScale', title: '项目规模', width: 150, visible: true },
        { field: 'innovateGoal', title: '创优目标', width: 150, visible: true },
        { field: 'agreedCompleteTime', title: '约定完工时间', width: 180, visible: true },
        { field: 'remarks', title: '备注', width: 180, visible: true },
        { field: 'updateDate', title: '更新时间', width: 180, visible: true },
        { field: 'status', title: '状态', width: 120, slots: { default: 'status' }, visible: true },
        { field: 'todo', title: '操作', width: 160, align: 'center', fixed: 'right', slots: { default: 'todo' }, visible: true, visibleDisabled: true }
      ]
    }
  },
  computed: {
    filterOptions() {
      return [
        { label: '地区：', type: 'area', placeholder: '请选择地区', value: 'area' },
        { label: '详细地址：', type: 'input', placeholder: '请填写详细地址', span: 12, value: 'address' }
      ]
    }
  },
  created() {
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
        ...{ pageNum: this.tablePage.currentPage, pageSize: this.tablePage.pageSize }
      }
    },
    reload() {
      this.tableLoading = true
      listProject(this.currentParams)
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
    // 新增||编辑
    addOrUpdateHandle(id) {
      if (id) {
        window.$wujie.props.route({
          path: '/portface/project',
          module: 'Portface',
          fullPath: '/portface/project/edit',
          title: '编辑项目',
          condition: { id }
        })
      } else {
        window.$wujie.props.route({
          path: '/portface/project',
          module: 'Portface',
          fullPath: '/portface/project/edit',
          title: '新增项目'
        })
      }
    },
    // 查看
    handleDetail(id) {
      window.$wujie.props.route({
        path: '/portface/project',
        module: 'Portface',
        fullPath: '/portface/project/detail',
        title: '项目详情',
        condition: { id }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm('是否确认删除项目编号为 "' + row.projectCode + '"，项目名称为 "' + row.projectName + '" 的数据项？', '', { type: 'warning' }).then(() => {
        delProject(row.projectId).then(() => {
          this.reload()
          this.$message.success('删除成功')
        })
      })
    },
    // 获取字典表
    getDictData() {
      var dictCodes = 'System-status' // 系统状态
      dictCodes += ',PmProject-taxCalculation' // 计税方法
      dictCodes += ',PmProject-isFocusProject' // 是否重点项目
      dictCodes += ',PmProject-focusType' // 重点类型
      listDictItems(dictCodes).then((res) => {
        this.dictDataList = res.sysDictionaryItemsList
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        'datac/consume/export',
        {
          ...this.queryParams
        },
        `consume_${new Date().getTime()}.xlsx`
      )
    }
  }
}
</script>
<style lang="scss" scoped src="@/styles/vxeTable.scss"></style>