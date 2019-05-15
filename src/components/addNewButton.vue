<template>
  <el-button circle type="primary" plain :icon="minus?'el-icon-minus':'el-icon-plus'" size="small" @click="fatherClick"></el-button>
</template>

<script>
  export default {
    name: 'addNewButton',
    props:{
      minus:false
    },
    methods: {
      fatherClick() {
        this.$emit('click')
      }
    }
  }
</script>
