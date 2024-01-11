<template>
  <div class="container" @scroll="handleScroll">
    <div class="app-container" style="background: transparent; padding: 0; position: relative" v-loading="loading">
      <div class="buyBox">
        <div class="buyMain">
          <div class="buyContent">
            <div class="item-title">助力打造全方位SAAS云数字资产管理中台</div>
            <div class="item-subtitle">
              <span>更经济</span>
              <i class="circle"></i>
              <span>更简单</span>
              <i class="circle"></i>
              <span>更安全</span>
              <i class="circle"></i>
              <span>更成熟</span>
              <i class="circle"></i>
              <span>更先进</span>
              <i class="circle"></i>
              <span>更精细</span>
              <i class="circle"></i>
              <span>更灵活</span>
              <i class="circle"></i>
              <span>更极致</span>
            </div>
          </div>
        </div>
      </div>
      <div class="buy-tip">可以根据您团队的规模与业务需求，选择相应的版本</div>
      <div ref="fixedDiv" class="memberWrap">
        <el-row>
          <el-col :span="6" style="opacity: 0">
            <el-card></el-card>
          </el-col>
          <el-col :span="6" v-for="(item, index) in saleList" :key="index">
            <el-card class="member">
              <div class="member-title">
                <div class="member-section">
                  <img :src="getImg(item.versionCode)" />
                  <span class="title">{{ item.versionName }}</span>
                </div>
                <div class="action" v-if="item.status != 1">已购买，到期日期2025年12月</div>
              </div>
              <div class="member-body">
                <div class="item-subtitle">{{ item.versionTitle }}</div>
                <div class="item-text">{{ item.subTitle }}</div>
                <div class="buyAction">
                  <el-button>了解详情</el-button>
                  <el-button
                    @click="applicationTrial(item.versionSaleId)"
                    v-if="trialButtonText !== '' && (trialVersionId == '' || item.versionSaleId == trialVersionId)"
                    :class="index == 0 ? 'level1' : index == 1 ? 'level2' : 'level3'"
                  >{{ trialButtonText }}</el-button>
                  <el-button @click="goMall" v-if="item.status == 1" :class="index == 0 ? 'level1' : index == 1 ? 'level2' : 'level3'">立即购买</el-button>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <div class="saleBox">
        <div v-for="(item, index) in capabilityList" :key="index" class="sale-item">
          <div class="text-left section-title">
            <i></i>
            {{ item.serviceName }}
          </div>
          <el-row :gutter="20" v-for="(sitem, sindex) in item.children" :key="sindex" class="sitem">
            <el-col :span="6" class="text-left">
              <div class="subTitle">{{ sitem.serviceName }}</div>
            </el-col>
            <el-col :span="6">
              <i class="el-icon-circle-check" v-if="sitem.silverStatus == '1'"></i>
              <i class="el-icon-circle-close" v-else-if="sitem.silverStatus == null && sitem.silverConfig == null"></i>
              <i class="el-icon-circle-close" v-else></i>
            </el-col>
            <el-col :span="6">
              <i class="el-icon-circle-check" v-if="sitem.metalsStatus == '1'"></i>
              <i class="el-icon-circle-close" v-else></i>
            </el-col>
            <el-col :span="6">
              <i class="el-icon-circle-check" v-if="sitem.skyStatus == '1'"></i>
              <i class="el-icon-circle-close" v-else></i>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>

    <router-view></router-view>
  </div>
</template>

<script>
import { listVersion, getVersion, delVersion, addVersion, updateVersion } from '@/api/version.js'
import { findSelfTrial, createExperienceOrder } from '@/api/order.js'
import { listSale } from '@/api/sale.js'
import { listCapability, selectServiceCapabilitySaleList } from '@/api/capability.js'
import levelIcon1 from '@/assets/images/img/ycb.png'
import levelIcon2 from '@/assets/images/img/jcb.png'
import levelIcon3 from '@/assets/images/img/tcb.png'
import yuanIcon from '@/assets/images/img/yuanIcon.png'

