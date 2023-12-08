<template>
  <div class="card-container app-container" :class="$route.meta.isTab?'app-container':''">
    <el-container>
      <el-header>
        <SearchArea :showAllSearch.sync="showAllSearch" class="p-16">
          <div class="flex">
            <div class="searchLeft">
              <el-row :gutter="14">
                <el-col :span="4">
                  <el-input size="mini" v-model="queryParams.asset_return_code" placeholder="归还单号" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input size="mini" v-model="queryParams.user_name" placeholder="使用人" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input size="mini" v-model="queryParams.user_org_name" placeholder="使用部门" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input size="mini" v-model="queryParams.applicant_name" placeholder="申请人" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input size="mini" v-model="queryParams.applicant_org_name" placeholder="申请部门" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input size="mini" v-model="queryParams.returnReason" placeholder="归还原因" clearable @keyup.enter.native="load" />
                </el-col>
              </el-row>
              <el-row :gutter="14" v-show="showAllSearch" class="mt-10">
                <el-col :span="4">
                  <base-input
                    size="mini"
                    :value.sync="queryParams.centralizedBusinessId"
                    baseCode="listType"
                    labelName="businessName"
                    valueName="businessId"
                    placeholder="业务归口类型"
                    @change="load"
                  ></base-input>
                </el-col>
                <el-col :span="4">
                  <base-input
                    size="mini"
                    :value.sync="queryParams.accepterOrgId"
                    baseCode="companyList"
                    resultLabel="data"
                    labelName="deptName"
                    valueName="deptId"
                    placeholder="使用公司"
                    @change="load"
                  ></base-input>
                </el-col>
                <el-col :span="4">
                  <base-input
                    size="mini"
                    :value.sync="queryParams.companyId"
                    baseCode="companyList"
                    resultLabel="data"
                    labelName="deptName"
                    valueName="deptId"
                    placeholder="申请公司"
                    @change="load"
                  ></base-input>
                </el-col>
                <el-col :span="4">
                  <base-input size="mini" :value.sync="queryParams.projectId" baseCode="listProject" labelName="projectName" valueName="projectId" placeholder="项目名称" @change="load"></base-input>
                </el-col>
                <el-col :span="4">
                  <base-input size="mini" :value.sync="queryParams.schemeId" baseCode="listScheme" labelName="schemeName" valueName="schemeId" placeholder="方案名称" @change="load"></base-input>
                </el-col>
                <el-col :span="4">
                  <base-input size="mini" :value.sync="queryParams.sourceTerminal" baseCode="System-sourceTerminal" placeholder="使用终端" @change="load"></base-input>
                </el-col>
              </el-row>
            </div>
            <div class="ml-10 searchRight">
              <el-button type="primary" icon="el-icon-search" size="mini" @click="load">搜索</el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="reset">重置</el-button>
              <MoreQuery :filterOptions="filterOptions" :formData.sync="queryParams" @reload="load" />
            </div>
          </div>
        </SearchArea>
      </el-header>
      <el-main style="padding:0;">
        <el-container>
          <el-header>
            <el-row class="mb-15">
              <el-col :span="12">
                <el-button type="primary" plain icon="el-icon-plus" size="mini" v-hasPermi="['srm:return:add']" @click="addOrUpdateHandle()">新增归还单</el-button>
                <el-button plain icon="el-icon-upload2" size="mini" v-hasPermi="['srm:return:export']" @click="handleExport">导出</el-button>
              </el-col>
              <el-col :span="12" class="text-right">
                <el-button plain icon="el-icon-refresh" size="mini" @click="reload">刷新</el-button>
                <TableHeaderConfig class="ml-10" :columns.sync="tableColumn" />
              </el-col>
            </el-row>
          </el-header>
          <el-main>
            <vxe-grid
              height="auto"
              v-loading="tableLoading"
              header-align="center"
              align="center"
              :data="tableData"
              :pager-config="tablePage"
              border
              :resizable="true"
              :columns="tableColumn"
              :row-config="{isHover:true,isCurrent:true}"
              class="vxeTable"
              show-footer
              auto-resize
              show-overflow="tooltip"
              :footer-method="getFooterData"
              @page-change="handlePageChange"
            >
              <template #seqHeader>序号</template>
              <template #assetReturnCode="{row}">
                <el-link type="primary" :underline="false" @click="detailHandle(row.assetReturnId)">{{ row.assetReturnCode }}</el-link>
              </template>
              <template #sourceTerminal="{row}">
                <dictDateView :value="row.sourceTerminal" :dictDataList="dictDataList" dictCode="System-sourceTerminal" />
              </template>
              <template #status="{row}">
                <dictDateView :value="row.status" :dictDataList="dictDataList" dictCode="AlmAssetReturn-status" />
              </template>
              <template v-slot:todo="{ row }">
                <div class="todo">
                  <el-button size="mini" type="text" @click="detailHandle(row.assetReturnId)">查看</el-button>
                  <el-button v-if="row.status == 0|| row.status == 3" size="mini" type="text" @click="addOrUpdateHandle(row.assetReturnId)" v-hasPermi="['asset:return:edit']">修改</el-button>
                  <el-button
                    size="mini"
                    type="text"
                    @click="audit(row,'audit_superior')"
                    v-hasPermi="['asset:return:audit']"
                    v-if="row.status == 2  && (row.assetReviewAuditVO&&row.assetReviewAuditVO.processId=='DIRECT_SUPERIOR_APPROVAL')"
                  >审批</el-button>
                  <el-button
                    size="mini"
                    type="text"
                    @click="audit(row,'recall_add')"
                    v-hasPermi="['asset:return:recall']"
                    v-if="row.status == 2  && (row.assetReviewAuditVO&&row.assetReviewAuditVO.processId=='DIRECT_SUPERIOR_APPROVAL') && row.applicantId == $store.state.user.info.userId"
                  >撤回</el-button>

                  <el-button
                    size="mini"
                    type="text"
                    @click="audit(row,'register_asset_admin')"
                    v-hasPermi="['asset:return:register']"
                    v-if="row.status == 2  && (row.assetReviewAuditVO&&row.assetReviewAuditVO.processId=='ASSET_ADMINISTRATOR_REGISTRATION')"
                  >登记</el-button>
                  <el-button
                    size="mini"
                    type="text"
                    @click="audit(row,'recall_superior')"
                    v-hasPermi="['asset:return:recall']"
                    v-if="row.status == 2  && (row.assetReviewAuditVO&&row.assetReviewAuditVO.processId=='ASSET_ADMINISTRATOR_REGISTRATION'&& row.assetReviewAuditVO.preProcessorId == $store.state.user.info.userId)"
                  >撤回</el-button>
                  <el-button
                    size="mini"
                    type="text"
                    @click="audit(row,'invalid_add')"
                    v-hasPermi="['asset:return:invalid']"
                    v-if="row.status == 2  && (row.assetReviewAuditVO&&row.assetReviewAuditVO.processId=='DIRECT_SUPERIOR_APPROVAL')"
                  >作废</el-button>
                  <el-button size="mini" type="text" @click="handleDelete(row)" v-hasPermi="['asset:return:remove']" v-if="row.status == 0 || row.status == 3 || row.status == 4">删除</el-button>
                </div>
              </template>
            </vxe-grid>
          </el-main>
        </el-container>
      </el-main>

      <!-- <Print ref="printRef" v-if="printVisible"></Print> -->
    </el-container>
  </div>
