<template>
  <div>
    <el-table :data="menus" style="width: 100%; margin-bottom: 20px" height="800px" row-key="id" border :select-on-indeterminate="true" ref="multipleTable">
      <el-table-column prop="label" header-align="center" align="left" sortable width="400" label="菜单名称">
        <template slot-scope="scope">{{ scope.row.label }}</template>
      </el-table-column>
      <el-table-column width="100" align="center">
        <template slot-scope="scope">
          <el-checkbox :indeterminate="scope.row.indeterminate" v-model="scope.row.checked" @change="rowCheckChange($event,scope.row)"></el-checkbox>
          {{ scope.row.checked }}
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" min-width="300" label="数据范围">
        <template slot-scope="scope">
          <el-checkbox-group v-model="scope.row.selectedList" @change="handleCheckedPerChange($event,scope.row)" v-if="scope.row.type !== 2">
            <el-checkbox v-for="(item, index) in checkLists" :label="item.id" :key="index">{{ item.text }}</el-checkbox>
          </el-checkbox-group>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import index from './index.js'
export default {
  data() {
    return {
      checkLists: [
        { id: 'c60309b357254f229fa1b3f596e966fc', text: '全部' },
        { id: '4a9dd3372bd94e9387a3e195fd23c4b8', text: '所在公司' },
        { id: '7946f76ec4ef4e0bb42227a7fb6271fb', text: '所在组织所属党支部' },
        { id: '15b6c091c6a44dbba0652a41d82bb030', text: '所在组织' },
        { id: '371cc6595d2a4d23a356c0b107cce3ef', text: '所在项目' },
        { id: '286c98b7c9bd4642b02ee57b949b0962', text: '个人新增' }
      ]
    }
  },
  mixins: [index],
  created() {
    console.log(this.menuOptions, this.menus)
    this.menus = this.init(this.menuOptions, this.menus)
    this.initMenuPermissionListRecursive(this.menus)
  },
  methods: {
    init(menuOptions, menus) {
      return menus.map((item) => {
        let index = menuOptions.findIndex((temp) => item.id == temp.id)
        if (index >= 0) {
          item.selectedList = menuOptions[index].selectedList
          if (menuOptions[index].children && menuOptions[index].children.length > 0) {
            item.children = this.init(item.children, menuOptions[index].children)
          } else {
            item.checked = true
          }
        }
        return item
      })
    },
    initMenuPermissionListRecursive(menus) {
      menus.forEach((item) => {
        if (item.children && item.children.length > 0) {
          this.initMenuPermissionListRecursive(item.children)
        } else if (item.parentId) {
          this.setSelectStatus(item)
        }
      })
    },
    setSelectStatus(row) {
      let parentData = this.getParentData(this.menus, row.parentId)
      // 可能存在找不到父级的情况
      if (!parentData) {
        return
      }
      // 子集 叶子数据
      let leafMenuData = parentData.children.filter((temp) => !temp.children || temp.children.length == 0)
      // 子集 树干数据
      let boleMenuData = parentData.children.filter((temp) => temp.children && temp.children.length > 0)

      // 仅存在叶子
      if (boleMenuData.length == 0) {
        let checkedList = leafMenuData.filter((item) => item.checked == true)
        if (leafMenuData.length > 0 && checkedList.length == leafMenuData.length) {
          parentData.checked = true
          parentData.indeterminate = false
        } else if (leafMenuData.length > 0 && checkedList.length > 0 && checkedList.length < leafMenuData.length) {
          parentData.checked = true
          parentData.indeterminate = true
        } else {
          parentData.checked = false
          parentData.indeterminate = false
        }
      }
      //仅存在树干
      else if (leafMenuData.length == 0) {
        let checkedList = boleMenuData.filter((item) => item.checked == true)
        if (boleMenuData.length > 0 && checkedList.length == boleMenuData.length) {
          parentData.checked = true
          parentData.indeterminate = false
        } else if (boleMenuData.length > 0 && checkedList.length > 0 && checkedList.length < boleMenuData.length) {
          parentData.checked = true
          parentData.indeterminate = true
        } else {
          parentData.checked = false
          parentData.indeterminate = false
        }
      }
      //同时存在叶子和树干
      else if (boleMenuData.length > 0 && leafMenuData.length > 0) {
        let leafCheckedList = leafMenuData.filter((item) => item.checked == true)
        let boleCheckedList = boleMenuData.filter((item) => item.checked == true)
        let checkNum = leafCheckedList.length + boleCheckedList.length
        if (parentData.children.length > 0 && checkNum == parentData.children.length) {
          parentData.checked = true
          parentData.indeterminate = false
        } else if (parentData.children.length > 0 && checkNum > 0 && checkNum < parentData.children.length) {
          parentData.checked = true
          parentData.indeterminate = true
        } else {
          parentData.checked = false
          parentData.indeterminate = false
        }
      }

      if (parentData.parentId) {
        this.setSelectStatus(parentData)
      }
    },

    getParentData(menus, parentId, parentData) {
      for (let i in menus)
        if (menus[i].id == parentId) {
          parentData = menus[i]
          break
        } else {
          if (menus[i].children && menus[i].children.length > 0) {
            parentData = this.getParentData(menus[i].children, parentId, parentData)
            if (parentData) {
              break
            }
          }
        }

      return parentData
    },
    rowCheckChange(value, row) {
      row.indeterminate = false
      if (!value && row.type != 2) {
        row.selectedList = []
      }
      if (row.children && row.children.length) {
        this.setRowChildrenChecked(row.children, value)
      }
      if (row.parentId) {
        this.setSelectStatus(row)
      }
    },
    setRowChildrenChecked(list, value) {
      list.forEach((item) => {
        if (item.children && item.children.length) {
          this.setRowChildrenChecked(item.children, value)
        }
        item.checked = value
        item.indeterminate = false
      })
    },
    handleCheckedPerChange(value, row) {
      if (value.length > 0) {
        this.$set(row, 'selectedList', [value[value.length - 1]])
      }
    }
  }
}
</script>

<style>
</style>