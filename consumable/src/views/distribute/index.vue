<template>
  <div class="card-container app-container">
    <el-container>
      <el-header>
        <SearchArea :show-all-search.sync="showAllSearch" class="p-16">
          <div class="flex">
            <div class="searchLeft">
              <el-row :gutter="14">
                <el-col :span="4">
                  <el-input size="mini" v-model="queryParams.consumableDistributeCode" placeholder="派发单号" clearable />
                </el-col>
                <el-col :span="4">
                  <el-input size="mini" v-model="queryParams.user_name" placeholder="使用人" clearable />
                </el-col>
                <el-col :span="4">
                  <el-input size="mini" v-model="queryParams.user_org_name" placeholder="使用部门" clearable />
                </el-col>
                <el-col :span="4">
                  <el-input size="mini" v-model="queryParams.applicant_name" placeholder="申请人" clearable />
                </el-col>
                <el-col :span="4">
                  <el-input size="mini" v-model="queryParams.applicant_org_name" placeholder="申请部门" clearable />
                </el-col>
                <el-col :span="4">
                  <el-input size="mini" v-model="queryParams.distributeReason" placeholder="派发原因" clearable />
                </el-col>
              </el-row>
              <el-row :gutter="14" v-show="showAllSearch" class="mt-10">
                <el-col :span="4">
                  <base-input size="mini" :value.sync="queryParams.centralizedBusinessId" baseCode="listType" labelName="businessName" valueName="businessId" placeholder="业务归口类型"></base-input>
                </el-col>
                <el-col :span="4">
                  <base-input size="mini" :value.sync="queryParams.accepterOrgId" baseCode="companyList" resultLabel="data" labelName="deptName" valueName="deptId" placeholder="使用公司"></base-input>
                </el-col>
                <el-col :span="4">
                  <base-input size="mini" :value.sync="queryParams.companyId" baseCode="companyList" resultLabel="data" labelName="deptName" valueName="deptId" placeholder="申请公司"></base-input>
                </el-col>
                <el-col :span="4">
                  <base-input size="mini" :value.sync="queryParams.projectId" baseCode="listProject" labelName="projectName" valueName="projectId" placeholder="项目名称"></base-input>
                </el-col>
                <el-col :span="4">
                  <base-input size="mini" :value.sync="queryParams.schemeId" baseCode="listScheme" labelName="schemeName" valueName="schemeId" placeholder="方案名称"></base-input>
                </el-col>
                <el-col :span="4">
                  <base-input size="mini" :value.sync="queryParams.sourceTerminal" baseCode="System-sourceTerminal" placeholder="使用终端"></base-input>
                </el-col>
              </el-row>
              <el-row :gutter="14" v-show="showAllSearch" class="mt-10">
                <el-col :span="8">
                  <input-range
                    type="daterange"
                    size="mini"
                    :startValue.sync="queryParams.distributeDateStart"
                    :endValue.sync="queryParams.distributeDateEnd"
                    startPlaceholder="派发日期开始"
                    endPlaceholder="派发日期结束"
                    valueFormat="yyyy-MM-dd HH:mm:ss"
                    format="yyyy-MM-dd HH:mm:ss"
                    clearable
                  />
                </el-col>
              </el-row>
            </div>
            <div class="ml-10 searchRight">
              <el-button type="primary" icon="el-icon-search" size="mini" @click="load">搜索</el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="reset">重置</el-button>
              <MoreQuery :filterOptions="filterOptions" :formData.sync="moreQueryParams" @reload="load" />
            </div>
          </div>
        </SearchArea>
      </el-header>
      <el-main style="padding:0;">
        <el-container>
          <el-header>
            <el-row class="mb15">
              <el-col :span="12">
                <el-button type="primary" plain icon="el-icon-plus" size="mini" v-hasPermi="['srm:return:add']" @click="addOrUpdateHandle()">新增派发</el-button>
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
              border
              :resizable="true"
              :columns="tableColumn"
              :row-config="{isHover:true,isCurrent:true}"
              class="vxeTable"
              show-footer
              :footer-method="getFooterData"
            >
              <template #seqHeader>序号</template>
              <template #sourceTerminal="{row}">
                <dictDateView :value="row.sourceTerminal" :dictDataList="dictDataList" dictCode="System-sourceTerminal" />
              </template>
              <template v-slot:todo="{ row }">
                <div class="todo">
                  <el-button size="mini" type="text" @click="detailHandle(row.consumableDistributeId)">查看</el-button>
                  <el-button size="mini" type="text" @click="addOrUpdateHandle(row.consumableDistributeId)" v-hasPermi="['asset:receipt:edit']">修改</el-button>
                  <el-button size="mini" type="text" @click="handleDelete(row)" v-hasPermi="['asset:receipt:remove']">删除</el-button>
                </div>
              </template>
            </vxe-grid>
          </el-main>
        </el-container>
      </el-main>
    </el-container>
    <router-view></router-view>
  </div>
