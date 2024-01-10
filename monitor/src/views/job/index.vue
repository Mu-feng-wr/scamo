<template>
  <div class="card-container app-container">
    <el-container>
      <el-header>
        <SearchArea :show-all-search.sync="showAllSearch" class="p-16" :show-toggle-btn="false">
          <div class="flex">
            <div class="searchLeft">
              <el-row :gutter="14">
                <el-col :span="4">
                  <el-input v-model="queryParams.jobName" size="small" placeholder="请输入任务名称" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-select v-model="queryParams.jobGroup" size="small" placeholder="请选择任务组名" clearable>
                    <el-option label="默认" value="DEFAULT" />
                    <el-option label="系统" value="SYSTEM" />
                  </el-select>
                </el-col>
                <el-col :span="4">
                  <el-select v-model="queryParams.status" size="small" placeholder="请选择任务状态" clearable>
                    <el-option label="正常" value="0" />
                    <el-option label="暂停" value="1" />
                  </el-select>
                </el-col>
                <el-col :span="8">
                  <el-button type="primary" icon="el-icon-search" size="mini" @click="load">搜索</el-button>
                  <el-button icon="el-icon-refresh" size="mini" @click="reset">重置</el-button>
                </el-col>
              </el-row>
            </div>
          </div>
        </SearchArea>
      </el-header>
      <el-main>
        <el-container>
          <el-header>
            <el-row class="mb-15">
              <el-col :span="12">
                <el-button v-hasPermi="['monitor:job:add']" type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
                <!-- <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['monitor:job:edit']">修改</el-button>
                <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['monitor:job:remove']">删除</el-button>-->
                <el-button v-hasPermi="['monitor:job:export']" plain icon="el-icon-upload2" size="mini" @click="handleExport">导出</el-button>
                <el-button v-hasPermi="['monitor:job:query']" type="info" plain icon="el-icon-s-operation" size="mini" @click="handleJobLog">日志</el-button>
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
              <template #loginTime="{row}">
                <span>{{ $vxe.toDateString(new Date(Number(row.loginTime))) }}</span>
              </template>
              <template #todo="{row}">
                <el-button v-hasPermi="['monitor:job:edit']" type="text" icon="el-icon-edit" size="mini" @click="handleUpdate(row)">修改</el-button>
                <el-button v-hasPermi="['monitor:job:remove']" type="text" icon="el-icon-delete" size="mini" @click="handleDelete(row)">删除</el-button>
                <el-dropdown v-hasPermi="['monitor:job:changeStatus', 'monitor:job:query']" size="mini" @command="(command) => handleCommand(command, row)">
                  <span class="el-dropdown-link">
                    <i class="el-icon-d-arrow-right el-icon--right"></i>更多
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-hasPermi="['monitor:job:changeStatus']" command="handleRun" icon="el-icon-caret-right">执行一次</el-dropdown-item>
                    <el-dropdown-item v-hasPermi="['monitor:job:query']" command="handleView" icon="el-icon-view">任务详细</el-dropdown-item>
                    <el-dropdown-item v-hasPermi="['monitor:job:query']" command="handleJobLog" icon="el-icon-s-operation">调度日志</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
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
// getJob, delJob, addJob, updateJob, runJob, changeJobStatus
import { listJob } from '@/api/job.js'

export default {
  mixins: [vxeTable],
  data() {
    return {
      showAllSearch: false,
      currentParams: {},
      queryParams: {},
      tableColumn: [
        { type: 'seq', width: 70, align: 'center', fixed: 'left', visible: true, visibleDisabled: true, slots: { header: 'seqHeader' } },
        { visible: true, field: 'tokenId', title: '会话编号' },
        { visible: true, field: 'userName', title: '登录名称' },
        { visible: true, field: 'ipaddr', title: '主机' },
        { visible: true, field: 'loginTime', title: '登录时间', slots: { default: 'loginTime' } },
        { visible: true, field: 'todo', width: 100, title: '操作', slots: { default: 'todo' } }
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
          pageNum: this.tablePage.currentPage,
          pageSize: this.tablePage.pageSize
        }
      }
    },
    reload() {
      this.tableLoading = true
      listJob(this.currentParams)
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
    handleUpdate() {},
    handleDelete() {},
    handleCommand() {}
  }
}
</script>
<style lang="scss" scoped src="@/styles/vxeTable.scss"></style>