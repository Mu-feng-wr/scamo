
import { template } from 'xe-utils';
<template>
  <SectionCard title="数据权限">
    <vxe-grid
      ref="xTable"
      v-loading="tableLoading"
      height="500"
      header-align="center"
      align="center"
      :data="tableData"
      :border="true"
      :tree-config="{ children: 'children' }"
      :resizable="true"
      :columns="tableColumn"
      :row-key="true"
      stripe
      highlight-current-row
      row-id="id"
      class="vxeTable"
      @checkbox-all="handleMenuTreeAllChange"
      @checkbox-change="handleMenuTreeChange"
    >
      <template #jurisdiction="{ row }">
        <template v-if="row.children">
          <template v-for="(item, index) in dictDataList">
            <el-checkbox
              v-if="item.dictionaryCode === 'SysRole-dataScope'"
              :key="index"
              v-model="row.selecetedPermission"
              :indeterminate="row.indeterminate ? row.indeterminate.includes(item.dictionaryItemsId) : false"
              :true-label="item.dictionaryItemsId"
              :false-label="''"
              @change="checkboxChange($event,row)"
            >{{ item.itemsName }}</el-checkbox>
          </template>
        </template>
        <template v-else>
          <el-radio-group v-model="row.selecetedPermission" @change="changeRadio($event,row)">
            <template v-for="(item, index) in dictDataList">
              <el-radio v-if="item.dictionaryCode === 'SysRole-dataScope'" :key="index" :label="item.dictionaryItemsId">{{ item.itemsName }}</el-radio>
            </template>
          </el-radio-group>
        </template>
      </template>
    </vxe-grid>
  </SectionCard>
</template>

