<template>
  <SectionCard title="加密项设置" :isHeaderSplit="true">
    <vxe-grid
      ref="xTable"
      v-loading="loading"
      header-align="center"
      align="center"
      :data="itemList"
      border
      max-height="600"
      :resizable="true"
      keep-source
      :columns="tableColumn"
      :row-config="{isHover:true,isCurrent:true}"
      class="vxeTable"
      :edit-config="{trigger: 'manual', mode: 'row',showIcon:false,autoClear:false}"
      :edit-rules="validRules"
    >
      <template #seqHeader>序号</template>
      <template #dicItemName="{row}">
        <base-input v-if="$refs.xTable.isActiveByRow(row)" size="small" :options-list="dictDataList" :value.sync="row.dicItemName" base-code="SmEncrypItem-dicItemName" placeholder="加密项" />
        <dictDateView v-else :value="row.dicItemName" :dict-data-list="dictDataList" dict-code="SmEncrypItem-dicItemName" />
      </template>
      <template #encrypCenario="{row}">
        <el-input v-if="$refs.xTable.isActiveByRow(row)" v-model="row.encrypCenario" size="small" placeholder="加密场景"></el-input>
      </template>
      <template #setterDate="{row}">
        <el-date-picker
          v-if="$refs.xTable.isActiveByRow(row)"
          clearable
          v-model="row.setterDate"
          type="datetime"
          size="small"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="设置时间"
        ></el-date-picker>
      </template>
      <template #status="{row}">
        <el-radio-group v-if="$refs.xTable.isActiveByRow(row)" v-model="row.status">
          <el-radio label="1">生效</el-radio>
          <el-radio label="0">失效</el-radio>
        </el-radio-group>
        <span v-else>{{ {1:"生效",0:"失效"}[row.status] }}</span>
      </template>

      <template #todo="{row}">
        <div class="todo">
          <el-button v-if="$refs.xTable.isActiveByRow(row)" size="mini" type="text" @click="sureDataFormSubmit(row)" v-hasPermi="['memberc:address:edit']">保存</el-button>
          <el-button v-if="$refs.xTable.isActiveByRow(row)" type="text" size="mini" @click="dataFormClose(row)">取消</el-button>
          <el-button v-if="!$refs.xTable.isActiveByRow(row)" size="mini" type="text" @click="editFormSubmit(row)" v-hasPermi="['memberc:address:edit']">编辑</el-button>
          <el-button v-if="!$refs.xTable.isActiveByRow(row)" size="mini" type="text" @click="handleDelete(row)" v-hasPermi="['memberc:address:remove']">删除</el-button>
        </div>
      </template>
    </vxe-grid>
    <el-button icon="el-icon-circle-plus-outline" class="btn-block" style="margin-top: 15px" @click="addData()">添加加密项</el-button>
  </SectionCard>
</template>

<script>
import { listItem, getItem, delItem, addItem, updateItem, addOrUpdate } from '@/api/item.js'
import { listDictItems } from '@/api/base.js'
export default {
  data() {
    return {
      loading: false,
      itemList: [],
      validRules: {
        dicItemName: [{ required: true, message: '请填写加密项' }],
        encrypCenario: [{ required: true, message: '请填写加密场景' }],
        setterDate: [{ required: true, message: '请填写设置时间' }]
      },
      tableColumn: [
        { type: 'seq', width: 70, align: 'center', fixed: 'left', visible: true, visibleDisabled: true, slots: { header: 'seqHeader' } },
        { field: 'dicItemName', title: '加密项', minWidth: 100, slots: { default: 'dicItemName', edit: 'dicItemName' }, editRender: {} },
        { field: 'encrypCenario', title: '加密场景', minWidth: 100, slots: { edit: 'encrypCenario' }, editRender: {} },
        { field: 'setterDate', title: '设置时间', minWidth: 100, slots: { edit: 'setterDate' }, editRender: {} },
        { field: 'status', title: '状态', minWidth: 100, slots: { default: 'status', edit: 'status' }, editRender: {} },
        { field: 'todo', title: '操作', width: 200, slots: { default: 'todo' } }
      ],
      cacheItemList: [],
      dictDataList: []
    }
  },
  created() {
    this.getDictData()
    this.load()
  },
  methods: {
    load() {
      this.loading = true
      listItem({ customerId: this.$store.getters.userInfo.customerId })
        .then((res) => {
          this.cacheItemList = JSON.parse(JSON.stringify(res.rows))
          this.itemList = res.rows
        })
        .finally(() => {
          this.loading = false
        })
    },
    async addData() {
      var editRow = this.$refs.xTable.getActiveRecord()
      if (editRow) {
        this.$message({
          type: 'warning',
          message: '请完成正在编辑的行数据'
        })
        return
      }
      let data = { status: '1' }

      this.itemList.push(data)
      this.$refs.xTable.setActiveRow(data)
    },
    editFormSubmit(row) {
      var editRow = this.$refs.xTable.getActiveRecord()
      if (editRow) {
        this.$message({
          type: 'warning',
          message: '请完成正在编辑的行数据'
        })
        return
      }
      this.$refs.xTable.setActiveRow(row)
    },
    async sureDataFormSubmit(row) {
      var errMap = await this.$refs.xTable.validate(row).catch((errMap) => errMap)
      if (!errMap) {
        var submitData = {
          customerId: this.$store.getters.userInfo.customerId,
          itemList: this.itemList
        }
        addOrUpdate(submitData).then((res) => {
          if (row.encrypItemId) {
            this.$message.success('修改成功')
          } else {
            this.$message.success('新增成功')
          }
          this.load()
          this.$refs.xTable.clearActived()
        })
      }
    },
    dataFormClose() {
      this.$refs.xTable.clearActived()
      this.itemList = JSON.parse(JSON.stringify(this.cacheItemList))
    },
    handleDelete(row) {
      this.$confirm('是否确认删除加密项为["' + row.dicItemName + '"]的数据项？', '', { type: 'warning' }).then((res) => {
        delItem(row.encrypItemId).then((res) => {
          this.load()
          this.$message.success('删除成功')
        })
      })
    },
    getDictData() {
      var dictCodes = 'SmEncrypItem-dicItemName' // 加密项字典列表
      listDictItems(dictCodes).then((res) => {
        this.dictDataList = res.sysDictionaryItemsList
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.btn-block {
  display: block;
  width: 100%;
}
</style>
<style lang="scss" scoped src="@/styles/vxeTable.scss"></style>