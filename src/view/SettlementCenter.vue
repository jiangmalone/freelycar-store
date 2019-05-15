<template>
  <div>

    <!--服务项目模块-->
    <el-card shadow="hover">
      <div slot="header" class="clearfix">
        <span>服务项目</span>
      </div>
      <el-table :data="consumerProjectInfos" show-summary :summary-method="getSummaries">
        <el-table-column type="index" label="序号" align="center"/>
        <el-table-column property="projectName" label="项目" align="center"/>
        <el-table-column property="price" label="项目价格" align="center"/>
        <el-table-column property="staffName" label="施工人员" align="center"/>
      </el-table>
    </el-card>

    <!--配件明细模块-->
    <el-card shadow="hover">
      <div slot="header" class="clearfix">
        <span>配件明细</span>
      </div>
      <el-table :data="autoParts" show-summary :summary-method="getFittingSummaries">
        <el-table-column type="index" label="序号" align="center"/>
        <el-table-column property="type" label="配件类别" align="center"/>
        <el-table-column property="name" label="配件名称" align="center"/>
        <el-table-column property="count" label="数量" align="center"/>
        <el-table-column property="unitPrice" label="单价" align="center"/>
        <el-table-column property="sumPrice" label="总价" align="center">
          <template slot-scope="scope">{{scope.row.count*scope.row.unitPrice}}</template>
        </el-table-column>
      </el-table>
    </el-card>

    <!--应付金额模块-->
    <el-row class="paymentInput">
      <el-col :span="6" :offset="18">
        应付金额：<span class="redPrice">{{consumerOrder.totalPrice}}</span>
      </el-col>
    </el-row>

    <!--支付方式模块-->
    <el-card shadow="hover">
      <div slot="header" class="clearfix">
        <span>支付方式</span>
      </div>

      <el-row>
        <el-col :span="4">抵用券使用：</el-col>
        <el-col :span="20">
          <el-checkbox-group v-model="useCoupons">
            <el-checkbox v-for="item in orderCoupons" :label="item.id" :key="item.id">{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </el-col>
      </el-row>
      <!--第一种支付方式-->
      <el-row>
        <el-col :span="7">
          <span class="fontSize">支付方式：</span>
          <el-select v-model="payWay1.payMethods" size="small" class="inputWidth">
            <el-option v-for="item in payMethodOptions" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-col>
        <el-col :span="8" v-show="payWay1.payMethods===1">
          <span class="fontSize">可用卡劵：</span>
          <el-select v-model="payWay1.usableCards" size="small" class="inputWidth">
            <el-option v-for="item in cardList" :key="item.id" :label="item.name" :value="item.id"/>
          </el-select>
        </el-col>
        <el-col :span="8">
          <span class="fontSize">扣除金额：</span>
          <el-input v-model="payWay1.deductionAmounts" size="small" class="inputWidth red"/>
        </el-col>
        <el-col :span="1">
          <add-new-button @click="payWay2.visible = true"></add-new-button>
        </el-col>
      </el-row>

      <!--第二种支付方式-->
      <div v-show="payWay2.visible">
        <el-row>
          <el-col :span="7">
            <span class="fontSize">支付方式：</span>
            <el-select v-model="payWay2.payMethods" size="small" class="inputWidth">
              <el-option v-for="item in payMethodOptions" :key="item.value" :label="item.label" :value="item.value"/>
            </el-select>
          </el-col>
          <el-col :span="8" v-show="payWay2.payMethods===1">
            <span class="fontSize">可用卡劵：</span>
            <el-select v-model="payWay2.usableCards" size="small" class="inputWidth">
              <el-option v-for="item in cardList" :key="item.id" :label="item.name" :value="item.id"/>
            </el-select>
          </el-col>
          <el-col :span="8">
            <span class="fontSize">支付金额：</span>
            <el-input v-model="payWay2.payAmounts" size="small" class="inputWidth red"/>
          </el-col>
          <el-col :span="1">
            <add-new-button :minus="true" @click="handleRemoveIconClick"></add-new-button>
          </el-col>
        </el-row>
      </div>

      <!--确定按钮-->
      <el-row>
        <el-col :span="5" :offset="8">
          <el-button type="primary" size="small" @click="pendingOrder">确定</el-button>
        </el-col>
        <el-col :span="5">
          <el-button type="primary" size="small" @click="orderPayment">结算</el-button>
        </el-col>
      </el-row>
      <div>


      </div>
    </el-card>

  </div>
</template>

<script>
  export default {
    name: 'SettlementCenter',
    data() {
      return {
        clinetInfo: [],
        payWay1: {
          payMethods: '',
          usableCards: '',
          deductionAmounts: '',
        },
        payWay2: {
          visible: false,
          payMethods: '',
          usableCards: '',
          payAmounts: '',
        },
        payMethodOptions: [
          {
            value: 1,
            label: '会员卡'
          }, {
            value: 2,
            label: '现金'
          }, {
            value: 3,
            label: '微信'
          }, {
            value: 4,
            label: '支付宝'
          }, {
            value: 5,
            label: '易付宝'
          }, {
            value: 6,
            label: '刷卡'
          }],
        cardList: [],
        sumMoney: [],
        consumerOrder: [],
        consumerProjectInfos: [],
        autoParts: [],
        orderCoupons: [],
        useCoupons: []
      }
    },
    methods: {
      // 获取订单详情
      getOrderDetail() {
        this.$get('/order/detail', {
          id: this.$route.query.id
        }).then(res => {
          this.consumerOrder = res.consumerOrder
          this.consumerProjectInfos = res.consumerProjectInfos
          this.autoParts = res.autoParts
          this.payWay1.deductionAmounts = res.consumerOrder.totalPrice
          this.getClientInfo(res.consumerOrder.clientId)
        })
      },

      // 获取会员信息
      getClientInfo(id) {
        this.$get('/client/getCustomerInfo', {
          id: id
        }).then(res => {
          this.clinetInfo = res
          this.cardList = res.card
        })
      },

      // 获取可用抵用券
      getCouponsForOrder() {
        this.$get('/order/getCouponsForOrder', {
          orderId: this.$route.query.id
        }).then(res => {
          this.orderCoupons = res
          // payMethod=2说明已经被选中
          this.orderCoupons.forEach(value => {
            if(value.payMethod===2){
              this.useCoupons.push(value.id)
            }
          })
        })
      },

      // 确定按钮
      pendingOrder() {
        let submitCoupons = []
        this.useCoupons.forEach(value => {
          submitCoupons.push({id: value})
        })
        this.$post('/order/pendingOrder', {
          consumerOrder: {
            id: this.consumerOrder.id,
            actualPrice: this.consumerOrder.totalPrice,
            firstPayMethod: this.payWay1.payMethods,
            firstActualPrice: this.payWay1.deductionAmounts,
            firstCardId: this.payWay1.usableCards,
            secondPayMethod: this.payWay2.payMethods,
            secondActualPrice: this.payWay2.payAmounts,
            secondCardId: this.payWay2.usableCards
          },
          useCoupons: submitCoupons
        }).then(res => {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.$router.push({path: '/ConsumptionOrder/DocumentManagement'})
        })
      },

      // 结算按钮
      orderPayment() {
        let submitCoupons = []
        this.useCoupons.forEach(value => {
          submitCoupons.push({id: value})
        })
        this.$post('/order/payment', {
          consumerOrder: {
            id: this.consumerOrder.id,
            actualPrice: this.consumerOrder.totalPrice,
            firstPayMethod: this.payWay1.payMethods,
            firstActualPrice: this.payWay1.deductionAmounts,
            firstCardId: this.payWay1.usableCards,
            secondPayMethod: this.payWay2.payMethods,
            secondActualPrice: this.payWay2.payAmounts,
            secondCardId: this.payWay2.usableCards
          },
          useCoupons: submitCoupons
        }).then(res => {
          this.$message({
            message: '结算成功',
            type: 'success'
          })
          this.$router.push({path: '/ConsumptionOrder/DocumentManagement'})
        })
      },

      // 合计
      sum(param, totalIndex, totalPriceIndex, ride) {
        const {columns, data} = param
        const sums = []
        columns.forEach((column, index) => {
          if (index === totalIndex) {
            sums[index] = '合计'
            return
          } else if (index === totalPriceIndex) {
            if (ride) {
              const values = data.map(item => Number(item.count * item.unitPrice))
              sums[index] = eval(values.join("+"))
            } else {
              const values = data.map(item => Number(item.price))
              sums[index] = values.reduce((prev, curr) => prev + curr)
            }
          }
        })
        return sums
      },
      getSummaries(param) {
        return this.sum(param, 0, 2)
      },
      getFittingSummaries(param) {
        return this.sum(param, 0, 5, true)
      },

      // 删除第二种支付方式
      handleRemoveIconClick() {
        this.payWay2 = {
          visible: false,
          payMethods: '',
          usableCards: '',
          payAmounts: '',
        }
      },

      // 抵扣价格预判
      // 选择抵用券
      // useCoupons: [
      //   {id: "35XJKE"},
      //   {id: "36XJKE"}
      // ]
    },
    computed: {},
    mounted: function () {
      this.getOrderDetail()
      this.getCouponsForOrder()

    }
  }
</script>

<style lang="less" scoped>
  .inputWidth {
    width: 50%;
  }

  .el-card {
    margin-bottom: 40px;
  }

  .el-row {
    margin: 30px 0;
  }

  .fontSize {
    font-size: 14px;
  }

  .marginHorizontal {
    margin: 0 auto;
  }

  .paymentInput {
    margin-bottom: 40px;
  }

  .redPrice {
    color: red;
    font-size: 25px;
    margin: 20px;
  }

</style>
