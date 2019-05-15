<template>
  <div>
    <!--查询框-->
    <el-row :gutter="30">
      <el-col :span="10">卡类名称：
        <el-input v-model="cardName" placeholder="请输入卡类名称"></el-input>
      </el-col>
      <el-col :span="5">
        <el-button type="primary" size="small" @click="getDataList">查询</el-button>
      </el-col>
    </el-row>

    <!--两个按钮-->
    <el-row :gutter="30">
      <el-col :span="4">
        <el-button type="primary" size="small" plain @click="addNewCard">新增储值卡</el-button>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" size="small" plain @click="allDelete">删除储值卡</el-button>
      </el-col>
    </el-row>

    <!--表格-->
    <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" border
              @selection-change="handleSelectionChange" v-loading="loading">
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="序号" type="index"></el-table-column>
      <el-table-column prop="name" label="卡类名称"></el-table-column>
      <el-table-column prop="price" label="售卡金额"></el-table-column>
      <el-table-column prop="actualPrice" label="卡面金额"></el-table-column>
      <el-table-column prop="validTime" label="有效期（年）"></el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column prop="comment" label="备注" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="modifyCard(scope.row)">修改</el-button>
          <el-popover
            placement="top"
            width="160"
            :ref="scope.$index">
            <p>确定删除本条抵用券？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="handleClose(scope.$index)">取消</el-button>
              <el-button type="primary" size="mini" @click="handleDelete(scope.row)">确定</el-button>
            </div>
          </el-popover>
          <el-button size="mini" v-popover="scope.$index" type="danger">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="up" label="上架/下架">
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
    <pagingDevice :pageData.sync="pageData" @changePage="getDataList"></pagingDevice>

    <!--新增卡类弹框-->
    <el-dialog v-loading="dialogLoading" :title="isModify?'修改卡类':'新增卡类'" :visible.sync="isShow">
      <el-form :model="dialog" :rules="dialogRules" ref="dialog" label-width="200px">
        <el-form-item label="卡名称：" prop="name">
          <el-input v-model="dialog.name" style="width: 80%" size="small"></el-input>
        </el-form-item>
        <el-form-item label="售卡金额：" prop="price">
          <el-input v-model="dialog.price" style="width: 80%" size="small"></el-input>
        </el-form-item>
        <el-form-item label="卡面金额：" prop="actualPrice">
          <el-input v-model="dialog.actualPrice" style="width: 80%" size="small"></el-input>
        </el-form-item>
        <el-form-item label="有效期（年）：" prop="validTime">
          <el-select v-model="dialog.validTime" placeholder="请选择" style="width: 80%">
            <el-option v-for="item in selectOptions" :key="item.value" :label="item.label"
                       :value="item.value"></el-option>
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
    name: 'CardManagement',
    data() {
      return {
        loading: true,
        dialogLoading: false,
        cardName: '',
        tableData: [],
        multipleSelection: [],
        pageData: {
          currentPage: 1,
          pageSize: 10,
          pageTotal: 1000
        },
        isShow: false,
        dialog: {
          name: '',
          price: '',
          actualPrice: '',
          validTime: '',
          comment: ''
        },
        dialogRules:{
          name: [
            { required: true, message: '请输入名称', trigger: 'blur' }
          ],
          price: [
            { required: true, message: '请输入金额', trigger: 'blur' }
          ],
          actualPrice: [
            { required: true, message: '请输入卡面金额', trigger: 'blur' }
          ],
          validTime: [
            { required: true, message: '请选择有效期', trigger: 'blur' }
          ],
        },
        isModify: false,
        selectOptions: [{
          label: '1年',
          value: '1'
        }]
      }
    },
    methods: {
      // 获取卡类列表
      getDataList() {
        this.$get('/cardService/list', {
          storeId: localStorage.getItem('storeId'),
          currentPage: this.pageData.currentPage,
          pageSize: this.pageData.pageSize,
          name: this.cardName
        }).then((res) => {
          this.loading = false
          this.tableData = res.data
          this.pageData.currentPage = res.currentPage
          this.pageData.pageSize = res.pageSize
          this.pageData.pageTotal = res.total
        })
      },

      // table多选功能
      handleSelectionChange(val) {
        this.multipleSelection = val
        console.log(val)
      },

      // 关闭再次确认的小窗口
      handleClose(id) {
        this.$refs[id].doClose()
      },

      // 上架下架
      upperShelf(row) {
        if (!row.bookOnline) {
          // 上架
          this.$get('/cardService/upperShelf', {
            id: row.id
          }).then(res => {
            this.$message({
              message: '上架成功',
              type: 'success'
            })
            this.getDataList()
          })
        } else {
          // 下架
          this.$get('/cardService/lowerShelf', {
            id: row.id
          }).then(res => {
            this.$message({
              message: '下架成功',
              type: 'success'
            })
            this.getDataList()
          })
        }
        this.handleClose(row.id)
      },

      // 行内删除
      handleDelete(row) {
        this.$get('/cardService/delete', {
          id: row.id
        }).then(res => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getDataList()
        })
      },

      // 批量删除
      allDelete() {
        let ids = []
        this.multipleSelection.filter(v => {
          ids.push(v.id)
        })
        this.$post('/cardService/batchDelete', {
          ids: ids.join(',')
        }).then(res => {
          this.$message({
            message: '批量删除成功',
            type: 'success'
          })
          this.getDataList()
        })
      },

      // 新增卡类
      addNewCard() {
        this.isModify = false
        this.dialog = {
          name: '',
          price: '',
          actualPrice: '',
          validTime: '',
          comment: '',
          id: ''
        }
        this.isShow = true
      },

      // 修改卡类
      modifyCard(row) {
        this.isModify = true
        this.dialogLoading = true
        this.isShow = true
        // 获取详细信息
        this.$get('/cardService/detail', {
          id: row.id
        }).then((res) => {
          this.dialog = res
          this.dialogLoading = false
        })
      },

      // 模态框的保存按钮
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
                message: '保存成功',
                type: 'success'
              })
              this.isShow = false
              this.getDataList()
            })
          } else {
            this.$message({
              message: '有信息未填写',
              type: 'error'
            })
            return false
          }
        })
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
