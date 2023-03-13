<template>
  <div class="chat-image">
    <img v-viewer :src="httpUrl + props.src" alt="[图片] 加载失败！" :style="{
      height: props.imageWidth > props.imageHeight && window.innerWidth * 0.4 * (props.imageHeight / props.imageWidth) + 'px'
    }">
  </div>
</template>

<script setup lang="ts">
const window = globalThis
const httpUrl = import.meta.env.VITE_APP_BASE_HTTP_URL
const props = defineProps(['src', 'imageWidth', 'imageHeight'])
</script>

<style lang="scss" scoped>
.chat-image {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  margin: -6px -12px -18px;
  filter: drop-shadow(0px 1px 1px #66666680);

  &>img {
    border-radius: 10px;
    max-width: 40vw;
    max-height: 40vh;
    min-width: 24px;
    min-height: 20px;
  }
}
</style>