<template>
  <!--添加车型-->
  <el-dialog title="品牌车系" v-loading="dialogLoading" :visible="carBrandShow" @close="closeDialog">

    <!--拼音首字母-->
    <div class="pinyin">
        <span :class="pinyinZimu===item?'pinyin-zimu choose-pinyin':'pinyin-zimu'"
              v-for="item in pinyin"
              @click="getCarBrandByPinyin(item)">{{item}}</span>
    </div>

    <!--品牌-->
    <div class="brand-list" v-show="carBrandList.length>0">
      <div v-for="item in carBrandList"
           :class="carBrandId===item.id?'brand-list-item choose-brand':'brand-list-item'"
           @click="getCarBrand(item)">
        <img :src="'/store/static/images/'+item.brand+'.jpg'" :alt="item.brand">
        <span>{{item.brand}}</span>
      </div>
    </div>

    <!--具体型号-->
    <div class="car-type" v-show="carBrand.carTypeList.length>0">
      <span v-for="item in carBrand.carTypeList" @click="chooseCarType(item)">{{item.type}}</span>
    </div>

  </el-dialog>
</template>
<a href="http://www.jetstar.com/sg/zh/home?gigya-reset=true&amp;pwrt=tk1.1PlKGt7eTdTV6X-1PxZedFn7C3tvPIclGz5L8pY5moU"
   old-href="https://login.jetstar.com/newPassword/?apiKey=3_y39YeztbA0QnfeCfZCEHfYUHMm8YL3cRsOhXqqh7L09Mp-l5r4Bgj24wBMrwAeV0&amp;pwrt=tk1.1PlKGt7eTdTV6X-1PxZedFn7C3tvPIclGz5L8pY5moU"

<script>
  /**
   * 在父组件中的用法：
   * <addCarBrand @getCarTypeInfo="getCarTypeInfo"
   * :carBrandShow.sync="carBrand.carBrandShow"></addCarBrand>
   *
   * carBrand:{carBrandShow: false,carTypeList: [],
   * clientBrandCar: '',
   * clientVehicleModel: ''}
   *
   * getCarTypeInfo(list){
   * this.carBrand=list
   * this.clientForm.clientBrandCar = list.clientBrandCar
   * this.clientForm.clientVehicleModel = list.clientVehicleModel
   * }
   *
   */
  export default {
    name: "addCarBrand",
    props: {
      carBrandShow: false,//显示dialog
    },
    data() {
      return {
        dialogLoading: false,
        pinyinZimu: '',
        pinyin: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
          'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
        carBrandList: [],
        carBrandId: '',
        carBrand: {
          carBrandShow: true,
          carTypeList: [],//型号列表
          clientBrandCar: '',//品牌
          clientVehicleModel: '',//型号
        }
      }
    },
    methods: {
      // 通过拼音首字母获取汽车品牌
      getCarBrandByPinyin(py) {
        this.dialogLoading = true
        this.pinyinZimu = py
        this.$get('/carBrand/getCarBrandByPinyin', {
          pinyin: py
        }).then(res => {
          this.dialogLoading = false
          this.carBrand.carTypeList = []
          this.carBrandList = res
        })
      },

      // 通过汽车品牌获取汽车型号
      getCarBrand(item) {
        this.dialogLoading = true
        this.carBrandId = item.id
        this.$get('/carBrand/getCarTypeByCarBrandId', {
          carBrandId: item.id
        }).then(res => {
          this.carBrand.carTypeList = res
          this.carBrand.clientBrandCar = item.brand
          this.carBrand.clientVehicleModel = ''
          this.$emit('getCarTypeInfo', this.carBrand)
          this.dialogLoading = false
        })
      },

      // 选择车辆型号
      chooseCarType(item) {
        this.carBrand.clientVehicleModel = item.type
        this.$emit('getCarTypeInfo', this.carBrand)
        this.carBrand.carBrandShow = false
      },

      closeDialog(){
        this.carBrand.carBrandShow = false
        this.$emit('getCarTypeInfo', this.carBrand)
      }
    },
    mounted: function () {
      this.getCarBrandByPinyin('a')
    }
  }
</script>

<style lang="less" scoped>
  .pinyin {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #dcdcdc;
    padding-bottom: 20px;
  }

  .pinyin-zimu {
    cursor: pointer;
  }

  .choose-pinyin {
    color: #409EFF;
  }

  .brand-list {
    display: flex;
    justify-content: center;
    border-bottom: 1px solid #dcdcdc;
    padding: 20px 0;
    flex-wrap: wrap;
  }

  .brand-list-item {
    height: 80px;
    width: 50px;
    text-align: center;
    cursor: pointer;
    margin: 10px;
    padding: 10px;
  }

  .choose-brand {
    border: 1px solid #409EFF;
  }

  .car-type {
    padding: 20px 0;
    span {
      display: inline-block;
      width: 45%;
      padding: 1%;
      cursor: pointer;
      text-align: center;
    }
    span:hover {
      color: #409EFF;
    }
  }
</style>
