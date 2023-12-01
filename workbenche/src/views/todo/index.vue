<template>
  <div class="card-container app-container">
    <el-container>
      <el-header>
        <search-area :show-all-search.sync="showAllSearch" class="p-16">
          <div class="flex">
            <div class="searchLeft">
              <el-row :gutter="14">
                <el-col :span="4">
                  <el-input v-model="queryParams.assetCode" size="mini" placeholder="请输入标题" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.assetName" size="mini" placeholder="请输入发起人" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-date-picker v-model="queryParams.time" size="mini" type="date" placeholder="请选择送达时间" />
                </el-col>
              </el-row>
            </div>
            <div class="ml-10 searchRight">
              <el-button type="primary" icon="el-icon-search" size="mini" @click="load">搜索</el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="reset">重置</el-button>
              <!-- <MoreQuery :filterOptions="filterOptions" :formData.sync="queryParams" @reload="load" /> -->
            </div>
          </div>
        </search-area>
      </el-header>
      <el-main style="padding:0;">
        <el-container>
          <el-header>
            <el-row class="mb-15">
              <el-col :span="0">
                <!-- <el-button plain icon="el-icon-upload2" size="mini"  @click="handleExport">导出</el-button> -->
              </el-col>
              <el-col :span="24" class="text-right">
                <el-button plain icon="el-icon-refresh" size="mini" @click="reload">刷新</el-button>
                <table-header-config class="ml-10" :columns.sync="tableColumn" />
              </el-col>
            </el-row>
          </el-header>
          <el-main>
            <vxe-grid
              ref="xTable"
              v-loading="tableLoading"
              height="auto"
              header-align="center"
              align="center"
              :data="tableData"
              :pager-config="tablePage"
              border
              :resizable="true"
              :columns="tableColumn"
              :row-config=" {isHover : true, isCurrent : true}"
              class="vxeTable"
              show-overflow="title"
              @page-change="handlePageChange"
            >
              <template #seqHeader>序号</template>
              <template #status>待处理</template>
              <template #todo="{row}">
                <div class="todo">
                  <el-button type="text">查看</el-button>
                  <el-button
                    v-if="row.status == 2 && row.processId=='DIRECT_SUPERIOR_APPROVAL'"
                    v-hasPermi="getHasPermi(row,'audit')"
                    size="mini"
                    type="text"
                    @click="audit(row,'audit_superior')"
                  >审批</el-button>
                  <el-button
                    v-if="row.status == 2 && row.processId=='DIRECT_SUPERIOR_APPROVAL'&& row.initiatorId == $store.getters.userInfo.userId"
                    size="mini"
                    type="text"
                    @click="audit(row,'recall_add')"
                  >撤回</el-button>
                  <el-button v-if="row.status == 2 && row.processId=='ASSET_ADMINISTRATOR_REGISTRATION'" size="mini" type="text" @click="audit(row,'register_asset_admin')">登记</el-button>
                  <el-button
                    v-if="row.status == 2 && row.processId=='ASSET_ADMINISTRATOR_REGISTRATION'&&row.preProcessorId == $store.getters.userInfo.userId"
                    size="mini"
                    type="text"
                    @click="audit(row,'recall_superior')"
                  >撤回</el-button>
                </div>
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
import { getReviewListIsCompleted } from '@/api/todo.js'
export default {
  mixins: [vxeTable],
  data() {
    return {
      queryParams: {},
      currentParams: {},
      showAllSearch: false,
      tableColumn: [
        { type: 'seq', width: 60, align: 'center', fixed: 'left', visibleDisabled: true, slots: { header: 'seqHeader' } },
        { visible: true, field: 'processTitle', title: '标题', visibleDisabled: true, minWidth: 300, headerAlign: 'center', align: 'left' },
        { visible: true, field: 'deliveryDate', title: '送达时间', minWidth: 130 },
        { visible: true, field: 'initiatorName', title: '发起人', minWidth: 130 },
        { visible: true, field: 'initiatorOrgName', title: '所在部门', minWidth: 130 },
        { visible: true, field: 'initiateDate', title: '发起时间', minWidth: 130 },
        { visible: true, field: '', title: '等待时长(小时)', minWidth: 130 },
        { visible: true, field: '', title: '当前节点', minWidth: 130 },
        { visible: true, field: 'status', title: '状态', minWidth: 130, slots: { default: 'status' } },
        { field: 'todo', title: '操作', width: 160, slots: { default: 'todo' }, fixed: 'right' }
      ]
    }
  },
  created() {
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
          isCompleted: 0,
          pageNum: this.tablePage.currentPage,
          pageSize: this.tablePage.pageSize
        }
      }
    },
    reload() {
      this.tableLoading = true
      getReviewListIsCompleted(this.currentParams)
        .then((res) => {
          this.tableData = res.data
          this.tablePage.total = Number(res.total)
        })
        .finally(() => {
          this.tableLoading = false
        })
    },
    reset() {
      this.queryParams = {}
      this.load()
    },
    // 审批  登记
    audit(row, todo) {
      if (row.bussinessCode == 'PO_PURCHASE_APPLICATION') {
        // 申购单
        this.$router.push({
          name: 'application-applicationUpdate',
          query: {
            id: row.bussinessId,
            todo: todo
          }
        })
      } else if (row.bussinessCode == 'ALM_ASSET_RECEIPT') {
        // 入库单
        this.$router.push({
          name: 'receipt-receiptUpdate',
          query: {
            id: row.bussinessId,
            todo: todo
          }
        })
      } else if (row.bussinessCode == 'ALM_ASSET_COLLECT') {
        // 领用单
        this.$router.push({
          name: 'collect-collectUpdate',
          query: {
            id: row.bussinessId,
            todo: todo
          }
        })
      }
    },
    // 获取权限
    getHasPermi(row, type) {
      if (row.bussinessCode == 'PO_PURCHASE_APPLICATION') {
        // 申购单
        return ['srm:application:' + type]
      } else if (row.bussinessCode == 'ALM_ASSET_RECEIPT') {
        // 入库单
        return ['asset:receipt:' + type]
      } else if (row.bussinessCode == 'ALM_ASSET_COLLECT') {
        // 领用单
        return ['asset:collect:' + type]
      }
    },
    // 分页
    handlePageChange({ currentPage, pageSize }) {
      this.tablePage.currentPage = currentPage
      this.tablePage.pageSize = pageSize
      // 触发列表请求
      this.load()
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        '',
        {
          ...this.queryParams
        },
        `待办_${new Date().getTime()}.xlsx`
      )
    }
  }
}
</script>
<style lang="scss" scoped src="@/styles/vxeTable.scss"></style>
