<template>
  <div>
    <!--会员信息模块-->
    <el-card shadow="hover" v-loading="formLoading">
      <div slot="header">
        <span>会员信息</span>
      </div>

      <!--表单部分-->
      <el-form :model="memberForm" :rules="memberRules" ref="memberForm" label-width="100px">

        <el-row>
          <el-col :span="11">
            <el-form-item label="客户姓名：">
              <el-input v-model="clientName" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item label="手机号码：">
              <el-input v-model="clientPhone" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="11">
            <el-form-item label="会员卡号：" prop="memberCard">
              <el-input v-model="memberForm.memberCard"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item label="会员卡类：" prop="cardServiceId">
              <el-select v-model="memberForm.cardServiceId" placeholder="请选择会员卡类" @change="chooseCard">
                <el-option v-for="item in cardList" :key="item.id" :label="item.name"
                           :value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="1">
            <addNewButton @click="handleShow"></addNewButton>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="11">
            <el-form-item label="售卡金额：">
              <el-input v-model="memberForm.cardAmount" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item label="有效期：">
              <el-input v-model="memberForm.validityPeriod" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="11">
            <el-form-item label="卡面金额：">
              <el-input v-model="memberForm.cardSurfaceAmount" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item label="折扣比例：">
              <el-input v-model="memberForm.discount" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="11">
            <el-form-item label="支付方式：">
              <el-select v-model="memberForm.payMethod" placeholder="请选择支付方式">
                <el-option v-for="item in payMethods" :key="item.code" :label="item.value"
                           :value="item.code"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11" :offset="1">
            <el-form-item label="办理人员：">
              <el-select v-model="memberForm.staffId" placeholder="请选择办理人员">
                <el-option v-for="item in staffList" :key="item.id" :label="item.name"
                           :value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>

      <!--按钮-->
      <el-row>
        <el-col :span="2" :offset="20">
          <el-button type="primary" @click="handleCard">办理</el-button>
        </el-col>
      </el-row>
    </el-card>

    <!--新增会员卡-->
    <el-dialog v-loading="dialogLoading" title="新增会员卡" :visible.sync="isShow">
      <el-form :model="dialog" :rules="dialogRules" ref="dialog" label-width="200px">
        <el-form-item label="卡类名称：" prop="name">
          <el-input v-model="dialog.name" style="width: 80%" size="small"></el-input>
        </el-form-item>
        <el-form-item label="售卡金额：" prop="price">
          <el-input v-model.number="dialog.price" style="width: 80%" size="small"></el-input>
        </el-form-item>
        <el-form-item label="卡面金额：" prop="actualPrice">
          <el-input v-model.number="dialog.actualPrice" style="width: 80%" size="small"></el-input>
        </el-form-item>
        <el-form-item label="有效期（年）：" prop="validTime">
          <el-select v-model="dialog.validTime" placeholder="请选择" style="width: 80%">
            <el-option v-for="item in validTimeList" :key="item.code" :label="item.value"
                       :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注：" prop="comment">
          <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="dialog.comment" style="width:80%"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="isShow = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

  export default {
    name: 'MemberProcessing',
    data() {
      return {
        isShow: false,
        dialog: {
          name: '',
          price: '',
          actualPrice: '',
          validTime: '',
          comment: ''
        },
        memberRules:{
          memberCard: [
            {required: true, message: '请输入会员卡号', trigger: 'blur'}
          ],
          cardServiceId: [
            {required: true, message: '请选择会员卡类', trigger: 'blur'}
          ]
        },
        dialogRules:{
          name: [
            {required: true, message: '请输入名称', trigger: 'blur'}
          ],
          price: [
            {required: true, message: '请输入价格', trigger: 'blur'},
            {type:'number',required: true, message: '只能输入数字', trigger: 'blur'}
          ],
          actualPrice: [
            {required: true, message: '请输入实际价格', trigger: 'blur'},
            {type:'number',required: true, message: '只能输入数字', trigger: 'blur'}
          ],
          validTime: [
            {required: true, message: '请选择有效期', trigger: 'blur'}
          ]
        },
        dialogLoading: false,
        clientName: '',
        clientPhone: '',
        memberForm: {
          memberCard: '',
          cardServiceId: '',
          cardAmount: '',
          validityPeriod: '',
          cardSurfaceAmount: '',
          discount: '',
          payMethod: '',
          staffId: ''
        },
        payMethods: [
          {
            code: '1',
            value: '现金'
          }, {
            code: '2',
            value: '微信'
          }, {
            code: '3',
            value: '支付宝'
          }, {
            code: '4',
            value: '易付宝'
          }, {
            code: '5',
            value: '刷卡'
          }
        ],
        cardList: [],
        staffList: [],
        formLoading: false,
        validTimeList: [
          {
            value: '1年',
            code: 1,
          },
        ]
      }
    },
    methods: {
      // 获取客户基本信息
      getClientInfo() {
        this.formLoading = true
        this.$get('/client/detail', {
          id: this.$route.query.id
        }).then(res => {
          this.clientName = res.name
          this.clientPhone = res.phone
          this.formLoading = false
        })
      },

      // 获取工作人员列表
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

      // 获取卡类列表
      getCardList() {
        this.$get('/cardService/list', {
          storeId: localStorage.getItem('storeId'),
          currentPage: 1,
          pageSize: 1000
        }).then((res) => {
          this.loading = false
          this.cardList = res.data
        })
      },

      // 选择会员卡
      chooseCard(val) {
        this.cardList.map(item => {
          if (item.id === val) {
            this.memberForm.cardAmount = item.price
            this.memberForm.validityPeriod = item.validTime + '年'
            this.memberForm.cardSurfaceAmount = item.actualPrice
            this.memberForm.discount = (1-item.price / item.actualPrice) * 100 + '%'
          }
        })
      },

      // 提交办卡信息
      handleCard() {
        this.$refs['memberForm'].validate((valid) => {
          if (valid) {
            this.$post('/card/handleCard', {
              storeId: localStorage.getItem('storeId'),
              cardNumber: this.memberForm.memberCard,
              payMethod: this.memberForm.payMethod,
              staffId: this.memberForm.staffId,
              clientId: this.$route.query.id,
              cardServiceId: this.memberForm.cardServiceId
            }).then(res => {
              this.formLoading = false
              this.$message({
                message: '办理成功',
                type: 'success'
              })
              this.$router.go(-1)
            })
          } else {
            this.$message({
              message: '有信息未填写',
              type: 'error'
            })
            return false
          }
        })
      },

      // 显示新增会员卡弹框
      handleShow() {
        this.isShow = true
        this.dialog = {
          name: '',
          price: '',
          actualPrice: '',
          validTime: '',
          comment: ''
        }
      },

      // 新增卡类提交
      submit() {
        this.$refs['dialog'].validate((valid) => {
          if (valid) {
            this.dialogLoading = true
            this.$post('/cardService/modify', {
              id: this.dialog.id,
              name: this.dialog.name,
              price: this.dialog.price,
              actualPrice: this.dialog.actualPrice,
              validTime: this.dialog.validTime,
              comment: this.dialog.comment,
              storeId: localStorage.getItem('storeId')
            }).then(res => {
              this.dialogLoading = false
              this.$message({
                message: '新增成功',
                type: 'success'
              })
              this.memberForm.cardAmount = ''
              this.memberForm.validityPeriod = ''
              this.memberForm.cardSurfaceAmount = ''
              this.memberForm.discount = ''
              this.isShow = false
              this.getCardList()
            })
          } else {
            this.$message({
              message: '信息不完整',
              type: 'error'
            })
            return false
          }
        })

      }
    },
    mounted: function () {
      this.getClientInfo()
      this.getStaffList()
      this.getCardList()
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

  .el-row {
    margin: 20px;
  }
</style>
