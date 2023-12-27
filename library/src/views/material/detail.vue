<template>
  <PageCard v-loading="submitLoading" :return-url="returnUrl">
    <el-form ref="form" label-width="160px" class="form-table">
      <SectionCard title="基本信息">
        <el-row>
          <el-col :span="8">
            <el-form-item label="物资编号">{{ formData.materialCode }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="物资名称">
              <el-tooltip class="item" effect="dark" :content="formData.materialName" placement="top">
                <div class="u-line-1">{{ formData.materialName }}</div>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="物资分类">{{ formData.categoryName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="序列号">
              <el-tooltip class="item" effect="dark" :content="formData.sn" placement="top">
                <div class="u-line-1">{{ formData.sn }}</div>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="规格型号">
              <el-tooltip class="item" effect="dark" :content="formData.modelType" placement="top">
                <div class="u-line-1">{{ formData.modelType }}</div>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="品牌名称">{{ formData.brandName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="颜色">{{ formData.color }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="计量单位">{{ formData.unitName }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="不含税单价（元）">{{ $vxe.commafy(formData.price, { digits: 8 }) }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="含税单价（元）">{{ $vxe.commafy(formData.price, { digits: 8 }) }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="税率（%）">{{ formData.taxRate }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="税额（元）">{{ $vxe.commafy(formData.taxValue, { digits: 2 }) }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="创建时间">{{ formData.createDate }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="备用数量">{{ formData.deadStorage }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="状态">
              <dictDateView :value="formData.shelfStatus" :dict-data-list="dictDataList" dict-code="System-status" />
            </el-form-item>
          </el-col>
        </el-row>
      </SectionCard>

      <SectionCard title="扩展信息" class="mt-8">
        <el-row>
          <el-col :span="8">
            <el-form-item label="换算数量">{{ formData.alterUnitNum }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="换算单位">
              <el-tooltip class="item" effect="dark" :content="formData.alterUnitName" placement="top">
                <div class="u-line-1">{{ formData.alterUnitName }}</div>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="物资类型">
              <dictDateView :value="formData.materialType" :dict-data-list="dictDataList" dict-code="StlMaterial-materialType" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="业务归口">{{ formData.centralizedBusinessName }}</el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item label="是否公开">
              <dictDateView :value="formData.ynPublic" :dict-data-list="dictDataList" dict-code="StlMaterial-ynPublic" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="是否招标">
              <dictDateView :value="formData.ynInviteTender" :dict-data-list="dictDataList" dict-code="StlMaterial-ynInviteTender" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="上架状态">
              <dictDateView :value="formData.shelfStatus" :dict-data-list="dictDataList" dict-code="StlMaterial-shelfStatus" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-tooltip class="item" :offset="100" effect="dark" :content="formData.remarks" placement="top">
                <div class="u-line-1">{{ formData.remarks }}</div>
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>
      </SectionCard>
    </el-form>
  </PageCard>
</template>
<script>
import { getMaterial } from '@/api/material.js'
import { listDictItems, listTypeQuery, listBrandQuery } from '@/api/base.js'
export default {
  data() {
    return {
      returnUrl: '/library/material',
      // 提交加载
      submitLoading: false,
      editId: '',
      dictDataList: [],
      formData: {}
    }
  },
  created() {
    this.getSysDictionaryList()
    this.editId = this.$route.query.id
    if (this.editId) {
      this.init()
    }
  },
  methods: {
    init() {
      this.submitLoading = true
      getMaterial(this.editId)
        .then((res) => {
          this.formData = {
            ...res.data
          }
        })
        .finally(() => {
          this.submitLoading = false
        })
    },
    // 获取字典数据
    getSysDictionaryList() {
      var dictCodes = 'System-status' /** 系统-状态 */
      dictCodes += ',StlMaterial-shelfStatus' /** 上架状态 */
      dictCodes += ',StlMaterial-ynPublic' /** 是否公开 */
      dictCodes += ',StlMaterial-materialType' /** 物资类型 */
      dictCodes += ',StlMaterial-ynInviteTender' /** 是否招标 */
      listDictItems(dictCodes).then((res) => {
        this.dictDataList = res.sysDictionaryItemsList
      })
    }
  }
}
</script>
