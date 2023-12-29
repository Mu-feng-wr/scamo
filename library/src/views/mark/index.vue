<template>
  <div class="card-container app-container">
    <el-container>
      <el-header>
        <SearchArea :show-all-search.sync="showAllSearch" class="p-16">
          <div class="flex">
            <div class="searchLeft">
              <el-row :gutter="14">
                <el-col :span="4">
                  <el-input v-model="queryParams.companyName" size="small" placeholder="请输入所属公司名称" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.markLogo" size="small" placeholder="请输入标签LOGO" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.markCode" size="small" placeholder="请输入标签样本编号" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.markIcon" size="small" placeholder="请输入标签样本图片包括条码、二维码、混合" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.ynUse" size="small" placeholder="请输入" clearable @keyup.enter.native="load" />
                </el-col>
                <el-col :span="4">
                  <el-input v-model="queryParams.unifiedSystemNumber" size="small" placeholder="请输入客户统一系统编号" clearable @keyup.enter.native="load" />
                </el-col>
              </el-row>
              <el-row v-if="showAllSearch" :gutter="14" class="mt-10">
                <el-col :span="4">
                  <el-date-picker clearable v-model="queryParams.createDate" size="small" type="date" value-format="yyyy-MM-dd" placeholder="请选择创建时间" @change="load"></el-date-picker>
                </el-col>
                <el-col :span="4">
                  <el-date-picker clearable v-model="queryParams.updateDate" size="small" type="date" value-format="yyyy-MM-dd" placeholder="请选择更新时间" @change="load"></el-date-picker>
                </el-col>
              </el-row>
            </div>
            <div class="ml-10 searchRight">
              <el-button type="primary" icon="el-icon-search" size="mini" @click="load">搜索</el-button>
              <el-button icon="el-icon-refresh" size="mini" @click="reset">重置</el-button>
            </div>
          </div>
        </SearchArea>
      </el-header>
      <el-main>
        <el-container>
          <el-header>
            <el-row class="mb-15">
              <el-col :span="12">
                <el-button v-hasPermi="['asset:receipt:add']" type="primary" plain icon="el-icon-plus" size="mini" @click="addOrUpdateHandle()">新增标签</el-button>
              </el-col>
              <el-col :span="12" class="text-right">
                <el-button plain icon="el-icon-refresh" size="mini" @click="reload">刷新</el-button>
              </el-col>
            </el-row>
          </el-header>
          <el-main>
            <el-row>
              <el-col :span="6" v-for="(row, index) in tableData" :key="index">
                <div class="markItem">
                  <div class="markItem-body">
                    <div class="item">
                      <el-row>
                        <el-col :span="8">
                          <img v-if="row.markLogo" :src="row.markLogo" />
                          <img v-else :src="defaultImg" class="avatar" />
                        </el-col>
                        <el-col :span="16" v-if="row.markIcon == 2" style="margin-top: 20px">
                          <span>公司名称：</span>
                          <span>{{ row.companyName }}</span>
                        </el-col>
                        <el-col :span="16" class="disp-flex justify-end qrcodeBox" v-else>
                          <div class="qrcode" :ref="'qrcode' + index">{{ qrcodeFun(index, row.markCode) }}</div>
                        </el-col>
                      </el-row>
                      <el-row v-if="row.markIcon != 2">
                        <el-col :span="24">
                          <span>公司名称：</span>
                          <span>{{ row.companyName }}</span>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="24">
                          <span>资产名称：</span>
                          <span>{{ row.assetName }}</span>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="24">
                          <span>资产编码：</span>
                          <span>{{ row.markCode }}</span>
                        </el-col>
                      </el-row>
                      <el-row v-if="row.markIcon != 2">
                        <el-col :span="24">
                          <span>规格型号：</span>
                          <span>{{ row.model }}</span>
                        </el-col>
                      </el-row>
                      <el-row v-if="row.markIcon != 2">
                        <el-col :span="24">
                          <span>启用日期：</span>
                          <span>{{ row.updateDate }}</span>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :span="24" v-if="row.markIcon == 2">
                          <img :ref="'barcode' + index" style="max-width: 100%" :src="barcodeFun(index, row.markCode)" />
                        </el-col>
                      </el-row>
                    </div>
                  </div>
                  <div class="actions">
                    <el-link type="primary" @click="detailHandle(row.materialMarkId)">预览</el-link>
                    <el-link type="primary" @click="addOrUpdateHandle(row.materialMarkId)" v-hasPermi="['library:mark:edit']">编辑</el-link>
                    <el-link type="primary" @click="handleDelete(row)" v-hasPermi="['library:mark:remove']">删除</el-link>
                  </div>
                </div>
              </el-col>
            </el-row>
          </el-main>
        </el-container>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import vxeTable from '@/mixins/vxeTable'
import { listMark, delMark } from '@/api/mark.js'
import QRCode from 'qrcodejs2'
export default {
  mixins: [vxeTable],
  data() {
    return {
      showAllSearch: false,
      queryParams: {}
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
        ...this.moreQueryParams,
        ...{
          pageNum: this.tablePage.currentPage,
          pageSize: this.tablePage.pageSize
        }
      }
    },
    reload() {
      this.tableLoading = true
      listMark(this.queryParams)
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
    addOrUpdateHandle(id) {
      if (id) {
        window.$wujie.props.route({
          path: '/library/mark',
          module: 'Library',
          fullPath: '/library/mark/edit',
          title: '修改标签',
          condition: { id }
        })
      } else {
        window.$wujie.props.route({
          path: '/library/mark',
          module: 'Library',
          fullPath: '/library/mark/add',
          title: '新增标签'
        })
      }
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$confirm('是否确认删除物资标签信息编号为"' + row.materialMarkId + '"的数据项？').then(function () {
        delMark(row.materialMarkId).then(() => {
          this.getList()
          this.$message.success('删除成功')
        })
      })
    },
    detailHandle() {
      window.$wujie.props.route({
        path: '/library/mark',
        module: 'Library',
        fullPath: '/library/mark/detail',
        title: '标签详情',
        condition: { id }
      })
    },
    // 生成二维码
    qrcodeFun(index, code) {
      this.$nextTick(() => {
        this.$refs['qrcode' + index][0].innerHTML = ''
        let qrcode = new QRCode(this.$refs['qrcode' + index][0], {
          width: 100, //宽度
          height: 100, // 高度
          text: code, // 二维码内容
          correctLevel: QRCode.CorrectLevel.L //容错级别
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped src="@/styles/vxeTable.scss"></style>
<style lang="scss" scoped>
.markItem {
  background: #f9f9f9;
  border: 1px solid #eee;
  border-radius: 2px;
  margin-bottom: 12px;

  .markItem-body {
    padding: 12px;
  }

  .item {
    background: #fff;
    border: 1px solid #f2f2f2;
    border-radius: 2px;
    padding: 10px;
    //  margin-bottom: 15px;
    font-size: 14px;

    .el-row:first-child {
      margin-bottom: 10px;
    }

    > .el-row + .el-row {
      padding-top: 6px;
    }
  }

  .actions {
    background-color: #fff;
    display: flex;
    padding: 10px;

    .el-link {
      width: 100%;
      text-align: center;
      position: relative;

      & + .el-link::before {
        content: '';
        position: absolute;
        width: 1px;
        background-color: #ddd;
        left: 0;
        height: 14px;
        top: 50%;
        transform: translateY(-50%);
      }
    }

    .el-link.is-underline:hover:after {
      display: none;
    }
  }
}
</style>