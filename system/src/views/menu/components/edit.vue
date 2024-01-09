<template>
  <vxe-modal v-model="openView" :title="title" width="680px" height="90%" show-footer esc-closable resize @hide="cancel" @close="cancel">
    <el-form ref="form" v-loading="loading" class="p-20" :model="formData" :rules="rules" label-width="100px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="菜单名称" prop="menuName">
            <el-input v-model="formData.menuName" placeholder="请输入菜单名称" maxlength="50" show-word-limit />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="英文名称" prop="enName">
            <el-input v-model="formData.enName" placeholder="请输入英文名称" maxlength="50" show-word-limit />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="上级菜单" prop="parentId">
            <el-tree-select
              ref="treeSelect"
              v-model="formData.parentId"
              node-key="menuId"
              :props="{label:'menuName'}"
              check-strictly
              check-half
              :data="menuOptions"
              filterable
              popper-append-to-body
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="菜单类型" prop="menuType">
            <el-radio-group v-model="formData.menuType" :disabled="typeDisable">
              <template v-for="item in dictDataList">
                <el-radio v-if="item.dictionaryCode == 'SysMenu-menuType'" :key="item.itemsValue" :label="item.itemsValue">{{ item.itemsName }}</el-radio>
              </template>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col v-if="formData.menuType != 'F'" :span="24">
          <el-form-item label="菜单地址" prop="path">
            <el-input v-model="formData.path" placeholder="请输入菜单地址" maxlength="200" show-word-limit />
          </el-form-item>
        </el-col>
        <el-col v-if="formData.menuType == 'C'" :span="24">
          <el-form-item prop="component">
            <span slot="label">
              <el-tooltip content="访问的菜单URL，如：`system/user/index`，默认在`views`目录下" placement="top">
                <i class="el-icon-question"></i>
              </el-tooltip>菜单URL
            </span>
            <el-input v-model="formData.component" placeholder="请输入菜单URL" maxlength="200" show-word-limit />
          </el-form-item>
        </el-col>
        <el-col v-if="formData.menuType != 'M'" :span="24">
          <el-form-item prop="perms">
            <el-input v-model="formData.perms" placeholder="请输入授权标识" maxlength="500" show-word-limit />
            <span slot="label">
              <el-tooltip content="控制器中定义的授权标识，如：@PreAuthorize(`@ss.hasPermi('system:user:list')`)" placement="top">
                <i class="el-icon-question"></i>
              </el-tooltip>授权标识
            </span>
          </el-form-item>
        </el-col>
        <el-col v-if="formData.menuType != 'F'" :span="24">
          <el-form-item label="菜单图标" prop="icon">
            <el-popover placement="bottom-start" width="460" trigger="click" @show="$refs['iconSelect'].reset()">
              <IconSelect ref="iconSelect" @selected="selected" />
              <el-input slot="reference" v-model="formData.icon" placeholder="点击选择图标">
                <svg-icon v-if="formData.icon" slot="prefix" :icon-class="formData.icon" class="el-input__icon" style="height: 32px; width: 16px" />
                <i v-else slot="prefix" class="el-icon-search el-input__icon"></i>
              </el-input>
            </el-popover>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="排序" prop="orderNum">
            <el-input-number v-model="formData.orderNum" controls-position="right" :min="0" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注">
            <el-input v-model="formData.remark" rows="2" type="textarea" placeholder="请输入内容" maxlength="500" show-word-limit />
          </el-form-item>
        </el-col>
        <el-col v-if="formData.menuType != 'F'" :span="24">
          <el-form-item prop="status">
            <span slot="label">
              <el-tooltip content="选择停用则路由将不会出现在侧边栏，也不能被访问" placement="top">
                <i class="el-icon-question"></i>
              </el-tooltip>状态
            </span>
            <base-input :value.sync="formData.status" :options-list="dictDataList" base-code="System-status" placeholder="请选择状态" clearable />
          </el-form-item>
        </el-col>
        <el-col v-if="formData.menuType == 'C'" :span="12">
          <el-form-item label="是否显示首页" prop="ynHome">
            <el-radio-group v-model="formData.ynHome">
              <template v-for="item in dictDataList">
                <el-radio v-if="item.dictionaryCode == 'SysMenu-ynHome'" :key="item.itemsValue" :label="item.itemsValue">{{ item.itemsName }}</el-radio>
              </template>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" align="center">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </vxe-modal>
</template>

<script>
import { getMenu, addMenu, updateMenu } from '@/api/menu.js'
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
    },
    tableData: {
      type: Array,
      default: () => {
        return []
      }
    },
    rowData: {
      type: [String, Object],
      default: ''
    }
  },
  data() {
    return {
      loading: false,
      formData: {
        orderNum: 0,
        status: '1',
        ynHome: '0',
        menuType: 'M'
      },
      typeDisable: false,
      rules: {
        menuName: [{ required: true, message: '菜单名称不能为空', trigger: 'change' }],
        orderNum: [{ required: true, message: '菜单顺序不能为空', trigger: 'change' }],
        parentId: [{ required: true, message: '上级菜单不能为空', trigger: 'change' }],
        menuType: [{ required: true, message: '菜单类型不能为空', trigger: 'change' }],
        icon: [{ required: true, message: '菜单图标不能为空', trigger: 'change' }],
        path: [{ required: true, message: '菜单地址不能为空', trigger: 'change' }]
      }
    }
  },
  computed: {
    title() {
      return this.editId ? '修改菜单' : '添加菜单'
    },
    menuOptions() {
      return [{ menuId: 0, menuName: '主类目', children: this.tableData }]
    }
  },
  created() {
    if (this.rowData) {
      this.formData = {
        ...this.formData,
        parentId: this.rowData.menuId
      }
      if (this.rowData.menuType == 'M') {
        this.formData.menuType = 'C'
      } else {
        this.formData.menuType = 'F'
      }
    }
    if (this.editId) {
      this.init()
    }
  },
  methods: {
    init() {
      this.loading = true
      getMenu(this.editId)
        .then((res) => {
          this.formData = res.data
        })
        .finally(() => {
          this.loading = false
        })
    },
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (!this.editId) {
            updateMenu(this.formData).then((response) => {
              this.$message.success('修改成功')
              this.$emit('reload')
              this.cancel()
            })
          } else {
            addMenu(this.formData).then((response) => {
              this.$message.success('新增成功')
              this.$emit('reload')
              this.cancel()
            })
          }
        }
      })
    },
    selected(name) {
      this.$set(this.formData, 'icon', name)
    },
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