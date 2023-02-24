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

<style>
.temp {
  position: absolute;
  top: -9999px;
  left: -9999px;
}

* {
  margin: 0;
  padding: 0;
}

li {
  list-style: none;
}

input {
  outline: none;
}

textarea:focus {
  outline: none;
}

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.1);
}

::-webkit-scrollbar-track {
  border-radius: 0;
  background: rgba(0, 0, 0, 0.05);
}

::selection {
  color: #00D8FB;
  background-color: #fff;
}

.el-dialog__body {
  padding-top: 2vh;
}

.el-dialog__header {
  text-align: center;
}

.el-dialog__title {
  font-size: 2.2vh;
}

/* 修正element的弹出框样式 */
.custom {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -75%);
}


</style>
