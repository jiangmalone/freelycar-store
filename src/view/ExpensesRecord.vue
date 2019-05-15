<template>
  <div>
    <el-row>
      <el-col :span="12">
        <el-radio-group v-model="tabPosition" @change="onTabChange">
          <el-radio-button label="today">今日</el-radio-button>
          <el-radio-button label="thisMonth">本月</el-radio-button>
          <el-radio-button label="search">全部</el-radio-button>
        </el-radio-group>
      </el-col>

      <el-col :span="12" v-if="visible">
        <span>查找日期：</span>
        <el-date-picker
          v-model="datePickerValue"
          type="daterange"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          @change="getOrderRecord"
          class="dateWidth">
        </el-date-picker>
      </el-col>
    </el-row>

    <!--消费记录表格-->
    <el-card shadow="hover">
      <div slot="header">
        <span>合计消费</span>
      </div>
      <el-table :data="expensesRecordTable">
        <el-table-column type="index" label="序号" align="center"/>
        <el-table-column property="projectNames" label="项目" align="center"/>
        <el-table-column property="cost" label="消费金额" align="center"/>
        <el-table-column property="payMethod" label="支付方式" align="center"/>
        <el-table-column property="useCard" label="是否使用会员卡扣" align="center"/>
        <el-table-column property="serviceTime" label="服务时间" align="center"/>
      </el-table>
      <!--分页器-->
      <pagingDevice :pageData.sync="pageData" @changePage="getOrderRecord"></pagingDevice>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'ExpensesRecord',
    data() {
      return {
        tabPosition: 'today',
        visible: false,
        loading: true,
        pageData: {
          currentPage: 1,
          pageSize: 10,
          pageTotal: 100
        },
        datePickerValue: [],
        expensesRecordTable: []
      }
    },
    methods: {
      // 获取消费详情
      getOrderRecord() {
        this.$get('/order/orderRecord', {
          clientId: this.$route.query.id,
          currentPage: this.pageData.currentPage,
          pageSize: this.pageData.pageSize,
          startTime: this.datePickerValue[0],
          endTime: this.datePickerValue[1]
        }).then((res) => {
          this.loading = false
          this.pageData.currentPage = res.currentPage
          this.pageData.pageSize = res.pageSize
          this.pageData.pageTotal = res.total
          this.expensesRecordTable = res.data
        })
      },

      // 是否显示时间区间
      onTabChange(e) {
        this.visible = e === 'search' ? true : false
      }
    },
    mounted: function () {
      this.getOrderRecord()
    }
  }
</script>

<style lang="less" scoped>
  .el-card {
    margin-top: 40px;
  }

  .dateWidth {
    width: 70%;
  }
</style>
