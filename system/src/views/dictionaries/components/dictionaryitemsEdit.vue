<template>
  <vxe-modal v-model="openView" title="新增字典项" width="1024px" height="90%" show-footer esc-closable resize @hide="cancel" @close="cancel">
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
          <el-button style="margin-top: 10px; margin-bottom: 10px" class="primary-btn-text pull-left" size="small" @click="addData()">新增一行</el-button>
          <el-table v-loading="dataListLoading" :data="formDataList" border style="width: 100%">
            <el-table-column prop="itemsCode" header-align="center" align="center" min-width="300" label="字典项唯一标识">
              <template slot-scope="scope">
                <el-input v-model="scope.row.itemsCode" placeholder="字典项唯一标识" maxlength="50" show-word-limit />
              </template>
            </el-table-column>
            <el-table-column prop="itemsName" header-align="center" align="center" width="200" label="字典项名称">
              <template slot-scope="scope">
                <el-input v-model="scope.row.itemsName" placeholder="字典项名称" maxlength="50" show-word-limit />
              </template>
            </el-table-column>
            <el-table-column prop="itemsValue" header-align="center" align="center" width="180" label="字典项值">
              <template slot-scope="scope">
                <el-input v-model="scope.row.itemsValue" placeholder="字典项值" maxlength="50" show-word-limit />
              </template>
            </el-table-column>
            <el-table-column label="排序" header-align="center" align="center" prop="sort" width="120">
              <template slot-scope="scope">
                <el-input-number v-model="scope.row.sort" :step="1" :min="1" aria-placeholder="排序" controls-position="right" />
              </template>
            </el-table-column>
            <el-table-column label="备注" header-align="center" align="center" prop="remark" width="320">
              <template slot-scope="scope">
                <el-input v-model="scope.row.remark" placeholder="备注" maxlength="500" show-word-limit />
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="100">
              <template slot-scope="scope">
                <el-button type="text" icon="el-icon-delete" style="width: 30px" @click="handleDelete(scope.row, scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </SectionCard>
      <!-- <el-card class="box-card margin-b">
      <div slot="header" class="clearfix float-box d toggle-title">
        <div>
          <i class="el-icon-s-flag"></i>
          <span class="text-tip">操作指引</span>
        </div>
        <div>
          <a @click="isExpand = !isExpand" v-if="!isExpand">
            展开更多
            <i class="el-icon-arrow-down"></i>
          </a>
          <a @click="isExpand = !isExpand" v-if="isExpand">
            收起更多
            <i class="el-icon-arrow-up"></i>
          </a>
        </div>
      </div>
      <el-tag type="warning" class="toggle-tag">
        <div :class="isExpand ? 'toggle-content show' : 'toggle-content hide'" v-html="decodeURIComponent(operationInstruction)"></div>
      </el-tag>
      </el-card>-->
    </div>
    <div slot="footer" class="dialog-footer" align="center">
      <el-button type="primary" @click="dataFormSubmit">提 交</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </vxe-modal>
</template>

<script>
import { getDictionaries, updateDictionaries, delItems } from '@/api/dictionaries.js'
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
      formData: {}
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
    addData() {
      var data = {
        sort: '',
        status: 0
      }
      if (this.formDataList.length == 0) {
        this.formDataList.push(data)
      } else {
        var allowAdd = true
        this.formDataList.forEach((item) => {
          if (!item.itemsCode || !item.itemsName || !item.itemsValue || !item.sort) {
            allowAdd = false
          }
        })
        if (allowAdd) {
          data.sort = this.formDataList[this.formDataList.length - 1].sort + 1 // 获取最后一条排序号+1
          this.formDataList.push(data)
        } else {
          this.$message({
            message: '请填完整信息！',
            type: 'warning'
          })
        }
      }
    },
    // 校验列表数据是否为空
    dataVerification() {
      var result = true
      if (this.formDataList.length == 0) {
        return false
      }
      if (this.formDataList.length > 0) {
        this.formDataList.forEach((item) => {
          if (!item.itemsCode || !item.itemsName || !item.itemsValue || !item.sort) {
            result = false
          }
        })
      }
      return result
    },
    // 校验字典编码是否存在重复
    dataVerification1() {
      var result = ''
      var formDataList = this.formDataList
      var formDataList1 = this.formDataList
      for (var i = 0; i < formDataList.length; i++) {
        for (var j = 0; j < formDataList1.length; j++) {
          if (formDataList[i].itemsCode == formDataList1[j].itemsCode && i != j) {
            return (result = 1) // 返回1，字典编码重复
          }
          if (formDataList[i].itemsName == formDataList1[j].itemsName && i != j) {
            return (result = 2) // 返回2，字典名称重复
          }
        }
      }
      return result
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.dataVerification() == false) {
            this.$message({
              message: '请填写完整信息！',
              type: 'warning'
            })
            return null
          }

          var result = this.dataVerification1()
          if (result == 1) {
            // 返回1，字典编码重复
            this.$message({
              message: '请不要输入重复的字典编码！',
              type: 'warning'
            })
            return null
          }
          if (result == 2) {
            // 返回2，字典名称重复
            this.$message({
              message: '请不要输入重复的字典名称！',
              type: 'warning'
            })
            return null
          }

          this.formData.itemsList = this.formDataList
          this.loading = true
          updateDictionaries(this.formData)
            .then((response) => {
              this.$message.success('新增成功')
              this.$emit('reload')
              this.cancel()
            })
            .finally(() => {
              this.loading = false
            })
        }
      })
    },

    // 取消按钮
    cancel() {
      this.$emit('close', false)
    },

    /** 删除按钮操作 */
    handleDelete(row, rowIndex) {
      if (!row.dictionaryItemsId) {
        this.formDataList.splice(rowIndex, 1)
        return
      }
      this.$confirm('是否确认删除数据字典编号为"' + row.itemsCode + '"的数据项？', '', { type: 'warning' }).then(() => {
        delItems(row.dictionaryItemsId).then(() => {
          this.formDataList.splice(rowIndex, 1)
          this.$message.success('删除成功')
        })
      })
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