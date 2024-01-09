<template>
  <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
    <el-form ref="form" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="字典唯一标识" prop="code">
        <el-input v-model="form.code" placeholder="请输入字典编号" />
      </el-form-item>
      <el-form-item label="字典名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入字典名称" />
      </el-form-item>
      <el-form-item label="字典值" prop="value">
        <el-input v-model="form.value" placeholder="请输入字典值" />
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input v-model="form.sort" placeholder="请输入排序" />
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" rows="4" v-model="form.remark" clearable placeholder="备注" maxlength="500" show-word-limit style="width: 100%"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="form.status" placeholder="状态" style="width: 100%">
          <el-option v-for="item in statusList" :key="item.itemsValue" :label="item.itemsName" :value="item.itemsValue"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" align="center">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {}
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