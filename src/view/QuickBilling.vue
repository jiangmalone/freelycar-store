<template>
  <div>
    <el-form :model="consumerOrder" :rules="consumerOrderRules" ref="consumerOrderForm">
      <!--第一部分。基本信息-->
      <el-card shadow="hover">
        <el-row :gutter="20">
          <el-col :span="8">
            <!--车牌号码：-->
            <el-form-item label="车牌号码：" prop="licensePlate">
              <el-input @keyup.native="getCarInfo" v-model="consumerOrder.licensePlate" size="small"
                        placeholder="请输入内容"></el-input>
              <router-link to="/MembershipManagement/AddNewCustomers">
                <addNewButton></addNewButton>
              </router-link>
            </el-form-item>
          </el-col>
          <el-col :span="8">客户管理：{{consumerOrder.clientName}}
            <router-link to="/MembershipManagement/AddNewCustomers">
              <addNewButton></addNewButton>
            </router-link>
          </el-col>
          <el-col :span="8">是否会员： {{consumerOrder.isMember===''?'':consumerOrder.isMember?'是':'否'}}
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">品牌型号：{{consumerOrder.carBrand}}{{consumerOrder.carType?'--'+consumerOrder.carType:''}}
          </el-col>
          <el-col :span="8">手机号码：{{consumerOrder.phone}}
          </el-col>
          <el-col :span="8">
            <el-form-item label="接车时间：" prop="pickTime">
              <el-date-picker size="small" v-model="consumerOrder.pickTime" type="datetime"
                              placeholder="选择日期时间"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">上次里程：{{consumerOrder.lastMiles?consumerOrder.lastMiles+'/km':''}}
          </el-col>
          <el-col :span="8">历史消费：{{consumerOrder.historyConsumption?consumerOrder.historyConsumption+'/元':''}}
          </el-col>
          <el-col :span="8">
            <el-form-item label="接车人员：" prop="pickCarStaffId">
              <el-select size="small" v-model="consumerOrder.pickCarStaffId" placeholder="请选择" @change="changeStaff">
                <el-option v-for="item in staffList" :key="item.id" :label="item.name"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">本次里程：
            <el-input size="small" v-model="consumerOrder.miles" placeholder="请输入内容"></el-input>
            /km
          </el-col>
          <el-col :span="8">剩余金额：{{consumerOrder.balance?consumerOrder.balance+'/元':''}}
          </el-col>
        </el-row>
      </el-card>

      <!--第二部分。故障-->
      <el-card shadow="hover">
        <div slot="header">
          <span>故障描述</span>
        </div>
        <el-input type="textarea" autosize
                  placeholder="请输入故障描述" v-model="consumerOrder.faultDescription"></el-input>
      </el-card>

      <!--第三部分。服务项目-->
      <el-card shadow="hover">
        <div slot="header">
          <span>服务项目</span>
          <el-button type="primary" size="small" class="addButton" icon="el-icon-plus"
                     plain @click="projectAddVisible = true">添加
          </el-button>
        </div>
        <el-table :data="projectShow" show-summary :summary-method="getSummaries" style="width: 100%">
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column prop="projectName" label="项目名称"></el-table-column>
          <el-table-column prop="price" label="项目价格"></el-table-column>
          <el-table-column prop="staffName" label="施工人员">
            <template slot-scope="scope">
              <el-select size="small" v-model="projectShow[scope.$index].staffId" placeholder="请选择"
                         @change="changeProjectStaff(scope)">
                <el-option v-for="item in staffList" :key="item.id" :label="item.name"
                           :value="item.id"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-popover placement="top" width="160" :ref="scope.$index">
                <p>确定删除？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="handleClose(scope.$index)">取消</el-button>
                  <el-button type="primary" size="mini" @click="projectHandleDelete(scope)">确定</el-button>
                </div>
              </el-popover>
              <el-button v-popover="scope.$index" size="mini" type="danger">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!--第四部分。使用配件-->
      <el-card shadow="hover" v-show="projectShow.length>0">
        <div slot="header">
          <span>使用配件</span>
          <el-button type="primary" size="small" class="addButton" icon="el-icon-plus"
                     plain @click="openAccessoriesDialog">添加
          </el-button>
        </div>
        <el-table :data="accessoriesList" show-summary :summary-method="getFittingSummaries" style="width: 100%">
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column prop="type" label="配件类别"></el-table-column>
          <el-table-column prop="name" label="配件名称"></el-table-column>
          <el-table-column prop="count" label="数量"></el-table-column>
          <el-table-column prop="unitPrice" label="单价"></el-table-column>
          <el-table-column label="总价">
            <template slot-scope="scope">{{scope.row.count*scope.row.unitPrice}}</template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-popover placement="top" width="160" :ref="scope.row.type">
                <p>确定删除？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="handleClose(scope.row.type)">取消</el-button>
                  <el-button type="primary" size="mini" @click="handleDelete(scope)">确定</el-button>
                </div>
              </el-popover>
              <el-button v-popover="scope.row.type" size="mini" type="danger">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!--金额结算等-->
      <el-row>
        <el-col :offset="9" :span="5">项目：<span class="redPrice">{{projectPrice?projectPrice:0}}</span>元</el-col>
        <el-col :span="5">配件：<span class="redPrice">{{accessoriesPrice?accessoriesPrice:0}}</span>元</el-col>
        <el-col :span="5">整单金额：
          <span class="redPrice">{{projectPrice?(accessoriesPrice?projectPrice+accessoriesPrice:projectPrice):0}}</span>元
        </el-col>
      </el-row>
      <el-row style="margin: 50px 0;">
        <el-col :offset="16" :span="4">
          <el-button type="primary" :disabled="!SubmitIsAbled" @click="submitOrder('consumerOrderForm',false)">保存
          </el-button>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" :disabled="!SubmitIsAbled" @click="submitOrder('consumerOrderForm',true)">结算
          </el-button>
        </el-col>
      </el-row>
    </el-form>

    <!--服务项目-添加模态框-->
    <el-dialog title="项目查询" :visible.sync="projectAddVisible" width="80%">
      <!--条件查询-->
      <el-row>
        <el-col :span="10">
          <span>项目名称：</span>
          <el-input v-model="itemName"></el-input>
        </el-col>
        <el-col :span="10">
          <span>项目类别：</span>
          <el-select v-model="selectValue" clearable placeholder="请选择项目类别">
            <el-option v-for="item in projectType" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="getServiceList">查询</el-button>
        </el-col>
      </el-row>

      <el-table :data="serviceList" @selection-change="handleSelectionChange">>
        <el-table-column type="selection"></el-table-column>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="name" label="项目名称"></el-table-column>
        <el-table-column prop="projectTypeId" label="项目类别" :formatter="projectTypeFormat"></el-table-column>
        <el-table-column prop="price" label="项目价格"></el-table-column>
        <el-table-column prop="referWorkTime" label="参考工时"></el-table-column>
        <el-table-column prop="pricePerUnit" label="工时单价"></el-table-column>
        <el-table-column prop="comment" label="备注" show-overflow-tooltip></el-table-column>
      </el-table>

      <!--分页器-->
      <el-row style="height: 80px">
        <pagingDevice
          :pageData.sync="pageData" @changePage="getServiceList"></pagingDevice>
      </el-row>


      <div slot="footer" class="dialog-footer">
        <el-button @click="projectAddVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveProject">确 定</el-button>
      </div>
    </el-dialog>

    <!--适用配件-添加模态框-->
    <el-dialog title="配件添加" :visible.sync="accessoriesVisible" width="80%">
      <el-form :model="accessoriesDialog[0]" :rules="accessoriesRules" ref="accessoriesForm">
        <el-table :data="accessoriesDialog">
          <el-table-column prop="type" label="配件类别">
            <template slot-scope="scope">
              <el-form-item prop="type">
                <el-input v-model="accessoriesDialog[0].type"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="配件名称">
            <template slot-scope="scope">
              <el-form-item prop="name">
                <el-input v-model="accessoriesDialog[0].name"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="count" label="数量">
            <template slot-scope="scope">
              <el-form-item prop="count">
                <el-input v-model.number="accessoriesDialog[0].count"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="unitPrice" label="单价">
            <template slot-scope="scope">
              <el-form-item prop="unitPrice">
                <el-input v-model.number="accessoriesDialog[0].unitPrice"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="totalPrice" label="总价">{{getTotalPrice}}</el-table-column>
        </el-table>
      </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="accessoriesVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveAccessoriesDialog('accessoriesForm')">确 定</el-button>
        </div>

    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'QuickBilling',
    data() {
      return {
        visible2: false,
        loading: false,
        input: '',
        itemName: '',
        selectValue: '',
        consumerOrder: {
          licensePlate: '',
          balance: '',
          carBrand: '',
          carId: '',
          carType: '',
          clientId: '',
          clientName: '',
          historyConsumption: null,
          isMember: '',
          lastMiles: '',
          phone: '',
          storeId: localStorage.getItem('storeId'),
          pickTime: '',
          pickCarStaffId: '',
          pickCarStaffName: '',
          totalPrice: null,
          miles: '',
          faultDescription: ''
        },
        consumerOrderRules: {
          licensePlate: [
            {required: true, message: '请输入车牌号码', trigger: 'blur'}
          ],
          pickCarStaffId: [
            {required: true, message: '请选择接车人员', trigger: 'blur'}
          ],
          pickTime: [
            {required: true, message: '请选择接车时间', trigger: 'blur'}
          ],
        },
        projectShow: [],
        projectSum: [],
        autoParts: [],
        accessoriesList: [],
        accessoriesVisible: false,
        accessoriesDialog: [],
        accessoriesSum: [],
        accessoriesRules: {
          type: [
            {required: true, message: '请输入类别', trigger: 'blur'}
          ],
          name: [
            {required: true, message: '请输入名称', trigger: 'blur'}
          ],
          count: [
            {type:'number', required: true, message: '请输入数字', trigger: 'blur'}
          ],
          unitPrice: [
            {type:'number', required: true, message: '请输入数字', trigger: 'blur'}
          ],
        },
        radio: '否',
        datetime: '',
        projectType: [],
        projectAddVisible: false,
        serviceList: [],
        pageData: {
          currentPage: 1,
          pageSize: 10,
          pageTotal: 100
        },
        multipleSelection: [],
        staffList: []
      }
    },
    methods: {
      // 获取订单详情
      getOrderDetail() {
        this.$get('/order/detail', {
          id: this.$route.query.id
        }).then(res => {
          console.log(res)
          this.consumerOrder = res.consumerOrder
          this.projectShow = res.consumerProjectInfos
          this.accessoriesList = res.autoParts
        })
      },

      // 获取项目类别列表
      getProjectType() {
        this.$get('/projectType/list', {
          storeId: localStorage.getItem('storeId'),
          currentPage: 1,
          pageSize: 1000
        }).then((res) => {
          this.projectType = res.data
        })
      },

      // 获取项目列表
      getServiceList() {
        this.$get('/project/list?', {
          storeId: localStorage.getItem('storeId'),
          currentPage: this.pageData.currentPage,
          pageSize: this.pageData.pageSize,
          name: this.itemName,
          projectTypeId: this.selectValue
        }).then((res) => {
          this.loading = false
          this.serviceList = res.data
          this.pageData.currentPage = res.currentPage
          this.pageData.pageSize = res.pageSize
          this.pageData.pageTotal = res.total
        })
      },

      // 获取员工列表
      getStaffList() {
        this.$get('/staff/list', {
          storeId: localStorage.getItem('storeId'),
          currentPage: 1,
          pageSize: 1000
        }).then((res) => {
          this.loading = false
          this.staffList = res.data
        })
      },

      // 项目名称过滤器
      projectTypeFormat(row) {
        let name = ''
        this.projectType.filter(v => {
          if (v.id === row.projectTypeId) {
            name = v.name
          }
        })
        return name
      },

      // 根据车牌查信息
      getCarInfo() {
        if (this.consumerOrder.licensePlate.length === 7) {
          this.$get('/order/loadClientInfoByLicensePlate', {
            licensePlate: this.consumerOrder.licensePlate,
            storeId: localStorage.getItem('storeId')
          }).then(res => {
            console.log(res)
            this.consumerOrder = res
          })
        }
        // else {
        //   this.consumerOrder = {
        //     licensePlate: this.consumerOrder.licensePlate,
        //     balance: '',
        //     carBrand: '',
        //     carId: '',
        //     carType: '',
        //     clientId: '',
        //     clientName: '',
        //     historyConsumption: null,
        //     isMember: '',
        //     lastMiles: '',
        //     phone: '',
        //     storeId: 1,
        //     pickTime: '',
        //     staffName: '',
        //     miles: '',
        //   }
        // }
      },

      // 保存快速开单
      submitOrder(formName, settlement) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$post('/order/handleOrder', {
              consumerOrder: {
                id: this.consumerOrder.id,
                licensePlate: this.consumerOrder.licensePlate,
                carBrand: this.consumerOrder.carBrand,
                carType: this.consumerOrder.carType,
                storeId: localStorage.getItem('storeId'),
                carId: this.consumerOrder.carId,
                lastMiles: this.consumerOrder.lastMiles,
                miles: this.consumerOrder.miles,
                clientId: this.consumerOrder.clientId,
                clientName: this.consumerOrder.clientName,
                phone: this.consumerOrder.phone,
                isMember: this.consumerOrder.isMember,
                pickTime: this.consumerOrder.pickTime,
                pickCarStaffId: this.consumerOrder.pickCarStaffId,
                pickCarStaffName: this.consumerOrder.pickCarStaffName,
                faultDescription: this.consumerOrder.faultDescription,
                totalPrice: this.projectPrice ? (this.accessoriesPrice ? this.projectPrice + this.accessoriesPrice : this.projectPrice) : 0
              },
              consumerProjectInfos: this.projectShow,
              autoParts: this.accessoriesList
            }).then(res => {
              if (settlement) {
                // 结算
                this.$router.push({path: '/ConsumptionOrder/SettlementCenter', query: {id: res}})
              } else {
                // 保存
                this.$message({
                  message: '保存成功',
                  type: 'success'
                })
                this.$router.push({path: '/ConsumptionOrder/DocumentManagement'})
              }
            })
          } else {
            this.$message({
              message: '请将信息填写完整',
              type: 'error'
            })
            return false
          }
        })
      },

      // 关闭小提示框
      handleClose(id) {
        this.$refs[id].doClose()
      },

      // 接车人员。选中员工后的回调，提取员工姓名
      changeStaff(id) {
        this.staffList.map(v => {
          if (v.id === id) {
            this.consumerOrder.pickCarStaffName = v.name
          }
        })
      },

      // 打开添加配件的模态框
      openAccessoriesDialog() {
        this.accessoriesVisible = true
        this.accessoriesDialog = [{
          type: '',
          name: '',
          count: null,
          unitPrice: null,
          totalPrice: null
        }]
      },

      // 添加配件模态框保存按钮
      saveAccessoriesDialog(formName) {
        this.$refs[formName].validate((valid) => {
            if (valid) {
              this.accessoriesList.push(this.accessoriesDialog[0])
              this.accessoriesVisible = false
            } else {
              this.$message({
                message: '请将信息填写完整',
                type: 'error'
              })
              return false
            }
        })
      },

      // 服务项目删除按钮
      projectHandleDelete(scope) {
        let arr = this.projectShow
        delete arr[scope.$index]
        let newArr = []
        arr.map(value => {
          if (value) {
            newArr.push(value)
          }
        })
        this.projectShow = newArr
        this.handleClose(scope.row.id)
      },

      // 配件删除按钮
      handleDelete(scope) {
        let arr = this.accessoriesList
        delete arr[scope.$index]
        let newArr = []
        arr.map(value => {
          if (value) {
            newArr.push(value)
          }
        })
        this.accessoriesList = newArr
        this.handleClose(scope.$index)
      },

      // 多选
      handleSelectionChange(val) {
        this.multipleSelection = val
      },

      // 添加服务项目的确定按钮
      saveProject() {
        this.projectAddVisible = false
        if (this.multipleSelection.length > 0) {
          this.multipleSelection.map(value => {
            let flag = false
            // 检查是否有和它相同的
            for (let i = 0; i < this.projectShow.length; i++) {
              if (this.projectShow[i].projectId === value.id) {
                flag = true
              }
            }
            // 如果没有就插入
            if (!flag) {
              this.projectShow.push({
                projectId: value.id,
                projectName: value.name,
                staffId: '',
                staffName: '',
                price: value.price
              })
            }
          })
        }
      },

      // 服务项目施工人员
      changeProjectStaff(scope) {
        this.staffList.map(v => {
          if (v.id === scope.row.staffId) {
            this.projectShow[scope.$index].staffId = v.id
            this.projectShow[scope.$index].staffName = v.name
          }
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
        this.projectSum = this.sum(param, 0, 2)
        return this.sum(param, 0, 2)
      },
      getFittingSummaries(param) {
        this.accessoriesSum = this.sum(param, 0, 5, true)
        return this.sum(param, 0, 5, true)
      },
    },
    computed: {
      // 添加配件模态框的总金额
      getTotalPrice() {
        let price = null
        if (this.accessoriesDialog.length > 0) {
          price = this.accessoriesDialog[0].count * this.accessoriesDialog[0].unitPrice
          this.accessoriesDialog[0].totalPrice = price
        }
        return price
      },

      // 项目
      projectPrice() {
        let value = this.projectSum.filter(value => value !== '' && (typeof value) === "number")
        return value[0]
      },

      // 配件
      accessoriesPrice() {
        let value = this.accessoriesSum.filter(value => value !== '' && (typeof value) === "number")
        return value[0]
      },

      // 是否可提交信息
      SubmitIsAbled() {
        if (this.consumerOrder.phone !== '' && this.projectShow.length > 0) {
          let name = this.projectShow.filter(value => value.staffName == '')
          return name.length === 0
        } else {
          return false
        }
      }
    },
    mounted: function () {
      if (this.$route.query.id) {
        this.getOrderDetail()
      }
      this.getServiceList()
      this.getProjectType()
      this.getStaffList()
    }
  }
</script>

<style lang="less" scoped>
  .el-input, .el-select {
    width: 50%;
  }

  .el-row {
    /*margin: 20px 0;*/
  }

  .el-card {
    margin-bottom: 40px;
  }

  .addButton {
    margin: 0 20px;
  }

  .redPrice {
    color: red;
    font-size: 25px;
    margin: 20px;
  }
</style>
