<template>
  <PageCard v-loading="loading" :return-url="returnUrl">
    <el-form ref="form" label-width="100px" class="form-table" style="margin-bottom: 8px">
      <SectionCard title="角色信息">
        <el-row>
          <el-col :span="8">
            <el-form-item label="角色名称">{{ formData.roleName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="角色标识">{{ formData.roleKey }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="排序">{{ formData.roleSort }}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="状态">
              <dictDateView :value="formData.status" :dict-data-list="dictDataList" dict-code="System-status" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注">{{ formData.remark }}</el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
    </el-form>
    <dataPermissions ref="dataPermissions" :dict-data-list="dictDataList" :edit-id="editId" />
  </PageCard>
</template>

<script>
import { getSystemRole } from '@/api/role.js'
import { listDictItems } from '@/api/base.js'
import dataPermissions from '../components/dataPermissions.vue'
export default {
  components: {
    dataPermissions
  },
  data() {
    return {
      returnUrl: '/system/role',
      loading: false,
      formData: {},
      editId: '',
      dictDataList: []
    }
  },
  created() {
    this.getDictData()
    this.editId = this.$route.query.id
    if (this.editId) {
      this.init()
    }
  },
  methods: {
    init() {
      this.loading = true
      getSystemRole(this.editId)
        .then((res) => {
          this.formData = res.data
        })
        .finally(() => {
          this.loading = false
        })
    },

    getDictData() {
      var dictCodes = 'System-status' // 系统-状态
      dictCodes += ',SysRole-dataScope' // 角色信息-数据权限
      listDictItems(dictCodes).then((res) => {
        this.dictDataList = res.sysDictionaryItemsList
      })
    }
  }
}
</script>
