<template>
  <div class="card-container app-container">
    <el-container>
      <el-header>
        <SearchArea :show-all-search.sync="showAllSearch" class="p-16" :show-toggle-btn="false">
          <div class="flex">
            <div class="searchLeft">
              <el-row :gutter="14">
                <el-col :span="4">
                  <el-input v-model="queryParams.ipaddr" size="mini" placeholder="请输入登录地址" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.userName" size="mini" placeholder="请输入用户名称" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="16">
                  <el-button type="primary" icon="el-icon-search" size="mini" @click="load">搜索</el-button>
                  <el-button icon="el-icon-refresh" size="mini" @click="reset">重置</el-button>
                </el-col>
              </el-row>
            </div>
          </div>
        </SearchArea>
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
          <template #todo="{row}">
            <el-button v-hasPermi="['monitor:online:forceLogout']" size="mini" type="text" icon="el-icon-delete" @click="handleForceLogout(row)">强退</el-button>
          </template>
          <template #loginTime="{row}">
            <span>{{ $vxe.toDateString(new Date(Number(row.loginTime))) }}</span>
          </template>
          <!-- <template #pager>
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
          </template>-->
        </vxe-grid>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import vxeTable from '@/mixins/vxeTable'
import { onlineList, forceLogout } from '@/api/online.js'

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
      onlineList(this.currentParams)
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
    // handlePageChange() {
    //   if (type == 'currentPage') {
    //     this.tablePage.currentPage = value
    //   }
    //   if (type == 'pageSize') {
    //     this.tablePage.pageSize = value
    //   }
    //   // 触发列表请求
    //   this.load()
    // },
    handleForceLogout(row) {
      this.$confirm('是否确认强退名称为"' + row.userName + '"的用户？', '', { type: 'warning' }).then(() => {
        forceLogout(row.tokenId).then(() => {
          this.reload()
          this.$message.success('强退成功')
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped src="@/styles/vxeTable.scss"></style>