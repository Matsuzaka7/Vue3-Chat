<template>
  <div class="temp">
    <i class="iconfont icon-dian"></i>
    <i class="iconfont icon-xiangzuo"></i> 
  </div>
  <Layout></Layout>
</template>

<script setup lang="ts">
import Layout from './pages/Layout.vue'
</script>

<style lang="scss">
@import url('@/assets/scss/reset.scss');
.temp {
  position: absolute;
  top: -9999px;
  left: -9999px;
}
</style>
