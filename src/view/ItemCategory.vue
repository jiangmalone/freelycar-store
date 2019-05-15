<template>
  <div>
    <!--标签页-->
    <el-tabs v-model="item">

      <!--项目管理-->
      <el-tab-pane label="项目管理" name="first">

        <!--条件查询-->
        <el-row>
          <el-col :span="10">
            <span>项目名称：</span>
            <el-input v-model="itemName" size="small"></el-input>
          </el-col>
          <el-col :span="10" :offset="1">
            <span>项目类别：</span>
            <el-select size="small" v-model="itemCategory" placeholder="请选择" style="width: 80%">
              <el-option v-for="item in tableData1" :key="item.id" :label="item.name"
                         :value="item.id"></el-option>
            </el-select>
          </el-col>
          <el-col :span="2" :offset="1">
            <el-button type="primary" size="small" @click="getTableData2">查询</el-button>
          </el-col>
        </el-row>

        <!--按钮-->
        <el-row :gutter="30">
          <el-col :span="3">
            <el-button type="primary" plain size="small" @click="addProject2(false)">新增项目</el-button>
          </el-col>
          <el-col :span="3">
            <el-button type="primary" plain size="small" @click="allDelete">删除项目</el-button>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" plain size="small" @click="uploadFile">上传导入文件</el-button>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" plain size="small" @click="downloadFile">下载导入模板</el-button>
          </el-col>
        </el-row>

        <!--表格-->
        <el-table ref="multipleTable" :data="tableData2" tooltip-effect="dark" border
                  @selection-change="handleSelectionChange">
          <el-table-column align="center" type="selection"></el-table-column>
          <el-table-column align="center" label="序号" type="index"></el-table-column>
          <el-table-column align="center" prop="name" label="项目名称"></el-table-column>
          <el-table-column align="center" prop="projectType" label="项目类别"></el-table-column>
          <el-table-column align="center" prop="price" label="项目价格"></el-table-column>
          <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
          <el-table-column align="center" prop="comment" label="备注" show-overflow-tooltip></el-table-column>

          <el-table-column align="center" label="操作" width="150">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="modifyProject2(scope.row)">修改</el-button>
              <el-popover placement="top" width="160" :ref="scope.$index">
                <p>确定删除？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="handleClose(scope.$index)">取消</el-button>
                  <el-button type="primary" size="mini" @click="handleDelete(scope.row)">确定</el-button>
                </div>
              </el-popover>
              <el-button slot="reference" size="mini" type="danger" v-popover="scope.$index">删除</el-button>
            </template>
          </el-table-column>

          <el-table-column align="center" prop="saleStatus" label="智能柜服务">
            <template slot-scope="scope">
              <el-popover
                placement="top"
                width="160"
                :ref="scope.row.name">
                <p>确定{{!scope.row.saleStatus ? '开通智能柜服务' : '取消智能柜服务'}}？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="handleClose(scope.row.name)">取消</el-button>
                  <el-button type="primary" size="mini" @click="openService(scope.row)">确定</el-button>
                </div>
              </el-popover>
              <el-button size="mini" :type="!scope.row.saleStatus ? 'info': 'success'" v-popover="scope.row.name">
                {{!scope.row.saleStatus ? '开通':'取消'}}
              </el-button>
            </template>
          </el-table-column>

          <el-table-column align="center" prop="bookOnline" label="上架/下架">
            <template slot-scope="scope">
              <el-popover
                placement="top"
                width="160"
                :ref="scope.row.id">
                <p>确定进行{{scope.row.bookOnline? '下架' : '上架'}}？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="handleClose(scope.row.id)">取消</el-button>
                  <el-button type="primary" size="mini" @click="upperShelf(scope.row)">确定</el-button>
                </div>
              </el-popover>
              <el-button size="mini" :type="scope.row.bookOnline?'success':'info'" v-popover="scope.row.id">
                {{ scope.row.bookOnline?'下架':'上架'}}
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!--分页器-->
        <el-row class="show">
          <pagingDevice
            :pageData.sync="pageData2"
            @changePage="getTableData2"></pagingDevice>
        </el-row>

      </el-tab-pane>

      <!--项目类别-->
      <el-tab-pane label="项目类别" name="second">

        <!--新增类别按钮-->
        <el-row>
          <el-button type="primary" @click="addProject" plain size="small">新增类别</el-button>
        </el-row>

        <!--表格-->
        <el-table :data="tableData1" border>
          <el-table-column label="序号" type="index" align="center"></el-table-column>
          <el-table-column prop="name" label="类别名称" align="center"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
          <el-table-column prop="comment" label="备注" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="modifyProject(scope.row)">修改</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!--分页器-->
        <el-row class="show">
          <pagingDevice
            :pageData.sync="pageData1"
            @changePage="getTableData1"></pagingDevice>
        </el-row>

      </el-tab-pane>
    </el-tabs>

    <!--项目类别模态框-->
    <el-dialog v-loading="dialogLoading1" :title="projectIsModify?'修改项目类别':'新增项目类别'"
               :visible.sync="addCategoryVisible" width="50%">
        <el-form :model="dialog1" :rules="dialog1Rules" ref="dialog1" label-width="100px">
            <el-form-item label="类别名称：" prop="name">
              <el-input v-model="dialog1.name" placeholder="请输入内容" style="width: 80%" size="small"></el-input>
            </el-form-item>
          <el-form-item label="备注：">
            <el-input type="textarea" :rows="2" placeholder="请输入内容" v-model="dialog1.comment"
                      style="width:80%"></el-input>
          </el-form-item>
        </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="addCategoryVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitData1">确 定</el-button>
      </div>
    </el-dialog>

    <!--项目管理模态框-->
    <el-dialog v-loading="dialogLoading2" :title="projectIsModify2?'修改项目':'新增项目'" :visible.sync="addManagementVisible">
      <el-form :model="dialog2" :rules="dialog2Rules" ref="dialog2" label-width="100px">
        <el-form-item label="项目名称：" prop="name">
          <el-input v-model="dialog2.name" placeholder="请输入内容" style="width: 80%" size="small"></el-input>
        </el-form-item>
        <el-form-item label="项目类别：" prop="projectTypeId">
          <el-select v-model="dialog2.projectTypeId" placeholder="请选择" style="width: 80%">
            <el-option v-for="item in tableData1" :key="item.id" :label="item.name"
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目价格：" prop="price">
          <el-input v-model="dialog2.price" placeholder="请输入内容" style="width: 80%" size="small"></el-input>
        </el-form-item>
        <el-form-item label="备注：" prop="comment">
          <el-input type="textarea" placeholder="请输入内容" v-model="dialog2.comment" style="width:80%"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="addManagementVisible =false">取 消</el-button>
        <el-button type="primary" @click="submitData2">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    name: 'ItemCategory',
    data() {
      return {
        loading: true,
        input: '',
        item: 'first',
        itemName: '',
        itemCategory: '',
        multipleSelection: [],
        tableData1: [],
        tableData2: [],
        pageData1: {
          currentPage: 1,
          pageSize: 10,
          pageTotal: 100
        },
        pageData2: {
          currentPage: 1,
          pageSize: 10,
          pageTotal: 100
        },
        dialog1: {
          name:'',
          comment:'',
        },
        dialog1Rules:{
          name: [
            { required: true, message: '请输入名称', trigger: 'blur' }
          ]
        },
        dialog2: {
          name:'',
          projectTypeId:'',
          price:null,
          comment:'',
        },
        dialog2Rules:{
          name: [
            { required: true, message: '请输入名称', trigger: 'blur' }
          ],
          projectTypeId: [
            { required: true, message: '请选择项目类别', trigger: 'blur' }
          ],
          price: [
            { required: true, message: '请输入价格', trigger: 'blur' }
          ]
        },
        dialogLoading1: false,
        dialogLoading2: false,
        projectIsModify: false,
        projectIsModify2: false,
        addCategoryVisible: false,
        addManagementVisible: false,
        selectValue: '',
        selectOptions: [{
          label: '项目一',
          value: 'one',
        }]
      }
    },
    methods: {
      /**
       *项目类别
       */

      // 获取项目类别列表
      getTableData1() {
        this.$get('/projectType/list', {
          storeId: localStorage.getItem('storeId'),
          currentPage: this.pageData1.currentPage,
          pageSize: this.pageData1.pageSize
        }).then((res) => {
          this.loading = false
          this.tableData1 = res.data
          this.pageData1.currentPage = res.currentPage
          this.pageData1.pageSize = res.pageSize
          this.pageData1.pageTotal = res.total
        })
      },

      // 新增类别
      addProject() {
        this.addCategoryVisible = true
        this.projectIsModify = false
        this.dialog1 = {
          id: '',
          name: '',
          comment: '',
          storeId: localStorage.getItem('storeId')
        }
      },

      // 修改按钮（打开弹框、要获取项目详情）
      modifyProject(row) {
        this.addCategoryVisible = true
        this.dialogLoading1 = true
        this.projectIsModify = true
        this.$get('/projectType/detail', {
          id: row.id
        }).then((res) => {
          this.dialog1 = res
          this.dialogLoading1 = false
        })
      },

      // 保存按钮（提交）
      submitData1() {
        this.$refs['dialog1'].validate((valid) => {
          if (valid) {
            this.dialogLoading1 = true
            this.$post('/projectType/modify', {
              id: this.dialog1.id,
              name: this.dialog1.name,
              comment: this.dialog1.comment,
              storeId: localStorage.getItem('storeId')
            }).then((res) => {
              this.dialogLoading1 = false
              this.$message({
                message: '保存成功',
                type: 'success'
              })
              this.addCategoryVisible = false
              this.getTableData1()
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

      /**
       *项目管理
       */

      // 获取项目管理列表
      getTableData2() {
        this.$get('/project/list?', {
          storeId: localStorage.getItem('storeId'),
          currentPage: this.pageData2.currentPage,
          pageSize: this.pageData2.pageSize,
          name: this.itemName,
          projectTypeId: this.itemCategory
        }).then((res) => {
          this.loading = false
          this.tableData2 = res.data
          this.pageData2.currentPage = res.currentPage
          this.pageData2.pageSize = res.pageSize
          this.pageData2.pageTotal = res.total
        })
      },

      // 新增类别
      addProject2() {
        this.addManagementVisible = true
        this.projectIsModify2 = false
        this.dialog2 = {
          id: '',
          name: '',
          projectType: '',
          projectTypeId: '',
          price: null,
          comment: '',
          storeId: localStorage.getItem('storeId')
        }
      },

      // 修改按钮（打开弹框、要获取项目详情）
      modifyProject2(row) {
        this.addManagementVisible = true
        this.dialogLoading2 = true
        this.projectIsModify2 = true
        this.$get('/project/detail', {
          id: row.id
        }).then((res) => {
          this.dialog2 = res
          this.dialogLoading2 = false
        })
      },

      // 保存按钮（提交）
      submitData2() {
        this.$refs['dialog2'].validate((valid) => {
          if (valid) {
            this.dialogLoading2 = true
            this.$post('/project/modify', {
              id: this.dialog2.id,
              name: this.dialog2.name,
              projectTypeId: this.dialog2.projectTypeId,
              price: this.dialog2.price,
              comment: this.dialog2.comment,
              storeId: localStorage.getItem('storeId')
            }).then((res) => {
              this.dialogLoading2 = false
              this.$message({
                message: '保存成功',
                type: 'success'
              })
              this.addManagementVisible = false
              this.getTableData2()
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

      // 批量删除项目
      allDelete() {
        let ids = []
        this.multipleSelection.filter(v => {
          ids.push(v.id)
        })
        this.$post('/project/batchDelete',{
          ids:ids.join(',')
        }).then(res=>{
          this.$message({
            message: '批量删除成功',
            type: 'success'
          })
          this.getDataList()
        })
      },

      // 上传导入文件
      uploadFile() {

      },

      // 下载导入模板
      downloadFile() {

      },

      // 项目管理行内删除单个项目
      handleDelete(row) {
        this.$get('/project/delete', {
          id: row.id
        }).then((res) => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getTableData2()
        })
      },

      // 智能柜服务
      openService(row) {
        if (!row.saleStatus) {
          // 上架
          this.$get('/project/upperArk', {
            id: row.id
          }).then(res => {
            this.$message({
              message: '开通智能柜成功',
              type: 'success'
            })
            this.getTableData2()
          })
        } else {
          // 下架
          this.$get('/project/lowerArk', {
            id: row.id
          }).then(res => {
            this.$message({
              message: '关闭智能柜成功',
              type: 'success'
            })
            this.getTableData2()
          })
        }
        this.handleClose(row.id);
      },

      // 上架下架
      upperShelf(row) {
        if (!row.bookOnline) {
          // 上架
          this.$get('/project/upperShelf', {
            id: row.id
          }).then(res => {
            this.$message({
              message: '上架成功',
              type: 'success'
            })
            this.getTableData2()
          })
        } else {
          // 下架
          this.$get('/project/lowerShelf', {
            id: row.id
          }).then(res => {
            this.$message({
              message: '下架成功',
              type: 'success'
            })
            this.getTableData2()
          })
        }
        this.handleClose(row.id);
      },

      // table多选功能
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },

      //关闭二次确认提示框
      handleClose(id) {
        this.$refs[id].doClose()
      }
    },
    mounted: function () {
      this.getTableData1()
      this.getTableData2()
    }
  }
</script>

<style lang="less" scoped>
  .el-row {
    margin-top: 20px;
  }

  .el-table {
    margin-top: 30px;
  }

  .el-input {
    width: 60%;
  }

  .show > div:nth-of-type(1) {
    height: 82px;
  }
</style>
