<template v-if="infoData">
  <div class="chat-info-container" v-for="(item, index) in infoData" :key="item.id">
    <TimeMessage :timer="infoData[index]?.time"
      v-if="index === 0 || infoData[index]?.time - infoData[index - 1]?.time > 1000 * 60 * 3"></TimeMessage>
    <div :class="[computedBelongToIp(item.userIP) ? 'chat-info-right' : 'chat-info-left']">
      <p class="name">{{ `${item.username || ''} [${item.userIP}]` }}</p>
      <div class="chat" :class="[computedBelongToIp(item.userIP) ? 'chat-info-item-right' : 'chat-info-item-left']">
        <div class="chat-image" v-if="item.type === 'image'">
          <img v-viewer :src="httpUrl + item.value" alt="[图片] 加载失败！">
        </div>
        <div v-else-if="item.type === 'text'">
          {{ item.value }}
        </div>
        <div v-else>
          {{ item.value }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, inject, watch } from 'vue'
import TimeMessage from './time-message.vue'
import { scrollBottom } from '../../../utils/Chat'

// @ts-ignore
const httpUrl = import.meta.env.VITE_APP_BASE_HTTP_URL
const emit = defineEmits(['newInfoChange'])
// 消息的背景颜色
const bg = ref('#24292F')
// 用户ip
const userIP: any = inject('userIP')
// const username: any = inject('username')
// 消息数据
const infoData: any = inject('infoData')
// 计算消息的方向
const computedBelongToIp = (itemIp: string) => {
  const storage: string[] = JSON.parse(localStorage.getItem('data')!) || []
  return itemIp === userIP.value || storage.includes(itemIp)
}
// 加载完毕时滚动到最底部
onMounted(() => {
  scrollBottom()
  setTimeout(() => {
    scrollBottom()
  }, 500);
})

watch(() => infoData, () => {
  let ChatInfo: HTMLElement = document.querySelector(".ChatInfo")!;
  // 当用户往上滚动的距离超过了80像素就
  if (ChatInfo.scrollHeight - (ChatInfo.offsetHeight + ChatInfo.scrollTop) <= 80) {
    setTimeout(() => scrollBottom());
  } else {
    if (infoData.value[infoData.value.length - 1].userIP === userIP.value) return
    emit('newInfoChange')
  }
}, { deep: true })

</script>

<style scoped>
.name {
  color: #333;
  margin: 0 4px;
  font-size: 14px;
}

.chat {
  color: #efefef;
  background-color: v-bind(bg);
  user-select: text;
}

.chat-image {
  padding: 6px 0 2px 0;
  overflow: hidden;
}

.chat-image>img {
  border-radius: 10px;
  max-width: 40vw;
  max-height: 40vh;
}

.chat-info-container {
  user-select: auto;
  width: calc(100% - 6px);
}

.chat-info-left {
  margin-bottom: 20px;
  text-align: left;
}

.chat-info-item-left {
  display: inline-block;
  word-break: break-all;
  position: relative;
  padding: 6px 12px;
  border-radius: 14px;
  font-size: 14px;
  min-height: 20px;
}

.chat-info-item-left::before {
  content: '';
  position: absolute;
  bottom: -11px;
  left: 0px;
  display: inline-block;
  width: 0px;
  height: 0px;
  border: 5px solid transparent;
  border-top: 12px solid v-bind(bg);
  transform: rotate(32deg);
}

.chat-info-right {
  margin-bottom: 20px;
  text-align: right;
}

.chat-info-item-right {
  display: inline-block;
  word-break: break-all;
  position: relative;
  padding: 6px 12px;
  border-radius: 14px;
  color: #efefef;
  font-size: 14px;
  min-height: 20px;
}

.chat-info-item-right::before {
  content: '';
  position: absolute;
  bottom: -10px;
  right: 0px;
  display: inline-block;
  width: 0px;
  height: 0px;
  border: 5px solid transparent;
  border-top: 12px solid v-bind(bg);
  transform: rotate(312deg);
}
</style>
