<template>
  <div>
    <!--接完交状态-->
    <el-card shadow="hover">
      <div slot="header">
        <span>当前状态</span>
      </div>
      <el-steps process-status="finish" :active="consumerOrder.state" finish-status="success">
        <el-step title="接车"></el-step>
        <el-step title="完成"></el-step>
        <el-step title="交车"></el-step>
      </el-steps>
    </el-card>

    <!--用户信息-->
    <el-card shadow="hover">
        <el-row :gutter="20">
          <el-col :span="8">客户姓名：{{consumerOrder.clientName}}</el-col>
          <el-col :span="8">手机号码：{{consumerOrder.phone}}</el-col>
          <el-col :span="8">接车时间：{{consumerOrder.pickTime}}</el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">车牌号码：{{consumerOrder.licensePlate}}</el-col>
          <el-col :span="8">上次里程：{{consumerOrder.lastMiles}}km</el-col>
          <el-col :span="8">完工时间：{{consumerOrder.finishTime}}</el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">车牌型号：{{consumerOrder.carBrand}}</el-col>
          <el-col :span="8">本次里程：{{consumerOrder.miles}}km</el-col>
          <el-col :span="8">交车时间：{{consumerOrder.deliverTime}}</el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">停车位置：{{consumerOrder.parkingLocation}}</el-col>
        </el-row>
    </el-card>

    <!--故障-->
    <el-card shadow="hover">
      <div slot="header">
        <span>故障描述</span>
      </div>
      <el-row :gutter="20">
        <el-col :span="24">{{consumerOrder.faultDescription}}</el-col>
      </el-row>
    </el-card>

    <!--服务项目-->
    <el-card shadow="hover">
      <div slot="header">
        <span>服务项目</span>
      </div>
      <el-table :data="consumerProjectInfos" show-summary :summary-method="getProjectSummaries">
        <el-table-column type="index" width="50" label="序号" align="center"/>
        <el-table-column property="projectName" label="项目" align="center"/>
        <el-table-column property="price" label="项目价格" align="center"/>
        <el-table-column property="staffName" label="施工人员" align="center"/>
      </el-table>
    </el-card>

    <!--配件明细-->
    <el-card shadow="hover">
      <div slot="header">
        <span>配件明细</span>
      </div>
      <el-table :data="autoParts" show-summary :summary-method="getFittingSummaries">
        <el-table-column type="index" width="50" label="序号" align="center"/>
        <el-table-column property="type" label="配件类别" align="center"/>
        <el-table-column property="name" label="配件名称" align="center"/>
        <el-table-column property="count" label="数量" align="center"/>
        <el-table-column property="unitPrice" label="单价" align="center"/>
        <el-table-column property="totalPrice" label="总价" align="center"/>
      </el-table>
    </el-card>

    <!--整单金额、实收金额-->
    <el-card shadow="hover">
      <el-row>
        <el-col :span="6" :offset="18">
          订单金额：<span class="red">{{consumerOrder.totalPrice}}</span>
        </el-col>
        <el-col :span="6" :offset="18">
          支付金额：<span class="red">{{consumerOrder.actualPrice}}</span>
        </el-col>
      </el-row>
    </el-card>

    <!--确定按钮-->
    <el-row>
      <el-col :span="6" :offset="18">
        <el-button type="primary" class="buttonStyle" @click="$router.go(-1)">返回</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: 'DocumentDetails',
    data() {
      return {
        consumerOrder: {
          licensePlate: '',
          clientName: '',
          finishTime: '',
          carBrand: '',
          phone: '',
          deliverTime: '',
          lastMiles: '',
          parkingLocation: '',
          miles: '',
          pickTime: ''
        },
        consumerProjectInfos: [],
        autoParts: [],
        stepStatus: 'wait'
      }
    },
    methods: {
      // 获取订单详情
      getOrderDetail(id){
        this.$get('/order/detail',{
          id: id
        }).then(res=>{
          console.log(res)
          this.consumerOrder = res.consumerOrder
          this.consumerProjectInfos = res.consumerProjectInfos
          this.autoParts = res.autoParts
        })
      },

      // 计算服务项目的总价
      getProjectSummaries(param) {
        const {columns, data} = param
        const sums = []
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计'
            return
          } else if (index === 2) {
            const values = data.map(item => Number(item.price))
            sums[index] = values.reduce((prev, curr) => prev + curr)
          }
        })
        console.log('sums:', sums)
        return sums
      },

      // 计算配件明细的总价
      getFittingSummaries(param) {
        const {columns, data} = param
        const sums = []
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '合计'
            return
          } else if (index === columns.length - 1) {
            const values = data.map(item => Number(item.sumPrice))
            sums[index] = values.reduce((prev, curr) => prev + curr)
          }
        })
        return sums
      }
    },
    mounted: function () {
      this.getOrderDetail(this.$route.query.id)
    }
  }
</script>

<style lang="less" scoped>
  .el-card {
    margin-bottom: 40px;
  }

  .el-row{
    margin: 20px 0;
  }

  .red {
    color: red !important;
    font-size: 30px;
    font-weight: 700;
  }

  .buttonStyle {
    width: 150px;
    text-align: center;
  }
</style>
