<template>
  <el-dialog :title="title" :visible.sync="openView" width="680px" append-to-body @close="cancel">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="菜单名称" prop="menuName">
            <el-input v-model="form.menuName" placeholder="请输入菜单名称" maxlength="50" show-word-limit />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="英文名称" prop="enName">
            <el-input v-model="form.enName" placeholder="请输入英文名称" maxlength="50" show-word-limit />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="上级菜单" prop="parentId">
            <treeselect v-model="form.parentId" :options="menuOptions" :normalizer="normalizer" :show-count="true" placeholder="选择上级菜单" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="菜单类型" prop="menuType">
            <el-radio-group v-model="form.menuType" :disabled="this.typeDisable">
              <el-radio v-for="item in menuTypeList" :label="item.itemsValue" :key="item.itemsValue">{{ item.itemsName }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="form.menuType != 'F'">
          <el-form-item label="菜单地址" prop="path">
            <el-input v-model="form.path" placeholder="请输入菜单地址" maxlength="200" show-word-limit />
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="form.menuType == 'C'">
          <el-form-item prop="component">
            <span slot="label">
              <el-tooltip content="访问的菜单URL，如：`system/user/index`，默认在`views`目录下" placement="top">
                <i class="el-icon-question"></i>
              </el-tooltip>菜单URL
            </span>
            <el-input v-model="form.component" placeholder="请输入菜单URL" maxlength="200" show-word-limit />
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="form.menuType != 'M'">
          <el-form-item prop="perms">
            <el-input v-model="form.perms" placeholder="请输入授权标识" maxlength="500" show-word-limit />
            <span slot="label">
              <el-tooltip content="控制器中定义的授权标识，如：@PreAuthorize(`@ss.hasPermi('system:user:list')`)" placement="top">
                <i class="el-icon-question"></i>
              </el-tooltip>授权标识
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="form.menuType != 'F'">
          <el-form-item label="菜单图标" prop="icon">
            <el-popover placement="bottom-start" width="460" trigger="click" @show="$refs['iconSelect'].reset()">
              <IconSelect ref="iconSelect" @selected="selected" />
              <el-input slot="reference" v-model="form.icon" placeholder="点击选择图标">
                <svg-icon v-if="form.icon" slot="prefix" :icon-class="form.icon" class="el-input__icon" style="height: 32px; width: 16px" />
                <i v-else slot="prefix" class="el-icon-search el-input__icon" />
              </el-input>
            </el-popover>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="排序" prop="orderNum">
            <el-input-number v-model="form.orderNum" controls-position="right" :min="0" style="width: 100%" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注">
            <el-input v-model="form.remark" rows="2" type="textarea" placeholder="请输入内容" maxlength="500" show-word-limit></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="form.menuType != 'F'">
          <el-form-item prop="status">
            <span slot="label">
              <el-tooltip content="选择停用则路由将不会出现在侧边栏，也不能被访问" placement="top">
                <i class="el-icon-question"></i>
              </el-tooltip>状态
            </span>
            <el-select v-model="form.status">
              <el-option v-for="item in statusList" :key="item.itemsValue" :label="item.itemsName" :value="item.itemsValue"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="form.menuType == 'C'">
          <el-form-item label="是否显示首页" prop="ynHome">
            <el-radio-group v-model="form.ynHome">
              <el-radio v-for="item in ynHomeList" :label="item.itemsValue" :key="item.itemsValue">{{ item.itemsName }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer" align="center">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
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
  methods: {
    cancel() {
      this.$emit('close', false)
    }
  }
}
</script>

<style>
</style>