</template>
<script>
import { listDistribute, delDistribute } from '@/api/consume/distribute'
import vxeTable from '@/mixins/vxeTable'
import dictDateView from '@/components/DictDataView/index.vue'
import { listDictItems } from '@/api/system/dictionaries/items'
export default {
  components: {
    dictDateView
  },
  mixins: [vxeTable],
  data() {
    return {
      showAllSearch: false,
      form: {},
      queryParams: {},
      moreQueryParams: {},
      currentParams: {},
      dictDataList: [],
      tableColumn: [
        { type: 'seq', width: 70, align: 'center', fixed: 'left', slots: { header: 'seqHeader' } },
        { visible: true, field: 'consumableDistributeCode', title: '派发单号', fixed: 'left', width: 160, visibleDisabled: true },
        { visible: true, field: 'distributeDate', title: '派发日期', fixed: 'left', width: 130, visibleDisabled: true },
        { visible: true, field: 'centralizedBusinessName', title: '业务类型', fixed: 'left', width: 130, visibleDisabled: true },
        { visible: true, field: 'applicantName', title: '申请人', width: 130 },
        { visible: true, field: 'applicantOrgName', title: '申请部门', width: 130 },
        { visible: true, field: 'applicantCompanyName', title: '申请公司', width: 130 },
        { visible: true, field: 'distributeQuantity', title: '派发数量', width: 130, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { visible: true, field: 'distributeAmount', title: '派发金额（元）', width: 150, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { visible: true, field: 'istributerName', title: '派发人', width: 130 },
        { visible: true, field: 'istributerOrgName', title: '派发部门', width: 130 },
        { visible: true, field: 'istributeMethod', title: '派发方式', width: 130 },
        { visible: true, field: 'istributeType', title: '派发类型', width: 130 },
        { visible: true, field: 'courierNumber', title: '快递单号', width: 130 },
        { visible: true, field: 'courierCompany', title: '快递公司', width: 130 },
        { visible: true, field: 'recipientor', title: '接收人', width: 130 },
        { visible: true, field: 'recipientorMobile', title: '接收人手机号码', width: 130 },
        { visible: true, field: 'distributeReason', title: '派发原因', width: 130 },
        { visible: true, field: 'projectCode', title: '项目编号', width: 130 },
        { visible: true, field: 'projectName', title: '项目名称', width: 130 },
        { visible: true, field: 'schemeCode', title: '方案编号', width: 130 },
        { visible: true, field: 'schemeName', title: '方案名称', width: 130 },

        // { visible: true, field: 'sourceTerminal', title: '使用终端', width: 130, slots: { default: 'sourceTerminal' } },
        { visible: true, field: 'createBy', title: '创建人', width: 130 },
        { visible: true, field: 'createDate', title: '创建时间', width: 180 },
        { visible: true, field: 'createBy', title: '更新人', width: 130 },
        { visible: true, field: 'updateDate', title: '更新时间', width: 180 },
        { visible: true, field: 'status', title: '状态', width: 130 },
        { visible: true, field: 'todo', title: '操作', width: 160, fixed: 'right', slots: { default: 'todo' } }
      ],
      filterOptions: [
        { label: '使用人：', type: 'baseInput', baseCode: 'companyList', resultLabel: 'data', labelName: 'deptName', valueName: 'deptId', placeholder: '使用人', value: 'assetCompanyId' },
        { label: '使用部门：', type: 'baseInput', baseCode: 'companyList', resultLabel: 'data', labelName: 'deptName', valueName: 'deptId', placeholder: '使用部门', value: 'companyId' },
        { label: '业务类型：', type: 'baseInput', placeholder: '请输入业务类型', value: 'accepterMethod', options: this.dictDataList, baseCode: 'AlmAssetReceipt-accepterMethod' },
        { label: '申请人：', type: 'baseInput', baseCode: 'companyList', resultLabel: 'data', labelName: 'deptName', valueName: 'deptId', placeholder: '申请人', value: 'assetCompanyId' },
        { label: '申请部门：', type: 'baseInput', baseCode: 'companyList', resultLabel: 'data', labelName: 'deptName', valueName: 'deptId', placeholder: '申请部门', value: 'companyId' },
        { label: '申请公司：', type: 'baseInput', baseCode: 'companyList', resultLabel: 'data', labelName: 'deptName', valueName: 'deptId', placeholder: '申请公司', value: 'companyId' },
        { label: '项目名称：', type: 'baseInput', baseCode: 'listContract', labelName: 'contractName', valueName: 'contractId', value: 'contractId' },
        { label: '方案名称：', type: 'baseInput', baseCode: 'listContract', labelName: 'contractName', valueName: 'contractId', value: 'contractId' },
        { label: '使用终端：', type: 'baseInput', baseCode: 'System-sourceTerminal', value: 'sourceTerminal' },
        { label: '创建日期期间：', type: 'daterange', placeholder: '创建日期', valueStart: 'createDateStart', valueEnd: 'createDateEnd' },
        { label: '更新日期期间：', type: 'daterange', placeholder: '更新日期', valueStart: 'updateDateStart', valueEnd: 'updateDateEnd' },
        { label: '派发状态：', type: 'baseInput', baseCode: 'AlmAssetReceipt-status', options: this.dictDataList, value: 'status' }
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
        ...this.moreQueryParams,
        ...{
          pageNum: this.tablePage.currentPage,
          pageSize: this.tablePage.pageSize
        }
      }
    },
    reload() {
      this.tableLoading = true
      listDistribute(this.currentParams)
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
    addOrUpdateHandle(id) {
      this.$router.push({
        name: id ? 'consumableDistribute-distributeUpdate' : 'consumableDistribute-distributeAdd',
        query: {
          id: id
        }
      })
    },
    detailHandle(id) {
      this.$router.push({
        name: 'consumableDistribute-distributeDetail',
        query: {
          id: id
        }
      })
    },
    handleDelete(row) {
      this.$modal.confirm('是否确认删除资产派发单信息编号为"' + row.assetReturnCode + '"的数据项？').then(() => {
        delDistribute(row.consumableDistributeId).then(() => {
          this.reload()
          this.$modal.msgSuccess('删除成功')
        })
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
      return this.footerMethod(columns, data, '', ['distributeQuantity', 'distributeAmount'])
    },
    // 获取字典数据
    getDictData() {
      let dictCodes = 'System-sourceTerminal'
      listDictItems(dictCodes).then((res) => {
        this.dictDataList = res.sysDictionaryItemsList
      })
    }
  }
}
</script>
<style lang="scss" scoped src="@/styles/vxeTable.scss"></style>