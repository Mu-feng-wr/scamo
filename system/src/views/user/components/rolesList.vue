<template>
  <SectionCard title="角色列表">
    <h3 class="header-flex">
      <span class="mr-20">授权角色</span>
      <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
    </h3>
    <div class="roleBox">
      <el-checkbox-group v-model="checkListsAll" @change="handleCheckedCitiesChange">
        <el-checkbox v-for="(item, index) in checkLists" :key="index" :label="item.roleId">{{ item.roleName }}</el-checkbox>
      </el-checkbox-group>
    </div>
  </SectionCard>
</template>

<script>
// getUserRole
import { getAllRole } from '@/api/user.js'
export default {
  props: {
    userId: {
      type: String,
      default: ''
    },
    roleIds: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      checkAll: false,
      checkListsAll: [],
      isIndeterminate: false,
      checkLists: []
    }
  },
  watch: {
    roleIds: {
      handler() {
        if (this.roleIds.length > 0) {
          this.setCheckListsAll()
        }
      },
      immediate: true
    }
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      var checkLists = await getAllRole()
      this.checkLists = checkLists.data
    },
    setCheckListsAll() {
      if (this.userId && this.roleIds) {
        this.checkListsAll = this.roleIds.split(',')
        if (this.checkListsAll.length > 0 && this.checkListsAll.length == this.checkLists.length) {
          this.checkAll = true
        } else if (this.checkListsAll.length > 0 && this.checkListsAll.length < this.checkLists.length) {
          this.isIndeterminate = true
        }
      }
    },
    handleCheckAllChange(val) {
      this.isIndeterminate = false
      this.checkListsAll = []
      if (val) {
        this.checkListsAll = this.checkLists.map((item) => item.roleId)
      }
      this.$emit('reloadPermissions', this.checkListsAll)
    },
    handleCheckedCitiesChange() {
      this.checkAll = false
      this.isIndeterminate = false
      if (this.checkListsAll.length > 0 && this.checkListsAll.length == this.checkLists.length) {
        this.checkAll = true
      } else if (this.checkListsAll.length > 0 && this.checkListsAll.length < this.checkLists.length) {
        this.isIndeterminate = true
      }
      this.$emit('reloadPermissions', this.checkListsAll)
    }
  }
}
</script>

<style lang="scss" scoped>
.roleBox {
  border: 1px solid #dfe6ec;

  .el-checkbox-group {
    .el-checkbox {
      width: 33.3%;
      margin-right: 0;
      padding: 10px;
      border-bottom: 1px solid #dfe6ec;
      border-right: 1px solid #dfe6ec;
      margin-bottom: -1px;
    }
  }
}
</style>