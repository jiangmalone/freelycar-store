<template>
  <div>
    <!--客户资料-->
    <el-card shadow="hover">
      <div slot="header">
        <span>客户资料</span>
      </div>
      <el-row>
        <el-col :span="12">姓名：{{clinetInfo.client.name}}</el-col>
        <el-col :span="12">年龄：{{clinetInfo.client.age}}</el-col>
      </el-row>

      <el-row>
        <el-col :span="12">手机号：{{clinetInfo.client.phone}}</el-col>
        <el-col :span="12">性别：{{clinetInfo.client.gender}}</el-col>
      </el-row>

      <el-row>
        <el-col :span="12">生日：{{clinetInfo.client.birthday}}</el-col>
        <el-col :span="12">身份证号：{{clinetInfo.client.idNumber}}</el-col>
      </el-row>

      <el-row>
        <el-col :span="12">行驶证号：{{clinetInfo.client.driverLicense}}</el-col>
        <el-col :span="12">积分：{{clinetInfo.client.points}}</el-col>
      </el-row>

    </el-card>

    <!--会员卡信息-->
    <el-card shadow="hover">
      <div slot="header">
        <span>会员卡信息</span>
      </div>
      <div>
        <el-button @click="$router.push({path:'/MembershipManagement/MemberProcessing',query:{id:$route.query.id}})">
          开卡
        </el-button>
        <el-table :data="clinetInfo.card">
          <el-table-column property="cardNumber" label="卡号" align="center"/>
          <el-table-column property="name" label="卡名称" align="center"/>
          <el-table-column property="createTime" label="开卡时间" align="center"/>
          <el-table-column property="expirationDate" label="有效期至" align="center"/>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="getCardInfo(scope.row)">详情</el-button>
              <el-button size="mini" type="primary" @click="renewalCard(scope.row)">续卡</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <!--优惠券信息-->
    <el-card shadow="hover">
      <div slot="header">
        <span>优惠券信息</span>
      </div>
      <el-table :data="clinetInfo.coupon">
        <el-table-column property="name" label="抵用券名" align="center"/>
        <el-table-column property="deadline" label="到期日" align="center"/>
        <el-table-column property="price" label="价格" align="center"/>
        <el-table-column property="projectId" label="可用项目" align="center" :formatter="projectTypeFormat"/>
      </el-table>
    </el-card>

    <!--车辆信息-->
    <el-card>
      <div slot="header">
        <span>车辆信息</span>
      </div>
      <div>
        <el-button @click="addNewCar">新增车辆</el-button>
        <el-table :data="clinetInfo.car">
          <el-table-column property="licensePlate" label="车牌号码" align="center"/>
          <el-table-column property="carBrand" label="品牌" align="center"/>
          <el-table-column property="carType" label="车辆型号" align="center"/>
          <el-table-column property="miles" label="里程数" align="center"/>
          <el-table-column property="engineNumber" label="发动机号" align="center"/>
          <el-table-column property="newCar" label="是否新车" align="center" :formatter="newCarFormat"/>
          <el-table-column property="insuranceAmount" label="保险金额" align="center"/>
          <el-table-column property="insuranceEndTime" label="保险有效期" align="center"/>
          <el-table-column label="操作" align="center" width="150">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="modifyCarInfo(scope.row)">修改</el-button>
              <el-popover :ref="scope.row.id" placement="top" width="160">
                <p>表格数据确定删除吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="handleClose(scope.row.id)">取消</el-button>
                  <el-button type="primary" size="mini" @click="deleteCar(scope.row)">
                    确定
                  </el-button>
                </div>
              </el-popover>
              <el-button v-popover="scope.row.id" type="danger" size="mini">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>

    <!--消费记录-->
    <el-card shadow="hover">
      <div slot="header">
        <span>消费记录</span>
      </div>
      <el-table :data="expensesRecord">
        <el-table-column type="index" label="序号" align="center"/>
        <el-table-column property="projectNames" label="项目" align="center"/>
        <el-table-column property="cost" label="消费金额" align="center"/>
        <el-table-column property="payMethod" label="支付方式" align="center"/>
        <el-table-column property="useCard" label="是否使用会员卡扣" align="center"/>
        <el-table-column property="serviceTime" label="服务时间" align="center"/>
      </el-table>
      <el-row>
        <el-col :span="2" :offset="22">
          <el-button type="text"
                     @click="$router.push({path:'/MembershipManagement/ExpensesRecord',query:{id:$route.query.id}})">更多
          </el-button>
        </el-col>
      </el-row>
    </el-card>

    <!--续卡对话框-->
    <el-dialog title="续卡充值" :visible.sync="renewalCardInfo.renewalCardVisible">
      <el-form :data="renewalCardInfo" label-width="130px">
        <el-form-item label="会员卡号：">{{cardInfo.cardNumber}}</el-form-item>
        <el-form-item label="卡名称：">{{cardInfo.name}}</el-form-item>
        <el-form-item label="会员卡类：">{{cardInfo.type}}</el-form-item>
        <el-form-item label="有效期（年）：">{{cardInfo.validTime}}</el-form-item>
        <el-form-item label="卡内余额：" prop="cardBalance">{{cardInfo.balance}}</el-form-item>
        <el-form-item label="续卡金额：">
          <el-select v-model="renewalCardInfo.cardAmounts" placeholder="请选择储值卡" size="mini">
            <el-option v-for="item in cardAmounts" :key="item.index" :label="item.cardAmounts"
                       :value="item.price"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="卡面金额：" prop="cardSurfaceAmounts">
          <el-input v-model="renewalCardInfo.price" disabled size="mini"></el-input>
        </el-form-item>
        <el-form-item label="支付方式：">
          <el-select v-model="renewalCardInfo.payMethod" placeholder="请选择支付方式" size="mini">
            <el-option v-for="item in payMethods" :key="item.index" :label="item.payMethods"
                       :value="item.payMethods"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="办理人员：">
          <el-select v-model="renewalCardInfo.staffId" placeholder="请选择办理人员" size="mini">
            <el-option v-for="item in staffList" :key="item.index" :label="item.staffName"
                       :value="item.staffName"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button type="primary" @click="renewalCardSubmit">办 理</el-button>
      </div>
    </el-dialog>

    <!--查看详情对话框-->
    <el-dialog title="会员卡详情" :visible.sync="detailsVisible">
      <el-row>
        <el-col :span="12">卡类名称：{{cardInfo.name}}</el-col>
        <el-col :span="12">卡类属性：{{cardInfo.type}}</el-col>
      </el-row>

      <el-row>
        <el-col :span="12">售卡金额：{{cardInfo.price}}</el-col>
        <el-col :span="12">有效期：{{cardInfo.validTime}}</el-col>
      </el-row>

      <el-row>
        <el-col :span="12">实际金额：{{cardInfo.actualPrice}}</el-col>
        <el-col :span="12">剩余金额：{{cardInfo.balance}}</el-col>
      </el-row>

      <div slot="footer" class="dialog-footer">
        <el-button @click="detailsVisible = false">取 消</el-button>
        <el-button type="primary" @click="detailsVisible = false">确 定</el-button>
      </div>
    </el-dialog>

    <!--添加车型-->
    <addCarBrand @getCarTypeInfo="getCarTypeInfo"
                 :carBrandShow.sync="addNewCarForm.carBrandShow"></addCarBrand>

    <!--新增车辆对话框-->
    <el-dialog :title="isModify ? '新增车辆' : '修改车辆信息'" :visible.sync="addNewCarVisible" width="70%">
      <el-form :model="addNewCarForm" label-width="120px">
        <el-row>
          <el-col :span="11">
            <el-form-item label="车牌号码：" prop="carNumber">
              <el-input v-model="addNewCarForm.licensePlate"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="车辆品牌：" prop="carBrand">
              <el-input v-show="addNewCarForm.carBrand" v-model="addNewCarForm.carBrand"
                        style="width: 75%" disabled></el-input>
              <addNewButton @click="chooseCarBrand"></addNewButton>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="车牌类型：" prop="carType">
              <el-input v-model="addNewCarForm.carType" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="保险起止时间：" prop="insuranceTime">
              <el-date-picker v-model="insuranceTime" type="daterange"
                              range-separator="~" start-placeholder="开始日期"
                              value-format="yyyy-MM-dd" end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="是否新车：" prop="isNewCar">
              <el-radio-group v-model="addNewCarForm.newCar">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="保险金额：" prop="insuranceAmount">
              <el-input v-model="addNewCarForm.insuranceAmount"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="里程数：" prop="mileage">
              <el-input v-model="addNewCarForm.miles"/>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="上牌时间：" prop="addLicenseTime">
              <el-date-picker v-model="addNewCarForm.licenseDate" type="date" placeholder="选择日期"
                              value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="11">
            <el-form-item label="车架号：" prop="frameNumber">
              <el-input v-model="addNewCarForm.frameNumber"/>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item label="发动机号：" prop="engineNumber">
              <el-input v-model="addNewCarForm.engineNumber"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit">保存</el-button>
        <el-button @click="addNewCarVisible = false">取消</el-button>
      </div>

    </el-dialog>
  </div>
