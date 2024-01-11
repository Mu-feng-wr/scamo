<template>
  <SectionCard title="邮箱域名" :isHeaderSplit="true">
    <vxe-grid
      ref="xTable"
      v-loading="loading"
      header-align="center"
      align="center"
      :data="domainList"
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
      <template #mailboxDomainName="{row}">
        <el-input v-if="$refs.xTable.isActiveByRow(row)" v-model="row.mailboxDomainName" size="small" placeholder="域名"></el-input>
      </template>
      <template #setterName="{row}">
        <el-input v-if="$refs.xTable.isActiveByRow(row)" v-model="row.setterName" size="small" placeholder="设置人"></el-input>
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
    <el-button icon="el-icon-circle-plus-outline" class="btn-block" style="margin-top: 15px" @click="addData()">添加邮箱域名</el-button>
  </SectionCard>
</template>

<script>
import { listDomain, delDomain, addOrUpdate } from '@/api/domain.js'
export default {
  data() {
    return {
      loading: false,
      domainList: [],
      validRules: {
        mailboxDomainName: [{ required: true, message: '请填写域名' }],
        setterName: [{ required: true, message: '请填写设置人' }],
        setterDate: [{ required: true, message: '请填写设置时间' }]
      },
      tableColumn: [
        { type: 'seq', width: 70, align: 'center', fixed: 'left', visible: true, visibleDisabled: true, slots: { header: 'seqHeader' } },
        { field: 'mailboxDomainName', title: '域名', minWidth: 100, slots: { edit: 'mailboxDomainName' }, editRender: {} },
        { field: 'setterName', title: '设置人', minWidth: 100, slots: { edit: 'setterName' }, editRender: {} },
        { field: 'setterDate', title: '设置时间', minWidth: 100, slots: { edit: 'setterDate' }, editRender: {} },
        { field: 'status', title: '状态', minWidth: 100, slots: { default: 'status', edit: 'status' }, editRender: {} },
        { field: 'todo', title: '操作', width: 200, slots: { default: 'todo' } }
      ],
      cacheDomainList: []
    }
  },
  created() {
    this.load()
  },
  methods: {
    load() {
      this.loading = true
      listDomain({ customerId: this.$store.getters.userInfo.customerId })
        .then((res) => {
          this.cacheDomainList = JSON.parse(JSON.stringify(res.rows))
          this.domainList = res.rows
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

      this.domainList.push(data)
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
          domainList: this.domainList
        }
        addOrUpdate(submitData).then((res) => {
          if (row.mailboxDomainId) {
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
      this.domainList = JSON.parse(JSON.stringify(this.cacheDomainList))
    },
    handleDelete(row) {
      this.$confirm('是否确认删除邮箱域名号为["' + row.mailboxDomainName + '"]的数据项？', '', { type: 'warning' }).then((res) => {
        delDomain(row.mailboxDomainId).then((res) => {
          this.load()
          this.$message.success('删除成功')
        })
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