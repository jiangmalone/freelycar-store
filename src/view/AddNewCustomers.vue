<template>
  <div>
    <!--客户信息-->
    <el-card shadow="hover">
      <div slot="header">
        <span>客户信息</span>
      </div>
      <el-form :model="clientForm" :rules="clientFormRules" ref="clientForm" label-width="100px">

        <el-row>
          <el-col :span="10">
            <el-form-item label="客户姓名：" prop="name">
              <el-input v-model="clientForm.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="2">
            <el-form-item label="性别：" prop="gender">
              <el-radio-group v-model="clientForm.gender">
                <el-radio label="男"></el-radio>
                <el-radio label="女"></el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10">
            <el-form-item label="手机号：" prop="phone">
              <el-input v-model="clientForm.phone"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="2">
            <el-form-item label="年龄：" prop="clientAge">
              <el-input v-model="clientForm.age"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10">
            <el-form-item label="生日：" prop="birthday">
              <el-date-picker v-model="clientForm.birthday" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="2">
            <el-form-item label="身份证：" prop="idNumber">
              <el-input v-model="clientForm.idNumber"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="10">
            <el-form-item label="行驶证号：">
              <el-input v-model="clientForm.driverLicense"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
    </el-card>

    <!--车辆信息-->
    <el-card shadow="hover">
      <div slot="header">
        <span>车辆信息</span>
      </div>
      <el-form :model="carInfoForm" :rules="carInfoFormRules" ref="carInfoForm" label-width="120px">

        <el-row>
          <el-col :span="12">
            <el-form-item label="车牌号码：" prop="licensePlate">
              <el-input v-model="carInfoForm.licensePlate"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否新车：" prop="newCar">
              <el-radio-group v-model="clientForm.newCar">
                <el-radio label="是"></el-radio>
                <el-radio label="否"></el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="品牌车系：" prop="carBrand">
              <el-input v-show="carInfoForm.carBrand" v-model="carInfoForm.carBrand" disabled></el-input>
              <addNewButton @click="carBrand.carBrandShow=true"></addNewButton>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="保险开始日期：" prop="insuranceStartTime">
              <el-date-picker v-model="clientForm.insuranceStartTime" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="车辆型号：" prop="carType">
              <el-select v-model="carInfoForm.carType" placeholder="请选择车辆型号" clearable>
                <el-option v-for="item in carBrand.carTypeList" :key="item.type" :label="item.type"
                           :value="item.type"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="保险截止日期：" prop="insuranceEndTime">
              <el-date-picker v-model="clientForm.insuranceEndTime" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="上次里程：" prop="lastMiles">
              <el-input v-model="carInfoForm.lastMiles"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="保险金额：" prop="insuranceAmount">
              <el-input v-model="carInfoForm.insuranceAmount"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="本次里程：" prop="miles">
              <el-input v-model="carInfoForm.miles"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="上牌时间：" prop="licenseDate">
              <el-date-picker v-model="clientForm.licenseDate" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="车架号：" prop="frameNumber">
              <el-input v-model="carInfoForm.frameNumber"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发动机号：" prop="engineNumber">
              <el-input v-model="carInfoForm.engineNumber"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>
    </el-card>

    <!--按钮-->
    <el-row>
      <el-col :span="2" :offset="8">
        <el-button type="primary" @click="submitInfo">保存</el-button>
      </el-col>
      <el-col :span="2" :offset="2">
        <el-button type="primary" @click="$router.push({path:'/MembershipManagement/CustomerManagement'})">取消</el-button>
      </el-col>
    </el-row>

    <!--会员办理提示框-->
    <el-dialog :visible.sync="dialogVisible" width="30%">
      <p align="center">保存成功！是否进行会员卡办理?</p>
      <div slot="footer" class="dialog-footer">
        <el-button @click="$router.push({path:'/MembershipManagement/CustomerManagement'})">取 消</el-button>
        <el-button type="primary"
                   @click="$router.push({path:'/MembershipManagement/MemberProcessing',query:{id:clientId}})">确 定
        </el-button>
      </div>
    </el-dialog>

    <!--添加车型-->
    <addCarBrand @getCarTypeInfo="getCarTypeInfo"
                 :carBrandShow.sync="carBrand.carBrandShow"></addCarBrand>
  </div>
</template>

<script>
  export default {
    name: 'AddNewCustomers',
    data() {
      return {
        //客户信息绑定表单
        clientForm: {
          name: '',
          gender: '',
          phone: null,
          age: '',
          birthday: '',
          idNumber: '',
          driverLicense: '',
          storeId: localStorage.getItem('storeId')
        },
        //客户表单验证，非自定义验证，若自定义验证，待修改
        clientFormRules: {
          name: [
            {required: true, message: '请输入客户姓名', trigger: 'blur'}
          ],
          phone: [
            {required: true, message: '请输入手机号码', trigger: 'blur'},
            { min: 11, max: 11, message: '长度应为11个字符', trigger: 'blur' }
          ]
        },
        //车辆信息绑定表单
        carInfoForm: {
          licensePlate: '',
          newCar: "",
          carBrand: '',
          insuranceStartTime: '',
          carType: '',
          insuranceEndTime: '',
          lastMiles: '',
          insuranceAmount: '',
          miles: '',
          licenseDate: '',
          frameNumber: '',
          engineNumber: ''
        },
        carInfoFormRules: {
          licensePlate: [
            {required: true, message: '请输入车牌号码', trigger: 'blur'},
            {min: 7, max: 7, message: '长度应为7个字符', trigger: 'blur'}
          ],
          carBrand: [
            {required: true, message: '请选择品牌车系', trigger: 'blur'}
          ]
        },
        dialogVisible: false,
        carBrand: {
          carBrandShow: false,
          carTypeList: [],//型号列表
          clientBrandCar: '',//品牌
          clientVehicleModel: '',//型号
        },
        clientId: ''
      }
    },
    methods: {
      // 提交信息
      submitInfo() {
        this.$refs['clientForm'].validate((valid1) => {
          if (valid1) {
            this.$refs['carInfoForm'].validate((valid2) => {
              if (valid2) {
                this.$post('/client/addClientAndCar', {
                  client: this.clientForm,
                  car: this.carInfoForm
                }).then(res => {
                  this.$message({
                    message: '保存成功',
                    type: 'success'
                  })
                  this.clientId = res.client.id
                  this.dialogVisible = true
                })
              } else {
                this.$message({
                  message: '车辆信息不完整',
                  type: 'error'
                })
                return false
              }
            })
          } else {
            this.$message({
              message: '客户信息不完整',
              type: 'error'
            })
            return false
          }
        })

      },

      // 从子组件中获取型号信息
      getCarTypeInfo(list) {
        this.carBrand = list
        this.carInfoForm.carBrand = list.clientBrandCar
        this.carInfoForm.carType = list.clientVehicleModel
      },

      // 取消
      // concelSubmit() {
      //   this.$router.go(-1)
      // }
    },
    mounted: function () {

    }
  }
</script>

<style lang="less" scoped>
  .el-card {
    margin-bottom: 40px;
  }

  .el-select, .el-input {
    width: 20vw;
  }
</style>
