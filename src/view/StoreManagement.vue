<template>
  <div>
    <el-card shadow="hover">
      <div slot="header">
        <span>门店信息</span>
      </div>

      <!--表单信息-->
      <el-row>
        <el-col :span="15">
          <el-form :model="storeForm" label-width="100px">
            <el-form-item label="门店名称：" prop="storeName">
              <el-input v-model="storeForm.name"></el-input>
            </el-form-item>
            <el-form-item label="门店地址：" prop="storeAddress">
              <el-input v-model="storeForm.address"></el-input>
            </el-form-item>
            <el-form-item label="营业时间：" prop="businessHour">
              <el-time-picker
                is-range
                v-model="storeForm.time"
                range-separator="~"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="请选择时间">
              </el-time-picker>
            </el-form-item>
            <el-form-item label="客服电话：" prop="servicePhone">
              <el-input v-model="storeForm.phone"></el-input>
            </el-form-item>
          </el-form>
          <el-button type="primary" @click="submitInfo">确认上传</el-button>
        </el-col>

        <!--图片上传-->
        <el-col :span="7" :offset="2">
          <p>上传图片：</p>
          <el-upload
            action="https://www.freelycar.com/api/upload/storeimg"
            multiple
            list-type="picture-card"
            :limit="5"
            :before-upload="beforeUploadPicture"
            :on-preview="handlePictureCardPreview"
            :on-progress="uploadProgress"
            :on-remove="handleRemove"
            :on-success="uploadSuccess"
            :on-error="uploadError"
            :file-list="fileList"
            class="imgWidth imgListWidth">
            <i class="el-icon-plus icon-position"></i>
            <div slot="tip" class="el-upload__tip">*最多上传五张图片</div>
            <div slot="tip" class="el-upload__tip">*注意图片方向和大小</div>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'StoreManagement',
    data() {
      return {
        storeForm: {
          name: '',
          address: '',
          time: [],
          phone: ''
        },
        storeImgIds: [],
        storeImgs: [],
        dialogImageUrl: '',
        dialogVisible: false,
        fileList: []
      }
    },
    methods: {
      // 获取门店信息
      getStoreDetail() {
        this.$get('/store/detail', {
          id: localStorage.getItem('storeId')
        }).then(res => {
          this.storeForm.name = res.store.name
          this.storeForm.address = res.store.address
          this.storeForm.phone = res.store.phone
          this.storeForm.time = [new Date(res.store.openingTime), new Date(res.store.closingTime)]
          this.storeImgs = res.storeImgs?res.storeImgs:[]
          this.storeImgs.forEach(value => {
            this.fileList.push({name:value.id,url:value.url})
            this.storeImgIds.push(value.id)
          })
        })
      },

      // 修改门店信息
      submitInfo() {
        console.log(this.storeForm.time)
        this.$post('/store/confirmInfo', {
          store: {
            id: localStorage.getItem('storeId'),
            name: this.storeForm.name,
            address: this.storeForm.address,
            phone: this.storeForm.phone,
            openingTime: this.storeForm.time[0],
            closingTime: this.storeForm.time[1]
          },
          storeImgIds: this.storeImgIds
        }).then(res=>{
          this.$message({
            message: '门店信息保存成功',
            type: 'success'
          })
        })
      },

      beforeUploadPicture() {
        console.log('beforeUploadPicture')
      },

      // 放大
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url
        this.dialogVisible = true
      },

      // 正在传的过程中
      uploadProgress() {
        console.log('uploadProgress')
      },

      // 删除照片
      handleRemove(file,fileList) {
        this.storeImgIds=[]
        fileList.forEach(value=>{
          this.storeImgIds.push(value.name)
        })
      },

      // 上传成功
      uploadSuccess(file) {
        this.storeImgIds.push(file.data.id)
      },

      uploadError(err) {
        console.log('uploadError')
      }
    },
    mounted: function () {
      this.getStoreDetail()
    }
  }
</script>

<style lang="less" scoped>
  .imgWidth /deep/ .el-upload--picture-card {
    width: 60px;
    height: 60px;
    position: relative;
  }

  .imgListWidth /deep/ .el-upload-list--picture-card .el-upload-list__item {
    display: inline-block;
    width: 60px;
    height: 60px;
  }

  .icon-position {
    position: absolute;
    top: 50%;
    left: 50%;
    font-size: 20px;
    transform: translate(-50%, -50%);
  }

  .el-input, .el-date-editor {
    width: 30vw;
  }
</style>
