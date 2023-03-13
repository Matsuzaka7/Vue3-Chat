<template>
  <a :href="httpUrl + props.value" :title="props.value" style="text-decoration: none;" download="true">
    <div class="file-container">
      <div class="file-icon"><i class="wenjianicon iconfont icon-24gf-filePencil2"></i></div>
      <div class="file-desc">
        <div class="file-desc-title">{{ props.value || '文件不见了哦' }}</div>
        <div class="file-desc-size">{{ props.size / 1024 > 1024 ? `${(props.size / 1024 / 1024).toFixed(2)}M` :
          `${(props.size / 1024).toFixed(2)}KB` }}</div>
      </div>
    </div>
  </a>
</template>

<script setup lang="ts">
const httpUrl = import.meta.env.VITE_APP_BASE_HTTP_URL
const props = defineProps(['value', 'size'])
</script>

<style lang="scss" scoped>
.wenjianicon {
  font-size: 8vw;
}

.file-container {
  font-size: 3vw;
  margin: -7px -13px;
  padding: 8px 16px 8px 6px;
  max-width: 40vw;
  min-height: 14vw;
  color: #efefef;
  display: flex;
  aspect-ratio: 3 / 1;
  overflow: hidden;

  .file-icon {
    width: 31%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .file-desc {
    width: 69%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    margin-left: -1vw;

    .file-desc-title {
      width: 100%;
      text-align: left;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-bottom: 0.3vw;
    }
  }
}
</style>