<template>
  <div>
    <!--查询框-->
    <el-row :gutter="20">
      <el-col :span="8">员工工号：
        <el-input v-model="staffId" placeholder="请输入内容"></el-input>
      </el-col>
      <el-col :span="8">员工姓名：
        <el-input v-model="staffName" placeholder="请输入内容"></el-input>
      </el-col>
      <el-col :span="4">
        <el-button size="small" type="primary" @click="getDataList">查询</el-button>
      </el-col>
    </el-row>

    <!--两个按钮-->
    <el-row :gutter="10">
      <el-col :span="4">
        <el-button type="primary" size="small" plain @click="addNewStaff">新增员工</el-button>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" size="small" plain @click="allDelete">删除员工</el-button>
      </el-col>
    </el-row>

    <!--表格-->
    <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" border
              @selection-change="handleSelectionChange" v-loading="loading">
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="序号" type="index"></el-table-column>
      <el-table-column prop="staffNumber" label="员工工号"></el-table-column>
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="gender" label="性别"></el-table-column>
      <el-table-column prop="phone" label="手机号"></el-table-column>
      <el-table-column prop="position" label="职位"></el-table-column>
      <el-table-column prop="level" label="级别"></el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column prop="comment" label="备注" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="modifyStaff(scope.row)">修改</el-button>
          <el-popover placement="top" width="160" :ref="scope.row.id">
            <p>确定删除？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="handleClose(scope.row.id)">取消</el-button>
              <el-button type="primary" size="mini" @click="handleDelete(scope.row)">确定</el-button>
            </div>
          </el-popover>
          <el-button size="mini" v-popover="scope.row.id" type="danger">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="opening" label="智能柜技师功能">
        <template slot-scope="scope">
          <el-popover placement="top" width="160" :ref="scope.row.name">
            <p>确定关闭技师端账号吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="handleClose(scope.row.name)">取消</el-button>
              <el-button type="primary" size="mini" @click="closeArk(scope.row)">确定</el-button>
            </div>
          </el-popover>
          <el-button size="mini" v-popover="scope.row.name" type="info"
                     v-show="scope.row.isArk">关闭
          </el-button>
          <el-button size="mini" @click="handleEdit(scope.row)" type="success"
                     v-show="!scope.row.isArk" style="margin-left: 0;">开通
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页器-->
    <pagingDevice
      :pageData.sync="pageData"
      @changePage="getDataList"></pagingDevice>

    <!--新增员工、修改员工模态框-->
    <el-dialog :title="isModifyStaff?'修改员工信息':'新增员工信息'" :visible.sync="dialogVisible1" v-loading="dialogLoading1">
      <el-row>
        <el-col :span="4" :offset="2">员工姓名：</el-col>
        <el-col :span="18">
          <el-input v-model="staffData.name" placeholder="请输入内容" style="width: 80%" size="small"></el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4" :offset="2">性别：</el-col>
        <el-col :span="18">
          <el-radio-group v-model="staffData.gender" style="width: 80%">
            <el-radio label="男"></el-radio>
            <el-radio label="女"></el-radio>
          </el-radio-group>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4" :offset="2">手机号码：</el-col>
        <el-col :span="18">
          <el-input v-model="staffData.phone" placeholder="请输入内容" style="width: 80%" size="small"></el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4" :offset="2">职位：</el-col>
        <el-col :span="18">
          <el-select v-model="staffData.position" placeholder="请选择职位" size="small">
            <el-option v-for="item in positionOptions" :key="item.value" :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4" :offset="2">级别：</el-col>
        <el-col :span="18">
          <el-select v-model="staffData.level" placeholder="请选择级别" size="small">
            <el-option v-for="item in levelOptions" :key="item.value" :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4" :offset="2">备注：</el-col>
        <el-col :span="18">
          <el-input type="textarea" placeholder="请输入内容" v-model="staffData.comment" style="width:80%"></el-input>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="submitModifyStaff">确 定</el-button>
      </div>
    </el-dialog>

    <!--技师开通智能柜模态框-->
    <el-dialog title="开通技师端账号" :visible.sync="dialogVisible2">
      <el-row>
        <el-col :span="6" :offset="2">技师登录账号：</el-col>
        <el-col :span="16">
          <el-input v-model="arkAccount.account" placeholder="请输入内容" style="width: 80%" size="small"></el-input>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6" :offset="2">技师登录密码：</el-col>
        <el-col :span="16">
          <el-input v-model="arkAccount.password" placeholder="请输入内容" style="width: 80%" size="small"></el-input>
        </el-col>
      </el-row>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="submitArkAccount">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'EmployeeManagement',
    data() {
      return {
        loading: '',
        staffId: '',
        staffName: '',
        tableData: [],
        multipleSelection: [],
        isModifyStaff: false,
        pageData: {
          currentPage: 1,
          pageSize: 10,
          pageTotal: 1000
        },
        gender: '',
        staffData: {},
        arkAccount: {
          id: '',
          account: '',
          password: ''
        },
        positionOptions: [
          {
            label: '洗车工',
            value: '洗车工'
          },
          {
            label: '打蜡工',
            value: '打蜡工'
          },
          {
            label: '维修技师',
            value: '维修技师'
          }
        ],
        levelOptions: [
          {
            label: '初级',
            value: '初级'
          },
          {
            label: '中级',
            value: '中级'
          },
          {
            label: '高级',
            value: '高级'
          }
        ],
        dialogVisible1: false,
        dialogVisible2: false,
        dialogLoading1: false,
      }
    },
    methods: {
      // 获取员工列表
      getDataList() {
        this.$get('/staff/list', {
          storeId: localStorage.getItem('storeId'),
          currentPage: this.pageData.currentPage,
          pageSize: this.pageData.pageSize,
          name: this.staffName,
          staffNumber: this.staffId
        }).then((res) => {
          this.loading = false
          this.tableData = res.data
          this.pageData.currentPage = res.currentPage
          this.pageData.pageSize = res.pageSize
          this.pageData.pageTotal = res.total
        })
      },

      // 批量删除
      allDelete() {
        let ids = []
        this.multipleSelection.filter(v => {
          ids.push(v.id)
        })
        this.$post('/staff/batchDelete', {
          ids: ids.join(',')
        }).then(res => {
          this.$message({
            message: '批量删除成功',
            type: 'success'
          })
          this.getDataList()
        })
      },

      // 新增员工
      addNewStaff() {
        this.isModifyStaff = false
        this.staffData = {
          name: '',
          gender: '',
          phone: '',
          position: '',
          level: '',
          comment: '',
          id: ''
        }
        this.dialogVisible1 = true
      },

      // 修改员工
      modifyStaff(row) {
        this.isModifyStaff = true
        this.dialogLoading1 = true
        this.dialogVisible1 = true
        // 获取详细信息
        this.$get('/staff/detail', {
          id: row.id
        }).then((res) => {
          this.staffData = res
          this.dialogLoading1 = false
        })

      },

      // 提交新增、修改员工
      submitModifyStaff() {
        this.dialogLoading1 = true
        this.$post('/staff/modify', {
          id: this.staffData.id,
          storeId: localStorage.getItem('storeId'),
          comment: this.staffData.comment,
          name: this.staffData.name,
          phone: this.staffData.phone,
          gender: this.staffData.gender,
          level: this.staffData.level,
          position: this.staffData.position
        }).then(res => {
          this.dialogLoading1 = false
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          this.dialogVisible1 = false
          this.getDataList()
        })
      },

      // table多选功能
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },

      // 删除单个员工
      handleDelete(row) {
        this.$get('/staff/delete', {
          id: row.id
        }).then(res => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.handleClose(row.id)
          this.getDataList()
        })
      },

      // 开通智能柜打开弹框
      handleEdit(row) {
        this.dialogVisible2 = true
        this.arkAccount = {
          id: row.id,
          account: '',
          password: ''
        }
      },

      // 开通智能柜提交
      submitArkAccount() {
        this.$get('/staff/openArk', {
          id: this.arkAccount.id,
          account: this.arkAccount.account,
          password: this.arkAccount.password
        }).then(res => {
          this.$message({
            message: '成功开通智能柜账号',
            type: 'success'
          })
          this.dialogVisible2 = false
          this.getDataList()
        })
      },

      // 关闭智能柜
      closeArk(row) {
        this.$get('/staff/closeArk', {
          id: row.id
        }).then(res => {
          this.$message({
            message: '成功关闭智能柜功能',
            type: 'success'
          })
          this.handleClose(row.name)
          this.getDataList()
        })
      },

      // 关闭小提示框
      handleClose(id) {
        this.$refs[id].doClose()
      }
    },
    mounted: function () {
      this.getDataList()
    }
  }
</script>

<style lang="less" scoped>
  .el-input {
    width: 60%;
  }

  .el-row {
    margin-bottom: 30px;
  }
</style>
