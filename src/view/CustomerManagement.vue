<template>
  <div>
    <!--查询条件-->
    <el-row>
      <el-col :span="5">
        <span>姓名：</span>
        <el-input v-model="name" size="small"></el-input>
      </el-col>
      <el-col :span="7">
        <span>手机号码：</span>
        <el-input v-model="phone" size="small"></el-input>
      </el-col>
      <el-col :span="7">
        <span>车牌号码：</span>
        <el-input v-model="carNumber" size="small"></el-input>
      </el-col>
      <el-col :span="4">
        <span>是否会员：</span>
        <el-button circle :type="buttonType" size="small" @click="onVipButton">是</el-button>
      </el-col>
      <el-col :span="1">
        <el-button type="primary" size="small" @click="getDataList">查询</el-button>
      </el-col>
    </el-row>

    <!--按钮-->
    <el-row :gutter="30">
      <el-col :span="3">
        <router-link to="/MembershipManagement/AddNewCustomers">
          <el-button type="primary" plain size="small">新增客户</el-button>
        </router-link>
      </el-col>
      <el-col :span="3">
        <el-button type="primary" plain size="small" @click="statisticsVisible = true">会员统计</el-button>
      </el-col>
      <el-col :span="3">
        <el-button type="primary" icon="el-icon-download" size="small" @click="exportExcel">导出表单</el-button>
      </el-col>
    </el-row>

    <!--客户表格-->
    <el-table :data="tableData" border v-loading="loading">
      <el-table-column label="序号" type="index" align="center"></el-table-column>
      <el-table-column prop="name" label="姓名" align="center">
        <template slot-scope="scope">
          <router-link :to="{path:'/MembershipManagement/CustomerInformation',query:{id:scope.row.id}}">
            {{scope.row.name}}
          </router-link>
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="手机号码" align="center"></el-table-column>
      <el-table-column prop="plates" label="车牌号码" align="center"></el-table-column>
      <el-table-column prop="brands" label="品牌" align="center"></el-table-column>
      <el-table-column prop="isMember" label="是否会员" align="center"></el-table-column>
      <el-table-column prop="totalCount" label="总消费次数" align="center"></el-table-column>
      <el-table-column prop="lastVisit" label="最近到店时间" align="center"></el-table-column>
      <el-table-column prop="totalBalance" label="卡内未消费金额" align="center"></el-table-column>
      <el-table-column label="操作" width="220" align="center">
        <template slot-scope="scope">
          <el-button @click="$router.push({path:'/MembershipManagement/MemberProcessing',query:{id:scope.row.id}})"
                     size="mini" type="primary">开卡
          </el-button>
          <el-button @click="$router.push({path:'/MembershipManagement/ModifyCustomers',query:{id:scope.row.id}})"
                     size="mini" type="primary">修改
          </el-button>
          <el-popover placement="top" width="160" :ref="scope.$index">
            <p>确定删除？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="handleClose(scope.$index)">取消</el-button>
              <el-button type="primary" size="mini" @click="handleDelete(scope.row)">确定</el-button>
            </div>
          </el-popover>
          <el-button size="mini" v-popover="scope.$index" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页器-->
    <pagingDevice :pageData.sync="pageData" @changePage="getDataList"></pagingDevice>

    <!--会员统计模态框-->
    <el-dialog title="会员统计" :visible.sync="statisticsVisible" width="30%">
      <el-row>会员总数：{{memberCount}}</el-row>
      <el-row>本月新增：{{newMemberCount}}</el-row>
      <el-row>今日新增：{{todayNewCount}}</el-row>

      <div slot="footer" class="dialog-footer">
        <el-button @click="statisticsVisible = false">取 消</el-button>
        <el-button type="primary" @click="statisticsVisible = false">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    name: 'CustomerManagement',
    data() {
      return {
        loading: true,
        buttonType: '',
        name: '',
        phone: '',
        isMember: '',
        carNumber: '',
        tableData: [],
        pageData: {
          currentPage: 1,
          pageSize: 10,
          pageTotal: 100
        },
        statisticsVisible: false,
        memberCount: 5,
        newMemberCount: 1,
        todayNewCount: 0
      }
    },
    methods: {
      // 获取列表
      getDataList() {
        this.$get('/client/list', {
          name: this.name,
          phone: this.phone,
          currentPage: this.pageData.currentPage,
          pageSize: this.pageData.pageSize,
          storeId: localStorage.getItem('storeId'),
          isMember: this.isMember,
        }).then((res) => {
          this.loading = false
          this.tableData = res.data
          this.pageData.currentPage = res.currentPage
          this.pageData.pageSize = res.pageSize
          this.pageData.pageTotal = res.total
          this.getMemberStatistics()
        })
      },

      // 获取门店统计信息
      getMemberStatistics() {
        this.$get('/client/memberStatistics', {
          storeId: localStorage.getItem('storeId')
        }).then((res) => {
          this.memberCount = res.total
          this.newMemberCount = res.month_new
          this.todayNewCount = res.today_new
        })
      },

      // 关闭再次确认的小窗口
      handleClose(id) {
        this.$refs[id].doClose()
      },

      // 删除当前行的会员
      handleDelete(row) {
        this.$get('/client/delete', {
          id: row.id
        }).then(res => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          // this.handleClose(row.id)
          this.getDataList()
        })
      },

      // 导出表单
      exportExcel(){
        this.$getExcel('/client/exportExcel', {
          name: this.name,
          phone: this.phone,
          currentPage: this.pageData.currentPage,
          pageSize: this.pageData.pageSize,
          storeId: localStorage.getItem('storeId'),
          isMember: this.isMember
        })
      },

      // 是否会员
      onVipButton() {
        this.buttonType = this.buttonType === '' ? 'primary' : ''
        this.isMember = this.isMember ? '' : true
        this.getDataList()
      }
    },
    mounted: function () {
      this.getDataList()
    }
  }
</script>

<style lang="less" scoped>
  a {
    color: #409EFF;
    text-decoration: none;
  }

  .el-input {
    width: 60%;
  }

  .el-row {
    margin-bottom: 40px;
  }
</style>
