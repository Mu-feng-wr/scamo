<template>
  <div style="display:inline-block">
    <el-button :disabled="disabled" type="primary" :size="size" icon="el-icon-plus" plain resize @click="openDialog">{{ title }}</el-button>
    <vxe-modal v-if="dialogVisible" v-model="dialogVisible" :title="title" width="70%" height="90%" esc-closable resize @hide="close">
      <div class="dialog">
        <el-container>
          <el-aside class="aside">
            <div class="treeBox">
              <div class="p-10">
                <el-input v-model="deptName" placeholder="请输入类别" clearable @change="changeInput" />
              </div>
              <el-tree
                ref="tree"
                v-loading="treeLoading"
                class="tree"
                :data="treeList"
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
                  <el-row>
                    <el-col :span="4">
                      <el-input v-model="queryParams.materialCode" size="mini" placeholder="物资编码" clearable />
                    </el-col>
                    <el-col :span="4" class="pl-14">
                      <el-input v-model="queryParams.materialName" size="mini" placeholder="物资名称" clearable />
                    </el-col>
                    <el-col :span="4" class="pl-14">
                      <el-input v-model="queryParams.sn" size="mini" placeholder="序列号" clearable />
                    </el-col>
                    <el-col :span="4" class="pl-14">
                      <el-select v-model="queryParams.materialType" :disabled="selectDisabled.materialType" size="mini" placeholder="物资类型" @change="load">
                        <el-option v-for="item in dictDataList" :key="item.itemsValue" :label="item.itemsName" :value="item.itemsValue" />
                      </el-select>
                    </el-col>
                    <el-col :span="6" class="pl-14">
                      <el-button type="primary" icon="el-icon-search" size="mini" @click="load">搜索</el-button>
                      <el-button icon="el-icon-refresh" size="mini" @click="reset">重置</el-button>
                    </el-col>
                    <el-col :span="2" class="text-right">
                      <el-button plain icon="el-icon-refresh" size="mini" @click="reload">刷新</el-button>
                    </el-col>
                  </el-row>
                </el-header>
                <el-main>
                  <el-container>
                    <el-aside style="transition: 0.3s;" :style="{width:showDrawer?'calc(100% - 355px)':'calc(100% - 30px)'}">
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
                        @checkbox-change="checkboxChange"
                        @checkbox-all="checkboxAll"
                        @cell-click="cellClick"
                      >
                        <template #seqHeader>序号</template>
                      </vxe-grid>
                    </el-aside>
                    <el-main class="drawer">
                      <div class="drawer_left">
                        <div class="btnDrawer" @click="showDrawer=!showDrawer">
                          <i :class="showDrawer?'el-icon-d-arrow-right':'el-icon-d-arrow-left'"></i>
                        </div>
                      </div>
                      <div v-show="showDrawer" class="drawer_right">
                        <div style="height:calc(100% - 20px);overflow: auto;">
                          <el-tag
                            v-for="(item,i) in selectList"
                            v-show="showDrawer"
                            :key="i"
                            size="medium"
                            class="mb-5"
                            closable
                            @close="closetag(item,i)"
                          >{{ item.materialCode }}-{{ item.materialName }}</el-tag>
                        </div>
                        <div class="text-right">已选数据 {{ selectList.length }} {{ limit?'/' + limit:'' }}条</div>
                      </div>
                    </el-main>
                  </el-container>
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
      </div>
    </vxe-modal>
  </div>
