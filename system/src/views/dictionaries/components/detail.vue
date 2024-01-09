<template>
  <vxe-modal v-model="openView" title="查看字典" width="1024px" height="90%" show-footer esc-closable resize @hide="cancel" @close="cancel">
    <div v-loading="loading">
      <SectionCard title="字典信息">
        <el-form ref="form" :model="formData" label-width="120px">
          <el-row>
            <el-col :span="8">
              <el-form-item label="字典唯一标识">{{ formData.code }}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="字典名称">{{ formData.name }}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="字典值">{{ formData.value }}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="排序">{{ formData.sort }}</el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="最后更新时间">{{ formData.updateTime }}</el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </SectionCard>
      <SectionCard title="字典项信息" :is-header-split="false">
        <el-card class="box-card margin-b">
          <vxe-grid
            max-height="500"
            header-align="center"
            align="center"
            :data="formDataList"
            border
            :resizable="true"
            :columns="tableColumn"
            :row-config="{isHover:true,isCurrent:true}"
            class="vxeTable"
            auto-resize
            show-overflow="tooltip"
          />
        </el-card>
      </SectionCard>
    </div>
    <div slot="footer" class="dialog-footer" align="center">
      <el-button @click="cancel">取 消</el-button>
    </div>
  </vxe-modal>
</template>

<script>
import { getDictionaries } from '@/api/dictionaries.js'
export default {
  model: {
    prop: 'openView',
    event: 'close'
  },
  props: {
    openView: {
      type: Boolean,
      default: false
    },
    editId: {
      type: String,
      default: ''
    },
    dictDataList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      loading: false,
      isExpand: false,
      dataListLoading: false,
      operationInstruction: '上世纪',
      formDataList: [],
      formData: {},
      tableColumn: [
        { field: 'itemsCode', title: '字典值', minWidth: 300 },
        { field: 'itemsName', title: '字典项名称', minWidth: 200 },
        { field: 'itemsValue', title: '字典项值', minWidth: 180 },
        { field: 'sort', title: '排序', minWidth: 120 },
        { field: 'remark', title: '备注', minWidth: 320 }
      ]
    }
  },
  created() {
    if (this.editId) {
      this.init()
    }
  },
  methods: {
    init() {
      this.loading = true
      getDictionaries(this.editId)
        .then((res) => {
          this.formData = res.data
          this.formDataList = this.formData.itemsList
        })
        .finally(() => {
          this.loading = false
        })
    },

    // 取消按钮
    cancel() {
      this.$emit('close', false)
    }
  }
}
</script>
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