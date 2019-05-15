<template>
  <div>
    <!--查询条件框-->
    <el-row :gutter="5">
      <el-col :span="10">
        <span>支出类别：</span>
        <el-select v-model="selectValue" placeholder="请选择" style="width: 60%" size="small">
          <el-option v-for="item in selectOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-col>
      <el-col :span="10">
        <span>选择查找日期：</span>
        <el-date-picker
          style="width: 18vw;"
          v-model="dateValue"
          type="daterange"
          size="small"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" size="small">查询</el-button>
      </el-col>
      <el-col :span="2">
        <el-button type="primary" size="small">导出Excel</el-button>
      </el-col>
    </el-row>

    <!--两个按钮-->
    <el-row :gutter="30" style="margin-top: 30px;">
      <el-col :span="4">
        <el-button type="primary" size="small" plain @click="handleModify(false)">增加</el-button>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" size="small" plain>删除</el-button>
      </el-col>
    </el-row>

    <!--表格-->
    <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" border
              @selection-change="handleSelectionChange" v-loading="loading">
      <el-table-column type="selection"></el-table-column>
      <el-table-column label="序号" type="index"></el-table-column>
      <el-table-column prop="costTime" label="支出时间"></el-table-column>
      <el-table-column prop="costCategory" label="支出类别"></el-table-column>
      <el-table-column prop="costPrice" label="支出金额"></el-table-column>
      <el-table-column prop="comment" label="备注" show-overflow-tooltip></el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleModify(true,scope.row)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页器-->
    <pagingDevice
      :pageData.sync="pageData"
      @changePage="getDataList"></pagingDevice>

    <!--增加、修改对话框-->
    <el-dialog :title="addOrChange" :visible.sync="isShow">
      <el-row style="margin-top: 20px">
        <el-col :span="4" :offset="2">支出日期：</el-col>
        <el-col :span="18">
          <el-date-picker
            style="width: 80%;"
            v-model="dateValue"
            type="daterange"
            size="small"
            range-separator="~"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-col>
      </el-row>

      <el-row style="margin-top: 20px">
        <el-col :span="4" :offset="2">支出类别：</el-col>
        <el-col :span="18">
          <el-select v-model="selectValue" placeholder="请选择" style="width: 80%" size="small">
            <el-option v-for="item in selectOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-col>
      </el-row>

      <el-row style="margin-top: 20px">
        <el-col :span="4" :offset="2">支出金额：</el-col>
        <el-col :span="18">
          <el-input v-model="input" style="width: 80%" size="small"></el-input>
        </el-col>
      </el-row>

      <el-row style="margin-top: 20px">
        <el-col :span="4" :offset="2">备注</el-col>
        <el-col :span="18">
          <el-input  type="textarea" placeholder="请输入内容" v-model="input" style="width:80%"></el-input>
        </el-col>
      </el-row>

      <div slot="footer" class="dialog-footer">
        <el-button @click="isShow = false">取 消</el-button>
        <el-button type="primary" @click="isShow = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'ProcurementExpenditure',
    data() {
      return {
        selectValue: '',
        selectOptions: [{
          label: '',
          value: ''
        }],
        dateValue: '',
        tableData: [{}],
        loading: '',
        addOrChange: '',
        isShow: false,
        pageData: {
          currentPage: 1,
          pageSize: 10,
          pageTotal: 1000
        }
      }
    },
    methods: {
      handleSelectionChange() {},
      handleModify(type, row) {
        this.isShow = true;
        if(type === true){
          //修改
          this.addOrChange = '支出修改'
        }else {
          //增加
          this.addOrChange = '增加支出'
        }
      }
    },
    getDataList() {}
  }
</script>

<style scoped>
  .el-table {
    margin-top: 30px;
  }
</style>
