<template>
  <div>
    <!--选择查找日期-->
    <el-row>
      <el-col :span="16">
        <span>选择查找日期:</span>
        <el-date-picker
          v-model="datePickerValue"
          type="daterange"
          size="small"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" size="small" @click="getData">查询</el-button>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" size="small" @click="getExcel">导出Excel</el-button>
      </el-col>
    </el-row>

    <!--合计金额-->
    <el-row>
      <el-col>
        <span>合计金额：</span>
        <el-input :value="sumAmounts" size="small" disabled></el-input>
      </el-col>

    </el-row>

    <el-table v-loading="loading" :data="flowDetailsTable" border>
      <el-table-column type="index" label="序号" align="center"></el-table-column>
      <el-table-column property="carBrand" label="车型" align="center"></el-table-column>
      <el-table-column property="licensePlate" label="车牌号码" align="center"></el-table-column>
      <el-table-column property="clientName" label="车主姓名" align="center"></el-table-column>
      <el-table-column property="phone" label="联系方式" align="center"></el-table-column>
      <el-table-column property="projectNames" label="消费项目" align="center"></el-table-column>
      <el-table-column property="cost" label="金额" align="center"></el-table-column>
      <el-table-column property="serviceTime" label="时间" align="center"></el-table-column>
      <el-table-column property="isMember" label="是否是会员" align="center"></el-table-column>
    </el-table>

    <!--分页器-->
    <pagingDevice
      :pageData.sync="pageData"
      @changePage="getData"></pagingDevice>

  </div>
</template>

<script>
  export default {
    name: 'FlowDetails',
    data() {
      return {
        loading: true,
        datePickerValue: '',
        sumAmounts: '',
        flowDetailsTable: [],
        pageData: {
          currentPage: 1,
          pageSize: 10,
          pageTotal: 100
        }
      }
    },
    methods: {
      getData() {
        this.$get('/order/listOrderParticulars', {
          currentPage: this.pageData.currentPage,
          pageSize: this.pageData.pageSize,
          storeId: localStorage.getItem('storeId'),
          startTime: this.datePickerValue ? this.datePickerValue[0] : '',
          endTime: this.datePickerValue ? this.datePickerValue[1] : ''
        }).then(res => {
          this.loading = false
          this.sumAmounts = res.totalAccount
          this.flowDetailsTable = res.pageResult.data
          this.pageData.currentPage = res.currentPage
          this.pageData.pageSize = res.pageSize
          this.pageData.pageTotal = res.total
        })
      },

      getExcel() {
        this.$getExcel('/order/exportOrderParticularsExcel', {
          currentPage: this.pageData.currentPage,
          pageSize: this.pageData.pageSize,
          storeId: localStorage.getItem('storeId'),
          startTime: this.datePickerValue ? this.datePickerValue[0] : '',
          endTime: this.datePickerValue ? this.datePickerValue[1] : ''
        })
      }
    },
    mounted: function () {
      this.getData()
    }
  }
</script>

<style lang="less" scoped>
  .el-date-picker {
    width: 70%;
  }

  .el-row {
    margin-bottom: 40px;
  }

  .el-input {
    width: 100px;
  }
</style>