export default {
  name: 'Version',
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 订购版本信息表格数据
      versionList: [],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        versionSaleId: null,
        customerId: null,
        orderDate: null,
        annualPurchaseVolume: null,
        includTaxPrice: null,
        taxValue: null,
        taxRate: null,
        subtotalAmount: null,
        payDate: null,
        ynFinishPay: null,
        versionExpirationDate: null,
        unifiedSystemNumber: null,
        remarks: null,
        createDate: null,
        updateDate: null,
        status: null
      },
      trialVersionId: '',
      trialButtonText: '申请试用',
      // 表单参数
      form: {},
      // 表单校验
      rules: {},

      // 在售版本信息表格数据
      saleList: [],
      // 服务能力信息表格数据
      capabilityList: [],
      levelIcon1,
      levelIcon2,
      levelIcon3,
      yuanIcon,
      query: {
        pageNum: 1,
        pageSize: 1000
      }
    }
  },
  created() {
    this.getList()
    this.showTrialHandel()
  },
  methods: {
    showTrialHandel() {
      findSelfTrial().then((response) => {
        this.trialButtonText = response.data ? (response.data.ynFinishPay ? '' : '试用申请审核中') : '申请体验'
        this.trialVersionId = response.data ? response.data.versionSaleId : ''
      })
    },
    goMall() {
      this.$router.push({
        name: 'ordering-mall'
      })
    },
    handleScroll(event) {
      console.log(123)
      let scrollTop = event.target.scrollTop
      if (scrollTop > 150) {
        this.$refs.fixedDiv.classList.add('fixed-memberWrap')
      } else {
        this.$refs.fixedDiv.classList.remove('fixed-memberWrap')
      }
    },
    getImg(v) {
      let img = ''
      switch (v) {
        case '01':
          img = this.levelIcon1
          break
        case '02':
          img = this.levelIcon2
          break
        case '03':
          img = this.levelIcon3
          break

        default:
          break
      }
      return img
    },
    applicationTrial(versionSaleId) {
      createExperienceOrder(versionSaleId).then((response) => {
        let orderInfo = response.data
        if (orderInfo.ynFinishPay) {
          this.$message.success('感谢您的申请! 试用体验资格已审核通过! ')
        } else {
          this.$message.success('感谢您的申请! 请耐心等待客服审核,谢谢! ')
        }
      })
    },
    /** 查询订购版本信息列表 */
    getList() {
      this.loading = true
      listVersion(this.queryParams).then((response) => {
        this.versionList = response.rows
        this.total = response.total
        this.loading = false
      })
      listSale(this.query).then((response) => {
        this.saleList = response.rows
      })
      selectServiceCapabilitySaleList(this.query).then((response) => {
        let tempList = response.rows
        let oneList = []
        tempList.forEach((item) => {
          if (!item.parentId) {
            oneList.push(item)
          }
        })
        for (let i = 0; i < oneList.length; i++) {
          const item = oneList[i]
          item.children = []
          for (let j = 0; j < tempList.length; j++) {
            const item2 = tempList[j]
            if (item.serviceCapabilityId == item2.parentId) {
              item.children.push(item2)
            }
          }
        }
        this.capabilityList = oneList
        console.log(oneList)
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        orderVersionId: null,
        versionSaleId: null,
        customerId: null,
        orderDate: null,
        annualPurchaseVolume: null,
        includTaxPrice: null,
        taxValue: null,
        taxRate: null,
        subtotalAmount: null,
        payDate: null,
        ynFinishPay: null,
        versionExpirationDate: null,
        unifiedSystemNumber: null,
        remarks: null,
        delFlag: null,
        createDate: null,
        createBy: null,
        updateDate: null,
        updateBy: null,
        status: null
      }
      this.resetForm('form')
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm('queryForm')
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.orderVersionId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.open = true
      this.title = '添加订购版本信息'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      const orderVersionId = row.orderVersionId || this.ids
      getVersion(orderVersionId).then((response) => {
        this.form = response.data
        this.open = true
        this.title = '修改订购版本信息'
      })
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.orderVersionId != null) {
            updateVersion(this.form).then((response) => {
              this.$modal.msgSuccess('修改成功')
              this.open = false
              this.getList()
            })
          } else {
            addVersion(this.form).then((response) => {
              this.$modal.msgSuccess('新增成功')
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const orderVersionIds = row.orderVersionId || this.ids
      this.$modal
        .confirm('是否确认删除订购版本信息编号为"' + orderVersionIds + '"的数据项？')
        .then(function () {
          return delVersion(orderVersionIds)
        })
        .then(() => {
          this.getList()
          this.$modal.msgSuccess('删除成功')
        })
        .catch(() => {})
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        'memberc/version/export',
        {
          ...this.queryParams
        },
        `version_${new Date().getTime()}.xlsx`
      )
    }
  }
}
</script>


<style lang="scss" scoped >
.container {
  height: 100%;
  overflow: auto;
}
.app-main {
  height: inherit;
}
.buyBox {
  border-radius: 4px;
  position: relative;
  height: 300px;
  width: 100%;
  background-color: #fbfbfb;
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url('~@/assets/images/img/Bg.png');
  margin-bottom: 40px;

  .buyMain {
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;

    .item-title {
      font-size: 38px;
      font-family: PingFang SC-Semibold, PingFang SC;
      font-weight: 600;
      color: #ffe5c4;
      line-height: 33px;
      padding-bottom: 25px;
      letter-spacing: 2px;
    }

    .item-subtitle {
      font-size: 20px;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;

      .circle {
        width: 4px;
        height: 4px;
        background: rgba(255, 255, 255, 0.6);
        opacity: 1;
        display: inline-block;
        border-radius: 10px;
        margin: 0 12px;
      }
    }
  }
}
.buy-tip {
  font-size: 16px;
  font-family: PingFang SC-Regular, PingFang SC;
  font-weight: 400;
  color: #7a7f8e;
  margin-bottom: 12px;
  padding-left: 10px;
}
.memberWrap {
  position: absolute;
  top: 250px;
  left: 10px;
  right: 10px;
  z-index: 11;
}
.saleBox {
  .sale-item {
    text-align: center;
    box-shadow: none !important;
    border: 0;
    padding: 10px 20px 20px;
    background: #ffefe7;
    margin-bottom: 12px;
    border-radius: 4px 4px 4px 4px;

    .section-title {
      position: relative;
      padding-left: 32px;
      line-height: 2.4;
      font-size: 20px;
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: #ff630b;
      margin-bottom: 6px;

      i {
        position: absolute;
        content: '';
        left: 0;
        top: 50%;
        width: 24px;
        height: 24px;
        transform: translateY(-50%);
        display: inline-block;
        vertical-align: middle;
        background-image: url('~@/assets/images/img/saleIcon1.png');
      }
    }

    &:nth-child(even) {
      background: #e9f0ff;

      .section-title {
        color: #236dff;

        i {
          background-image: url('~@/assets/images/img/saleIcon2.png');
        }
      }
    }

    &:nth-child(3n) {
      background: #faedef;

      .section-title {
        color: #ff4245;

        i {
          background-image: url('~@/assets/images/img/saleIcon3.png');
        }
      }
    }

    &:nth-child(4n) {
      background: #fff7e7;

      .section-title {
        color: #faad14;

        i {
          background-image: url('~@/assets/images/img/saleIcon4.png');
        }
      }
    }

    .el-card__body {
      padding: 0;
    }

    .sale-title {
      padding: 6px;
      background-color: rgba(249, 249, 249, 1);
      border: 1px solid rgba(233, 233, 233, 1);
      border-radius: 4px 4px 0 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: bold;
      color: #666;

      img {
        width: 50px;
        margin-right: 6px;
      }
    }

    .sale-body {
      padding: 12px;
      font-size: 14px;

      > div {
        padding: 10px 0;
      }

      .buyBtn {
        color: #d4237a;

        img {
          width: 50px;
          display: block;
          margin: auto;
        }
      }
    }

    .sitem {
      background: #fff;

      .el-col-6 {
        padding-top: 12px;
        padding-bottom: 12px;
        box-shadow: inset 0px 1px 0px 0px #e9f0ff, inset 1px 0px 0px 0px #e9f0ff;
      }

      .subTitle {
        padding-left: 5px;
        font-size: 14px;
        font-family: PingFang SC-Medium, PingFang SC;
        font-weight: 500;
        color: #222943;
      }
    }

    i {
      font-size: 20px;

      &.el-icon-circle-close {
        color: #bdbfc7;
      }

      &.el-icon-circle-check {
        color: #2fc25b;
      }
    }
  }
}
.member {
  border: 0;
  border-radius: 0;
  box-shadow: inset 0px -1px 0px 0px #f4f4f6, inset 1px 1px 0px 0px #f4f4f6 !important;

  .member-title {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .member-section {
      display: flex;
      align-items: center;

      img {
        margin-right: 8px;
      }

      .title {
        font-size: 20px;
        font-family: PingFang SC-Medium, PingFang SC;
        font-weight: 500;
        color: #222943;
      }
    }

    .action {
      font-size: 14px;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #236dff;
      line-height: 16px;
    }
  }

  .member-body {
    .item-subtitle {
      font-size: 14px;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #222943;
      padding: 10px 0;
    }

    .item-text {
      font-size: 14px;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #bdbfc7;
    }

    .buyAction {
      display: flex;
      align-items: center;
      padding-top: 30px;
      margin-left: -8px;
      margin-right: -8px;

      .el-button {
        flex: 1;
        max-width: 100%;
        font-size: 14px;
        font-family: PingFang SC-Regular, PingFang SC;
        font-weight: 400;
        margin: 0 8px;
        border-radius: 0;
        border: 0;

        &:first-child {
          background-color: #f4f4f6;
          color: #7a7f8e;
        }

        &.level1 {
          background: linear-gradient(90deg, #e2f1ff 0%, #9dbbef 100%);
          color: #224384;
        }

        &.level2 {
          background: linear-gradient(90deg, #fff8d2 0%, #ffcf73 100%);
          color: #b97a00;
        }

        &.level3 {
          background: linear-gradient(90deg, #193a72 0%, #070932 100%);
          color: #ffe1b4;
        }
      }
    }
  }
}
.fixed-memberWrap {
  position: fixed;
  top: 120px;
  left: 96px;
  right: 30px;
}
</style>