<script>
import { getRoleInfo } from '@/api/role.js'
import { getMenuTree } from '@/api/menu.js'
import { getRolePermByRoleIds } from '@/api/user.js'
export default {
  props: {
    dataListLoading: {
      type: Boolean,
      default: () => {
        return false
      }
    },

    permissionOptions: {
      type: Array,
      default: () => {
        return []
      }
    },
    dictDataList: {
      type: Array,
      default: () => {
        return []
      }
    },
    userId: {
      type: String,
      default: ''
    },
    roleIds: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      tableData: [],
      selecetedPermissionInit: false,
      isIndeterminate: false,
      checkAll: false,
      checkListsAll: [],
      tableLoading: false,
      tableColumn: [
        { field: 'label', title: '菜单名称', width: 250, treeNode: true, headerAlign: 'center', align: 'left' },
        { type: 'checkbox', width: 50, align: 'center' },
        { field: 'jurisdiction', title: '数据权限', minWidth: 250, slots: { default: 'jurisdiction' }, treeNode: true, align: 'left' }
      ],
      menuOptions: []
    }
  },
  watch: {
    roleIds: {
      handler() {
        this.menuOptions = []
        this.tableData = JSON.parse(JSON.stringify(this.menuOptions))
        if (this.roleIds.length > 0) {
          this.init()
        }
      },
      immediate: true
    }
  },
  methods: {
    async init() {
      this.tableLoading = true
      var menuTree = await getRolePermByRoleIds(this.roleIds.join())
      this.menuOptions = menuTree.data
      this.tableData = JSON.parse(JSON.stringify(this.menuOptions))
      this.tableLoading = false

      // this.tableLoading = true

      // var menuTree = await getMenuTree()
      // this.menuOptions = menuTree.data
      // this.tableData = JSON.parse(JSON.stringify(this.menuOptions))

      // this.tableLoading = false

      // if (this.editId) {
      //   this.tableLoading = true
      //   getRoleInfo(this.editId)
      //     .then((res) => {
      //       res.data.menuList.forEach((item) => {
      //         var data = this.tableData.find((temp) => temp.id == item.id)
      //         this.initMenuPermissionListRecursive(item, data)
      //       })
      //       this.selecetedPermissionInit = true
      //     })
      //     .finally(() => {
      //       this.tableLoading = false
      //     })
      // }
    },
    // 从后台获取数据，递归回显
    initMenuPermissionListRecursive(roleMenu, menuOptionsItem) {
      if (!roleMenu.leaf) {
        roleMenu.children.forEach((item) => {
          var data = menuOptionsItem.children.find((temp) => temp.id == item.id)
          this.initMenuPermissionListRecursive(item, data)
        })
        this.setSelectStatus(menuOptionsItem)
        return
      }
      if (roleMenu.data) {
        roleMenu.data.permissionList.forEach((item) => {
          this.$set(menuOptionsItem, 'selecetedPermission', item.rangeId)
          this.$refs.xTable.setCheckboxRow(menuOptionsItem, true)
        })
      }
      this.$refs.xTable.updateData()
      return
    },
    setSelectStatus(row) {
      // 子集 叶子数据
      var leafMenuData = row.children.filter((temp) => temp.leaf)
      // 子集 树干数据
      var boleMenuData = row.children.filter((temp) => !temp.leaf)

      // 仅存在叶子
      if (boleMenuData.length == 0) {
        // 叶子选中的数据
        var leafMenuSelect = leafMenuData.filter((temp) => temp.selecetedPermission).map((item) => item.selecetedPermission)
        // 如果选中的叶子和子集相等 并且只选中一个类型
        if (leafMenuSelect.length == row.children.length && Array.from(new Set(leafMenuSelect)).length == 1) {
          this.$set(row, 'selecetedPermission', Array.from(new Set(leafMenuSelect))[0])
          this.$set(row, 'indeterminate', [])
        } else {
          this.$set(row, 'indeterminate', Array.from(new Set(leafMenuSelect)))
          this.$set(row, 'selecetedPermission', '')
        }
      } else if (leafMenuData.length == 0) {
        // 仅存在 树干
        var selecetedPermissionListData = boleMenuData.filter((temp) => temp.selecetedPermission).map((temp) => temp.selecetedPermission)
        // // 判断全选是否和子集数量相等
        if (selecetedPermissionListData.length == row.children.length) {
          this.$set(row, 'selecetedPermission', selecetedPermissionListData[0])
          this.$set(row, 'indeterminate', [])
          return
        }
        var indeterminateData = []
        boleMenuData.forEach((temp) => {
          if (temp.selecetedPermission) {
            indeterminateData = [...indeterminateData, ...temp.selecetedPermission]
          } else if (temp.indeterminate && temp.indeterminate.length > 0) {
            indeterminateData = [...indeterminateData, ...temp.indeterminate]
          }
        })
        this.$set(row, 'indeterminate', Array.from(new Set(indeterminateData)))
        this.$set(row, 'selecetedPermission', '')
      } else {
        // 同时存在叶子和树干
        var checkBoxData = boleMenuData.filter((temp) => temp.selecetedPermission).map((temp) => temp.selecetedPermission)
        var radioData = leafMenuData.filter((temp) => temp.selecetedPermission).map((item) => item.selecetedPermission)
        var sum = checkBoxData.length + radioData.length
        if (sum == row.children.length && Array.from(new Set(radioData)).length == 1 && Array.from(new Set(checkBoxData)).length == 1 && checkBoxData[0] == radioData[0]) {
          this.$set(row, 'selecetedPermission', Array.from(new Set([...checkBoxData, ...radioData]))[0])
          this.$set(row, 'indeterminate', [])
        } else {
          var checkBoxSelect = []
          row.children.forEach((item) => {
            if (item.selecetedPermission) {
              checkBoxSelect = [...checkBoxSelect, ...[item.selecetedPermission]]
            } else if (item.indeterminate && item.indeterminate.length > 0) {
              checkBoxSelect = [...checkBoxSelect, ...item.indeterminate]
            }
          })
          this.$set(row, 'indeterminate', Array.from(new Set([...checkBoxSelect, ...radioData])))
          this.$set(row, 'selecetedPermission', '')
        }
      }
    },
    //  表头全选||取消全选
    handleMenuTreeAllChange({ records, checked }) {
      if (checked) {
        this.setChildrenSelect(this.tableData, checked)
      } else {
        this.tableData = JSON.parse(JSON.stringify(this.menuOptions))
      }
      console.log(this.tableData)
    },
    // 表格单选
    handleMenuTreeChange({ row, checked }) {
      if (row.leaf) {
        var deptData = this.dictDataList.find((item) => item.itemsName == '部门级' && item.dictionaryCode === 'SysRole-dataScope')
        this.$set(row, 'selecetedPermission', checked ? deptData.dictionaryItemsId : '')
        this.$refs.xTable.updateData()
      }

      if (row.children && row.children.length > 0) {
        this.setChildrenSelect(row.children, checked)
      } else if (row.parentId != 0) {
        this.setParentSelect(row.parentId)
      }
    },
    // 设置父级选中状态
    setParentSelect(parentId) {
      var row = this.$refs.xTable.getRowById(parentId)

      this.setSelectStatus(row)
      if (row.parentId != 0) {
        this.setParentSelect(row.parentId)
      }
    },
    // 设置子集选中状态
    setChildrenSelect(childrenList, checked) {
      childrenList.forEach((item) => {
        if (item.children && item.children.length > 0) {
          this.setChildrenSelect(item.children, checked)
        } else {
          var deptData = this.dictDataList.find((item) => item.itemsName == '部门级' && item.dictionaryCode === 'SysRole-dataScope')
          this.$set(item, 'selecetedPermission', checked ? (item.selecetedPermission ? item.selecetedPermission : deptData.dictionaryItemsId) : '')
          if (item.parentId != 0) {
            this.setParentSelect(item.parentId)
          }
        }
      })
    },
    // 数据权限  复选
    checkboxChange(checked, row) {
      row.children.forEach((item) => {
        if (item.children && item.children.length > 0) {
          this.checkboxChange(checked, item)
        } else {
          this.$refs.xTable.setCheckboxRow(row, !!checked)
          this.$set(item, 'indeterminate', [])
          this.$set(item, 'selecetedPermission', checked)
          if (item.parentId != 0) {
            this.setParentSelect(item.parentId)
          }
        }
      })
    },
    // 数据权限  复选
    changeRadio(radio, row) {
      this.$refs.xTable.setCheckboxRow(row, true)
      if (row.parentId) {
        this.setParentSelect(row.parentId)
      }
    },
    // 整理表格已选数据
    getSelectData() {
      var selectList = [...this.$refs.xTable.getCheckboxRecords(), ...this.$refs.xTable.getCheckboxIndeterminateRecords()]
      var menuIdList = []
      var permissionList = []

      selectList.forEach((item) => {
        if (item.id) {
          menuIdList.push(item.id)
        }
        if (item.leaf && item.selecetedPermission) {
          permissionList.push({
            menuId: item.id,
            permissionId: item.selecetedPermission
          })
        }
      })
      console.log(selectList)
      return { menuIdList, permissionList }
    }
  }
}
</script>
<style lang="scss" scoped src="@/styles/vxeTable.scss"></style>
