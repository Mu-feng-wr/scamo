<template>
  <SectionCard title="邮寄地址" :isHeaderSplit="true">
    <vxe-grid
      ref="xTable"
      v-loading="loading"
      header-align="center"
      align="center"
      :data="mailAddressList"
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
      <template #receivorUser="{row}">
        <el-input v-if="$refs.xTable.isActiveByRow(row)" v-model="row.receivorUser" size="small" placeholder="收件人"></el-input>
      </template>
      <template #telephone="{row}">
        <el-input v-if="$refs.xTable.isActiveByRow(row)" v-model="row.telephone" size="small" placeholder="联系电话"></el-input>
      </template>
      <template #postal="{row}">
        <el-input v-if="$refs.xTable.isActiveByRow(row)" v-model="row.postal" size="small" placeholder="邮编"></el-input>
      </template>
      <template #address="{row}">
        <el-input v-if="$refs.xTable.isActiveByRow(row)" v-model="row.address" size="small" placeholder="邮寄地址"></el-input>
      </template>
      <template #ynDefault="{row,rowIndex}">
        <el-radio-group v-model="row.ynDefault" :disabled="!$refs.xTable.isActiveByRow(row)" @change="checkAddressDefault($event,rowIndex)">
          <el-radio label="1">是</el-radio>
          <el-radio label="0">否</el-radio>
        </el-radio-group>
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
    <el-button icon="el-icon-circle-plus-outline" class="btn-block" style="margin-top: 15px" @click="addData()">添加邮寄地址</el-button>
  </SectionCard>
</template>

<script>
import { mobileRegex, telephoneRegex, zipRegex } from '@/utils/pattern'
import { listAddress, getAddress, delAddress, addAddress, updateAddress, addOrUpdate } from '@/api/address.js'
export default {
  data() {
    return {
      loading: false,
      mailAddressList: [],
      validRules: {
        receivorUser: [{ required: true, message: '请填写收件人' }],
        telephone: [
          {
            required: true,
            message: '请填写联系电话',
            validator: ({ cellValue }) => {
              if (cellValue && !mobileRegex.test(cellValue) && !telephoneRegex.test(cellValue)) {
                return new Error('请输入正确的手机号码或电话号码')
              }
            }
          }
        ],
        postal: [
          {
            required: true,
            message: '请填写邮编',
            validator: ({ cellValue }) => {
              if (cellValue && !zipRegex.test(cellValue)) {
                return new Error('请输入正确的邮编')
              }
            }
          }
        ],
        address: [{ required: true, message: '请填写邮寄地址' }]
      },
      tableColumn: [
        { type: 'seq', width: 70, align: 'center', fixed: 'left', visible: true, visibleDisabled: true, slots: { header: 'seqHeader' } },
        { field: 'receivorUser', title: '收件人', minWidth: 100, slots: { edit: 'receivorUser' }, editRender: {} },
        { field: 'telephone', title: '联系电话', minWidth: 120, slots: { edit: 'telephone' }, editRender: {} },
        { field: 'postal', title: '邮编', minWidth: 120, slots: { edit: 'postal' }, editRender: {} },
        { field: 'address', title: '邮寄地址', minWidth: 120, slots: { edit: 'address' }, editRender: {} },
        { field: 'ynDefault', title: '默认', minWidth: 120, slots: { default: 'ynDefault', edit: 'ynDefault' }, editRender: {} },
        { field: 'todo', title: '操作', width: 200, slots: { default: 'todo' } }
      ],
      cacheMailAddressList: []
    }
  },
  created() {
    this.load()
  },
  methods: {
    load() {
      this.loading = true
      listAddress({ customerId: this.$store.getters.userInfo.customerId })
        .then((res) => {
          this.cacheMailAddressList = JSON.parse(JSON.stringify(res.rows))
          this.mailAddressList = res.rows
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
      let data = { visible: true, ynDefault: '0' }

      this.mailAddressList.push(data)
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
          mailAddressList: this.mailAddressList
        }
        addOrUpdate(submitData).then((res) => {
          if (row.mailAddressId) {
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
      this.mailAddressList = JSON.parse(JSON.stringify(this.cacheMailAddressList))
    },
    handleDelete(row) {
      this.$confirm('是否确认删除邮寄收件人为["' + row.receivorUser + '"]的数据项？', '', { type: 'warning' }).then((res) => {
        delAddress(row.mailAddressId).then((res) => {
          this.load()
          this.$message.success('删除成功')
        })
      })
    },
    checkAddressDefault(val, rowIndex) {
      if (this.mailAddressList.length < 2) {
        this.$message.warning('必须存在一个默认地址')
        this.mailAddressList[0].ynDefault = '1'
        return
      }
      if (val == '1') {
        this.mailAddressList.forEach((item, index) => {
          if (rowIndex != index) {
            item.ynDefault = '0'
          }
        })
      } else {
        if (this.mailAddressList.length - 1 == rowIndex) {
          this.mailAddressList[this.mailAddressList.length - 2].ynDefault = '1'
        } else {
          this.mailAddressList[this.mailAddressList.length - 1].ynDefault = '1'
        }
      }
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