</template>
<script>
import { listReturn, delReturn } from '@/api/return.js'
import vxeTable from '@/mixins/vxeTable'
import { listDictItems } from '@/api/base.js'
export default {
  mixins: [vxeTable],
  data() {
    return {
      printVisible: false,

      showAllSearch: false,
      form: {},
      queryParams: {},
      currentParams: {},
      dictDataList: [],
      tableColumn: [
        { type: 'seq', width: 70, align: 'center', fixed: 'left', slots: { header: 'seqHeader' } },
        { visible: true, field: 'assetReturnCode', title: '归还单号', fixed: 'left', width: 160, visibleDisabled: true, slots: { default: 'assetReturnCode' } },
        { visible: true, field: 'returnDate', title: '归还日期', fixed: 'left', width: 130, visibleDisabled: true },
        { visible: true, field: 'centralizedBusinessName', title: '业务类型', fixed: 'left', width: 130, visibleDisabled: true },
        { visible: true, field: 'applicantName', title: '申请人', width: 130 },
        { visible: true, field: 'applicantOrgName', title: '申请部门', width: 130 },
        { visible: true, field: 'applicantCompanyName', title: '申请公司', width: 170, headerAlign: 'center', align: 'left' },
        { visible: true, field: 'assetQuantity', title: '资产数量', width: 130, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { visible: true, field: 'assetAmount', title: '资产含税金额（元）', width: 150, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { visible: true, field: 'userName', title: '使用人', width: 130 },
        { visible: true, field: 'userOrgName', title: '使用部门', width: 130 },
        { visible: true, field: 'returnReason', title: '归还原因', width: 270, headerAlign: 'center', align: 'left' },
        { visible: true, field: 'projectCode', title: '项目编号', width: 130 },
        { visible: true, field: 'projectName', title: '项目名称', width: 130, headerAlign: 'center', align: 'left' },
        { visible: true, field: 'schemeCode', title: '方案编号', width: 130 },
        { visible: true, field: 'schemeName', title: '方案名称', width: 130, headerAlign: 'center', align: 'left' },
        { visible: true, field: 'sourceTerminal', title: '使用终端', width: 130, slots: { default: 'sourceTerminal' } },
        { visible: true, field: 'createDate', title: '创建时间', width: 180 },
        { visible: true, field: 'updateDate', title: '更新时间', width: 180 },
        { visible: true, field: 'status', title: '状态', width: 130, slots: { default: 'status' } },
        { visible: true, field: 'todo', title: '操作', width: 200, fixed: 'right', slots: { default: 'todo' } }
      ]
    }
  },
  computed: {
    filterOptions() {
      return [
        { label: '归还日期期间：', type: 'daterange', placeholder: '请选择归还日期期间', valueStart: 'returnDateStart', valueEnd: 'returnDateEnd' },
        { label: '创建日期期间：', type: 'daterange', placeholder: '请选择创建日期期间', valueStart: 'createDateStart', valueEnd: 'createDateEnd' },
        { label: '更新日期期间：', type: 'daterange', placeholder: '请选择更新日期期间', valueStart: 'updateDateStart', valueEnd: 'updateDateEnd' },
        { label: '状态：', type: 'baseInput', baseCode: 'AlmAssetReturn-status', options: this.dictDataList, placeholder: '请选择状态', value: 'status' }
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
        ...{
          pageNum: this.tablePage.currentPage,
          pageSize: this.tablePage.pageSize
        }
      }
    },
    reload() {
      this.tableLoading = true
      listReturn(this.currentParams)
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
    handlePageChange({ currentPage, pageSize }) {
      this.tablePage.currentPage = currentPage
      this.tablePage.pageSize = pageSize
      // 触发列表请求
      this.load()
    },
    // 新增  修改
    addOrUpdateHandle(id) {
      this.$router.push({
        name: id ? 'return-returnUpdate' : 'return-returnAdd',
        query: {
          id: id
        }
      })
    },
    // 审批  登记  撤回   作废
    audit(row, todo) {
      this.$router.push({
        name: 'return-returnUpdate',
        query: {
          id: row.assetReturnId,
          todo: todo
        }
      })
    },
    // 查看详情
    detailHandle(id) {
      this.$router.push({
        name: 'return-returnDetail',
        query: {
          id: id
        }
      })
    },
    handleDelete(row) {
      this.$confirm('是否确认删除资产归还单信息编号为"' + row.assetReturnCode + '"的数据项？', '删除').then(() => {
        delReturn(row.assetReturnId).then(() => {
          this.reload()
          this.$message.success('删除成功')
        })
      })
    },
    // 打印
    printHandle(id) {
      this.printVisible = true
      this.$nextTick(() => {
        this.$refs.printRef.init(id)
      })
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        '/asset/return/export',
        {
          ...this.currentParams
        },
        `return_${new Date().getTime()}.xlsx`
      )
    },
    // 表尾合计
    getFooterData({ columns, data }) {
      return this.footerMethod(columns, data, '', ['assetQuantity', 'assetAmount'])
    },
    // 获取字典数据
    getDictData() {
      let dictCodes = 'System-sourceTerminal' //来源终端
      dictCodes += ',AlmAssetReturn-status' //归还状态
      listDictItems(dictCodes).then((res) => {
        this.dictDataList = res.sysDictionaryItemsList
      })
    }
  }
}
</script>
<style lang="scss" scoped src="@/styles/vxeTable.scss"></style>