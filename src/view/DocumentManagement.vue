<template>
  <div>
    <!--第一模块-->
    <el-card shadow="hover">
      <el-form :model="form" ref="form" label-width="100px">

        <el-row>
          <el-col :span="8">
            <el-form-item label="单据编号：" prop="number">
              <el-input v-model="form.orderId" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="项目类别：" size="small">
              <el-select v-model="form.projectId" placeholder="请选择项目类别">
                <el-option v-for="item in projectType" :key="item.id" :label="item.name"
                           :value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7" :offset="1">
            <span>车辆状态：</span>
            <el-radio-group v-model="form.orderState" size="small" class="circle" @change="getDataList">
              <el-radio-button v-for="item in orderStateOption" :key="item.label"
                               :label="item.label">{{item.value}}
              </el-radio-button>
            </el-radio-group>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="车牌号码：" prop="carNumber">
              <el-input v-model="form.licensePlate" size="small"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="结算状态：">
              <el-select v-model="form.payState" placeholder="请选择会员卡类" size="small">
                <el-option v-for="item in payStateOption" :key="item.value" :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="时间类型：">
              <el-select v-model="form.dateType" placeholder="请选择时间类型" size="small">
                <el-option v-for="item in dateKindOptions" :key="item.key" :label="item.value"
                           :value="item.key"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-show="visible">
            <el-form-item>
              <el-date-picker style="width: 20vw;" v-model="form.time" type="daterange"
                              size="small" range-separator="~" value-format="yyyy-MM-dd"
                              start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <!--两个按钮-->
      <el-row :gutter="30">
        <el-col :span="2" :offset="1">
          <el-button type="primary" size="small" @click="getDataList">查询</el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" plain size="small" @click="clearData">清空</el-button>
        </el-col>
      </el-row>
    </el-card>

    <!--第二模块-->
    <el-card shadow="hover">

      <!--导出excel按钮-->
      <el-row>
        <el-col :span="3">
          <el-button type="primary" size="small" icon="el-icon-download" @click="getExcel">导出表单</el-button>
        </el-col>
      </el-row>

      <!--表格-->
      <el-table v-loading="loading" :data="docManagementTable">

        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="手机号码"><span>{{ props.row.phone }}</span></el-form-item>
              <el-form-item label="接车时间"><span>{{ props.row.pickTime }}</span></el-form-item>
              <el-form-item label="项目类别"><span>{{ props.row.project }}</span></el-form-item>
              <el-form-item label="完工时间"><span>{{ props.row.finishTime }}</span></el-form-item>
              <el-form-item label="停车位置"><span>{{ props.row.parkingLocation }}</span></el-form-item>
              <el-form-item label="交车时间"><span>{{ props.row.deliverTime }}</span></el-form-item>
            </el-form>
          </template>
        </el-table-column>

        <el-table-column label="单据编号" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <router-link :to="{path:'/ConsumptionOrder/DocumentDetails',query:{id:scope.row.id}}">
              {{scope.row.id}}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column property="createTime" label="单据时间" align="center"></el-table-column>
        <el-table-column property="licensePlate" label="车牌号码" align="center"></el-table-column>
        <el-table-column property="orderType" label="智能柜订单" align="center"
                         :formatter="orderTypeFormatter"></el-table-column>
        <el-table-column property="totalPrice" label="订单金额" align="center"></el-table-column>
        <el-table-column property="actualPrice" label="支付金额" align="center"></el-table-column>
        <el-table-column property="state" label="车辆状态" align="center" :formatter="stateFormatter"></el-table-column>
        <el-table-column property="payState" label="结算状态" align="center"
                         :formatter="payStateFormatter"></el-table-column>
        <el-table-column label="操作" width="230" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" v-show="scope.row.state !== 1"
                       @click="orderDetail(scope.row)">查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--分页器-->
      <el-row style="height: 100px;">
        <pagingDevice :pageData.sync="pageData" @changePage="getDataList"></pagingDevice>
      </el-row>

    </el-card>

    <!--完工弹出框-->
    <el-dialog title="完工" :visible.sync="serviceFinishForm.visible" width="50%" v-loading="serviceFinishForm.loading">
      <div>
        <el-row>
          <el-col :span="4">完工时间：</el-col>
          <el-date-picker v-model="serviceFinishForm.time" type="datetime" placeholder="选择日期时间"
                          value-format="timestamp"></el-date-picker>
        </el-row>
        <el-row style="margin-top: 20px">
          <el-col :span="4">停车位置：</el-col>
          <el-input v-model="serviceFinishForm.location" placeholder="请输入内容" style="width: 80%" size="small"></el-input>
        </el-row>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="serviceFinishForm.visible = false">取 消</el-button>
        <el-button type="primary" @click="serviceFinishSubmit">确 定</el-button>
      </div>
    </el-dialog>

    <!--交车弹出框-->
    <el-dialog title="交车" :visible.sync="deliveryForm.visible" v-loading="deliveryForm.loading">
      <div>
        <el-row>
          <el-col :span="4">完工时间：</el-col>
          <el-date-picker v-model="deliveryForm.time" type="datetime" placeholder="选择日期时间"></el-date-picker>
        </el-row>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deliveryForm.visible = false">取 消</el-button>
        <el-button type="primary" @click="deliveryCarSubmit">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: 'DocumentManagement',
    data() {
      return {
        loading: false,
        visible: 'true',
        form: {
          orderId: '',
          projectId: '',
          orderState: '',
          licensePlate: '',
          payState: '',
          dateType: '',
          time: []
        },
        projectType: [],
        dateKindOptions: [
          {
            key: 1,
            value: '单据时间'
          },
          {
            key: 2,
            value: '接车时间'
          },
          {
            key: 3,
            value: '完工时间'
          },
          {
            key: 4,
            value: '交车时间'
          }
        ],
        docManagementTable: [
          {
            docNumber: '11111111',
            car: '已接',
            state: '未结算'
          }, {
            docNumber: '222',
            car: '已接',
            state: '已结算'
          }, {
            docNumber: '333',
            car: '已交',
            state: '已结算'
          }, {
            docNumber: '444',
            car: '已交',
            state: '未结算'
          }, {
            docNumber: '555',
            car: '已完',
            state: '已结算'
          }, {
            docNumber: '666',
            car: '已完',
            state: '未结算'
          }],
        payStateOption: [
          {
            label: '未结算',
            value: 1
          },
          {
            label: '已结算',
            value: 2
          }
        ],
        pageData: {
          currentPage: 1,
          pageSize: 10,
          pageTotal: 1000
        },
        orderStateOption: [
          {
            label: 1,
            value: '接'
          },
          {
            label: 2,
            value: '完'
          },
          {
            label: 3,
            value: '交'
          }
        ],
        deliveryForm:{
          visible: false,
          loading: false,
          id: '',
          time: '',
        },
        serviceFinishForm: {
          visible: false,
          loading: false,
          id: '',
          time: '',
          location: ''
        },
      }
    },
    methods: {
      // 获取卡类列表
      getDataList() {
        console.log(this.form)
        this.$post('/order/list?storeId=' + localStorage.getItem('storeId') + '&currentPage=' + this.pageData.currentPage + '&pageSize=' + this.pageData.pageSize, {
          orderId: this.form.orderId,
          licensePlate: this.form.licensePlate,
          projectId: this.form.projectId,
          payState: this.form.payState,
          dateType: this.form.dateType,
          startTime: this.form.time ? this.form.time[0] : null,
          endTime: this.form.time ? this.form.time[1] : null,
          orderState: this.form.orderState
        }).then((res) => {
          this.loading = false
          this.docManagementTable = res.data
          this.pageData.currentPage = res.currentPage
          this.pageData.pageSize = res.pageSize
          this.pageData.pageTotal = res.total
        })
      },

      // 获取项目类别列表
      getProjectType() {
        this.$get('/projectType/list', {
          storeId: localStorage.getItem('storeId'),
          currentPage: 1,
          pageSize: 1000
        }).then((res) => {
          this.loading = false
          this.projectType = res.data
        })
      },

      // 智能柜订单过滤器
      orderTypeFormatter(row) {
        switch (row.payState) {
          case 2:
            return '是'
            break
          default :
            return '否'
            break
        }
      },

      // 车辆状态过滤器
      stateFormatter(row) {
        switch (row.state) {
          case 0:
            return '预约'
            break
          case 1:
            return '接车'
            break
          case 2:
            return '完工'
            break
          case 3:
            return '交车'
            break
          case 4:
            return '取消'
            break
        }
      },

      // 支付状态过滤器
      payStateFormatter(row) {
        switch (row.payState) {
          case 1:
            return '未结算'
            break
          case 2:
            return '已结算'
            break
        }
      },

      // 清空
      clearData() {
        this.form = {
          orderId: '',
          projectId: '',
          orderState: '',
          licensePlate: '',
          payState: '',
          dateType: '',
          time: []
        }
      },

      // 完工打开模态框
      serviceFinish(row) {
        this.serviceFinishForm.visible = true
        this.serviceFinishForm.id = row.id
        this.serviceFinishForm.location = row.parkingLocation
      },

      // 完工提交
      serviceFinishSubmit() {
        this.serviceFinishForm.loading = true
        this.$post('/order/serviceFinish', {
          id: this.serviceFinishForm.id,
          finishTime: this.serviceFinishForm.time,
          parkingLocation: this.serviceFinishForm.location
        }).then(res=>{
          this.serviceFinishForm.loading = false
          this.serviceFinishForm.visible = false
          this.$message({
            message: '已完工',
            type: 'success'
          })
          this.getDataList()
        })
      },

      // 交车打开模态框
      deliveryCar(row) {
        this.deliveryForm.visible = true
        this.deliveryForm.id = row.id
      },

      // 交车提交
      deliveryCarSubmit() {
        this.deliveryForm.loading = true
        this.$post('/order/handOver', {
          id: this.deliveryForm.id,
          deliverTime: this.deliveryForm.time
        }).then(res=>{
          this.deliveryForm.loading = false
          this.deliveryForm.visible = false
          this.$message({
            message: '已交车',
            type: 'success'
          })
          this.getDataList()
        })
      },

      // 修改订单
      modifyOrder(row) {
        this.$router.push({path:'/ConsumptionOrder/QuickBilling',query:{id:row.id}})
      },

      // 结算
      settlementOrder(row) {
        this.$router.push({path:'/ConsumptionOrder/SettlementCenter',query:{id:row.id}})
      },

      // 查看详情
      orderDetail(row) {
        this.$router.push({path:'/ConsumptionOrder/DocumentDetails',query:{id:row.id}})
      },

      // 导出表单
      getExcel() {
        this.$postExcel('/order/exportOrder?storeId=' + localStorage.getItem('storeId') + '&currentPage=' + this.pageData.currentPage + '&pageSize=' + this.pageData.pageSize,{
          orderId: this.form.orderId,
          licensePlate: this.form.licensePlate,
          projectId: this.form.projectId,
          payState: this.form.payState,
          dateType: this.form.dateType,
          startTime: this.form.time ? this.form.time[0] : null,
          endTime: this.form.time ? this.form.time[1] : null,
          orderState: this.form.orderState
        })
      },


    },
    mounted: function () {
      this.getDataList()
      this.getProjectType()
    }
  }
</script>

<style lang="less" scoped>
  .demo-table-expand {
    font-size: 0;
  }

  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }

  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }

  .el-row {
    margin: 0;
  }

  .el-card {
    margin-bottom: 40px;
  }

  .el-table {
    margin-top: 40px;
  }

  .el-select, .el-input {
    width: 15vw;
  }

  .el-date-picker {
    width: 20vw;
  }

  .el-table .cell > a {
    color: #409EFF;
    text-decoration: none;
  }

  .circle /deep/ .el-radio-button__inner {
    padding: 9px;
    margin-right: 10px;
    border-radius: 21px;
  }
</style>