</template>
<script>
import vxeTable from '@/mixins/vxeTable'
import { listDictItems, categoryTreeSelect, listMaterialQuery } from '@/api/base.js'
export default {
  name: 'SelectMaterial',
  mixins: [vxeTable],
  props: {
    title: {
      type: String,
      default: '选择资产标准'
    },
    type: {
      type: String,
      default: 'checkbox'
    },
    query: {
      type: Array,
      default: () => {
        return []
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'small'
    },
    selectedData: {
      type: Array,
      default: () => {
        return []
      }
    },
    limit: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      dialogVisible: false,
      treeLoading: false,
      showDrawer: true,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      treeList: [],
      categoryParentId: '',
      deptName: '',
      queryParams: {},
      dictDataList: [],
      selectDisabled: {},
      tableColumn: [
        { type: this.type, width: 50, align: 'center', fixed: 'left' },
        { type: 'seq', width: 50, align: 'center', fixed: 'left', slots: { header: 'seqHeader' } },
        { field: 'materialCode', title: '物资编号', width: 200, fixed: 'left' },
        { field: 'materialName', title: '物资名称', width: 200 },
        { field: 'categoryCode', title: '分类编号', width: 130 },
        { field: 'categoryName', title: '分类名称', width: 130 },
        { field: 'sn', title: '序列号', width: 180 },
        { field: 'modelType', title: '规格型号', width: 180 },
        { field: 'brandName', title: '品牌', width: 130 },
        { field: 'color', title: '颜色', width: 130 },
        { field: 'unitName', title: '计量单位', width: 130 },
        { field: 'alterUnitName', title: '换算单位', width: 120, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { field: 'alterUnitNum', title: '换算数量', width: 120, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { field: 'price', title: '单价（元）', width: 120, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { field: 'taxRate', title: '税率（%）', width: 120, headerAlign: 'center', align: 'right', formatter: 'formatMoney' },
        { field: 'taxValue', title: '税额（元）', width: 120, headerAlign: 'center', align: 'right', formatter: 'formatMoney' }
      ],
      selectList: []
    }
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
          categoryParentId: this.categoryParentId,
          pageNum: this.tablePage.currentPage,
          pageSize: this.tablePage.pageSize
        }
      }
    },
    reload() {
      this.tableLoading = true
      listMaterialQuery(this.queryParams)
        .then((res) => {
          this.tableData = res.rows
          this.tablePage.total = Number(res.total)
          this.$nextTick(() => {
            if (this.$refs.xTable) {
              this.$refs.xTable.setAllCheckboxRow(false)
            }
            if (this.selectList.length) {
              this.selectList.forEach((item) => {
                var index = this.tableData.findIndex((temp) => temp.materialCode == item.materialCode)
                if (index >= 0) {
                  this.$refs.xTable.setCheckboxRow(this.tableData[index], true)
                }
              })
            }
          })
        })
        .finally(() => {
          this.tableLoading = false
        })
    },
    reset() {
      this.queryParams = {}
      if (this.query && this.query.length > 0) {
        var text = ''
        this.query.forEach((item) => {
          this.$set(this.queryParams, item.valueName, item.value)
          this.selectDisabled[item.valueName] = item.disabled
          if (item.require) {
            if (!item.value && item.require) {
              text = item.text
            }
          }
        })
        if (text) {
          this.$message({
            type: 'warning',
            message: `请选择${text}`
          })
          return
        }
      }
      if (this.dictDataList.length > 0) {
        if (!this.selectDisabled.materialType) {
          this.$set(this.queryParams, 'materialType', this.dictDataList[0].itemsValue)
        }
      }
      this.selectList = []
      this.load()
    },
    confirm() {
      this.close()
      this.$emit('confirm', this.selectList, this.queryParams.materialType)
    },
    changeInput(val) {
      this.$refs.tree.filter(val)
    },
    async openDialog() {
      if (this.query && this.query.length > 0) {
        var text = ''
        this.query.forEach((item) => {
          this.$set(this.queryParams, item.valueName, item.value)
          this.selectDisabled[item.valueName] = item.disabled
          if (item.require) {
            if (!item.value && item.require) {
              text = item.text
            }
          }
        })
        if (text) {
          this.$message({
            type: 'warning',
            message: `请选择${text}`
          })
          return
        }
      }
      this.categoryParentId = ''
      this.selectList = []
      this.tablePage.currentPage = 1
      this.tablePage.total = 0
      this.dialogVisible = true
      this.showDrawer = true
      if (this.selectedData && this.selectedData.length > 0) {
        this.selectList = JSON.parse(JSON.stringify(this.selectedData))
      }

      await this.getDictData()
      this.load()
      this.getMaterialTree()
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    handleNodeClick(data) {
      this.categoryParentId = data.id
      this.load()
    },
    handlePageChange({ currentPage, pageSize }) {
      this.tablePage.currentPage = currentPage
      this.tablePage.pageSize = pageSize
      // 触发列表请求
      this.load()
    },
    getMaterialTree() {
      this.treeLoading = true
      categoryTreeSelect()
        .then((res) => {
          this.treeList = res.data
        })
        .finally(() => {
          this.treeLoading = false
        })
    },
    checkboxChange({ checked, row, rowIndex }) {
      if (checked) {
        if (this.limit) {
          if (this.selectList.length < this.limit) {
            this.selectList.push(row)
          } else {
            this.$refs.xTable.setCheckboxRow(row, false)
          }
        } else {
          this.selectList.push(row)
        }
      } else {
        var index = this.selectList.findIndex((item) => item.materialCode == row.materialCode)
        if (index >= 0) {
          this.selectList.splice(index, 1)
        }
      }
    },
    checkboxAll({ checked, $event }) {
      var list = []
      if (checked) {
        list = this.$refs.xTable.getCheckboxRecords()
        list.forEach((item) => {
          var index = this.selectList.findIndex((temp) => item.materialCode == temp.materialCode)
          if (index < 0) {
            if (this.limit) {
              if (this.selectList.length < this.limit) {
                this.selectList.push(item)
              } else {
                this.$refs.xTable.setCheckboxRow(item, false)
              }
            } else {
              this.selectList.push(item)
            }
          }
        })
      } else {
        list = this.tableData
        list.forEach((item) => {
          var index = this.selectList.findIndex((temp) => item.materialCode == temp.materialCode)
          if (index >= 0) {
            this.selectList.splice(index, 1)
          }
        })
      }
    },
    closetag(tag, i) {
      var index = this.tableData.findIndex((item) => item.materialCode == tag.materialCode)
      if (index >= 0) {
        this.$refs.xTable.setCheckboxRow(this.tableData[index], false)
      }
      this.selectList.splice(i, 1)
    },
    cellClick({ row, column }) {
      if (column.type == 'checkbox') {
        return
      }
      if (this.type == 'checkbox') {
        this.$refs.xTable.setCheckboxRow(row, true)
        var index = this.selectList.findIndex((item) => item.materialCode == row.materialCode)
        if (index < 0) {
          if (this.limit) {
            if (this.selectList.length < this.limit) {
              this.selectList.push(row)
            } else {
              this.$refs.xTable.setCheckboxRow(row, false)
            }
          } else {
            this.selectList.push(row)
          }
        }
      }
    },
    close() {
      this.dialogVisible = false
    },
    async getDictData() {
      this.tableLoading = true
      var dictCodes = 'StlMaterial-materialType' // 物资类型
      var res = await listDictItems(dictCodes)
      this.dictDataList = res.sysDictionaryItemsList
      if (this.dictDataList.length > 0) {
        if (!this.selectDisabled.materialType) {
          this.$set(this.queryParams, 'materialType', this.dictDataList[0].itemsValue)
        }
      }
      this.tableLoading = false
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-drawer__header {
  padding: 12px 15px;
  margin-bottom: 0 !important;
  box-shadow: 0 1px 5px #efefef;
}
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
.dialog {
  position: relative;
  height: 100%;
}

.content {
  height: 100%;
  .main {
    height: calc(100% - 60px);
    overflow-y: auto;
    box-shadow: 0 1px 5px #efefef;
    padding: 20px;
    box-sizing: border-box;
  }
  .footer {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
aside {
  background-color: transparent;
  padding: 0;
  margin: 0;
}
.drawer {
  display: flex;
  height: calc(100% - 48px);
  .drawer_left {
    margin-left: 10px;
    display: flex;
    align-items: center;
    border-right: 1px #ccc solid;
    .btnDrawer {
      cursor: pointer;
      display: flex;
      align-items: center;
      width: 15px;
      height: 45px;
      border-left: 1px #ccc solid;
      border-top: 1px #ccc solid;
      border-bottom: 1px #ccc solid;
      border-radius: 10px 0 0 10px;
    }
  }
  .drawer_right {
    height: 100%;
    width: 330px;
    overflow: auto;
    border-right: 1px #ccc solid;
    border-top: 1px #ccc solid;
    border-bottom: 1px #ccc solid;
    padding: 10px;
  }
}
</style>
<style lang="scss" scoped>
::v-deep .vxe-modal--header {
  background: #fff;
  border-bottom: 0px;
}
::v-deep .vxe-modal--title {
  font-weight: 500;
  font-size: 1.2em;
}
</style>
<style lang="scss" scoped src="@/styles/vxeTable.scss"></style>