</template>

<script>
  import {trueOrFlase} from './../components/formatter.js'

  export default {
    name: 'CustomerInformation',
    data() {
      return {
        clinetInfo: {},
        projectType: [],
        expensesRecord: [],
        renewalCardInfo: {
          renewalCardVisible: false,
          cardAmounts: '',
          price: '',
          payMethod: '',
          staffId: ''
        },
        cardAmounts: [{
          index: '1',
          price: '1000储值卡'
        }],
        payMethods: [{
          index: '1',
          payMethods: '支付宝'
        }],
        staffList: [{
          index: '1',
          staffName: '小易'
        }],
        detailsVisible: false,
        isModify: false,
        addNewCarVisible: false,
        addNewCarForm: {
          carBrandShow: false,
          carTypeList: [],//型号列表
          carBrand: '',
          carType: '',//型号
          engineNumber: '',
          frameNumber: '',
          insuranceAmount: '',
          miles: '',
          newCar: '',
          licenseDate: '',
          licensePlate: ''
        },
        insuranceTime: [],
        carBrand: {
          carBrandShow: true,
          carTypeList: [],//型号列表
          clientBrandCar: '',//品牌
          clientVehicleModel: '',//型号
        },
        datePickerValue: '',
        index: 4,
        cardInfo: {}
      }
    },
    methods: {
      // 获取客户信息
      getClientInfo() {
        this.$get('/client/getCustomerInfo', {
          id: this.$route.query.id
        }).then(res => {
          console.log(res)
          this.clinetInfo = res
        })
      },

      // 会员卡详情
      getCardInfo(row) {
        this.detailsVisible = true
        this.$get('/card/detail', {
          id: row.id
        }).then(res => {
          this.cardInfo = res
        })
      },

      // 续卡
      renewalCard(row) {
        this.$get('/card/detail', {
          id: row.id
        }).then(res => {
          this.cardInfo = res
        })
        this.renewalCardInfo.renewalCardVisible = true
        this.renewalCardInfo.memberCardNumber = row.cardNumber
        this.renewalCardInfo.memberCardName = row.cardName
      },

      // 提交续卡信息
      renewalCardSubmit() {
        this.renewalCardInfo.renewalCardVisible = false
        this.$post('', {})
      },

      //修改车辆信息（打开弹窗）
      modifyCarInfo(row) {
        this.isModify = false
        this.addNewCarVisible = true
        this.addNewCarForm = row
        this.insuranceTime[0] = row.insuranceStartTime
        this.insuranceTime[1] = row.insuranceEndTime
      },

      //新增车辆信息打开弹框
      addNewCar() {
        this.isModify = true
        this.insuranceTime = []
        this.addNewCarForm = {
          carBrandShow: false,
          carTypeList: [],//型号列表
          carBrand: '',
          carType: '',//型号
          engineNumber: '',
          frameNumber: '',
          insuranceAmount: '',
          miles: '',
          newCar: '',
          licenseDate: '',
          licensePlate: ''
        }
        this.addNewCarVisible = true
      },

      // 打开选择车辆型号弹框
      chooseCarBrand() {
        this.addNewCarVisible = false
        this.addNewCarForm.carBrandShow = true
      },

      // 选择车辆型号信息
      getCarTypeInfo(list) {
        if (list.clientVehicleModel) {
          this.carBrand = list
          this.addNewCarForm.carBrand = list.clientBrandCar
          this.addNewCarForm.carType = list.clientVehicleModel
          this.addNewCarVisible = true
          this.addNewCarForm.carBrandShow = false
        }
      },

      // 关闭小提示框
      handleClose(id) {
        this.$refs[id].doClose()
      },

      // 删除车辆信息
      deleteCar(row) {
        this.$get('/car/delete', {
          id: row.id
        }).then(res => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.handleClose(row.id)
          this.getClientInfo()
        })
      },

      //新增车辆信息弹框中的保存按钮
      submit() {
        this.addNewCarVisible = false
        this.$post('/car/modify', {
          carBrand: this.addNewCarForm.carBrand,
          carType: this.addNewCarForm.carType,
          clientId: this.$route.query.id,
          engineNumber: this.addNewCarForm.engineNumber,
          frameNumber: this.addNewCarForm.frameNumber,
          insuranceAmount: this.addNewCarForm.insuranceAmount,
          insuranceEndTime: this.insuranceTime[0],
          insuranceStartTime: this.insuranceTime[1],
          miles: this.addNewCarForm.miles,
          newCar: this.addNewCarForm.newCar,
          licenseDate: this.addNewCarForm.licenseDate,
          licensePlate: this.addNewCarForm.licensePlate,
          storeId: localStorage.getItem('storeId'),
          id: this.addNewCarForm.id
        }).then(res => {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.getClientInfo()
        })
      },

      // 是否新车过滤器
      newCarFormat(row) {
        return trueOrFlase(row.newCar)
      },

      // 获取项目类别列表
      getProjectType() {
        this.$get('/project/list', {
          storeId: localStorage.getItem('storeId'),
          currentPage: 1,
          pageSize: 1000
        }).then((res) => {
          this.projectType = res.data
        })
      },

      // 项目名称过滤器
      projectTypeFormat(row) {
        let name = ''
        this.projectType.filter(v => {
          if (v.id === row.projectId) {
            name = v.name
          }
        })
        return name
      },

      // 获取消费详情
      getOrderRecord() {
        this.$get('/order/orderRecord', {
          clientId: this.$route.query.id,
          currentPage: 1,
          pageSize: 3,
          startTime: '',
          endTime: ''
        }).then((res) => {
          this.expensesRecord = res.data
        })
      }
    },
    mounted: function () {
      this.getClientInfo()
      this.getProjectType()
      this.getOrderRecord()
    }
  }
</script>

<style lang="less" scoped>
  .el-card {
    margin-bottom: 40px;
  }

  .el-input, .el-select, .el-date-editor {
    width: 90%;
  }

  .el-row {
    margin: 20px;
  }

  .dateWidth {
    width: 99%;
  }
</style>
