<template v-if="props.infoData">
  <div class="chat-info-container" v-for="(item, index) in props.infoData" :key="item.id">
    <TimeMessage :timer="infoData[index]?.time" v-if="index === 0 || infoData[index]?.time - infoData[index - 1]?.time > 1000 * 60 * 3"></TimeMessage>
    <div :class="[computedBelongToIp(item.userIP) ? 'chat-info-right' : 'chat-info-left']">
      <p class="chat-name">{{ `${item.username || ''} [${item.userIP}]` }}</p>
      <div class="chat-message" :class="[computedBelongToIp(item.userIP) ? 'chat-info-item-right' : 'chat-info-item-left']">
        <ChatText v-if="item.type === 'text'" :value="item.value"></ChatText>
        <ChatImage v-else-if="item.type === 'image'" :src="item.value" :imageWidth="item.imageWidth" :imageHeight="item.imageHeight"></ChatImage>
        <ChatFile v-else-if="item.type === 'file'" :value="item.value" :size="item.size"></ChatFile>
        <ChatText v-else :value="item.value"></ChatText>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { scrollBottom } from '@/utils/chat'
import TimeMessage from './chat-type/time-message.vue'
import ChatImage from './chat-type/chat-image.vue';
import ChatFile from './chat-type/chat-file.vue';
import ChatText from './chat-type/chat-text.vue';

const props = defineProps({
  infoData: {
    type: Array as any,
    default: () => []
  },
  userIP: {
    type: String,
    default: '0.0.0.0'
  }
})

// 加载完毕时滚动到最底部
onMounted(() => {
  setTimeout(() => {
    scrollBottom() 
  }, 600);
})

const emit = defineEmits(['newInfoChange'])
// 计算消息的方向
const computedBelongToIp = (itemIp: string) => {
  const storage: string[] = JSON.parse(localStorage.getItem('data')!) || []
  return itemIp === props.userIP || storage.includes(itemIp)
}

// 当有新消息（包括自己），并且滚动距离小于80px，则滚到最底部
watch(() => props.infoData, () => {
  let chatInfo: HTMLElement = document.querySelector(".chat-info")!;
  if (chatInfo.scrollHeight - (chatInfo.offsetHeight + chatInfo.scrollTop) <= 80) {
    setTimeout(() => scrollBottom())
  } else {
    if (props.infoData[props.infoData.length - 1].userIP === props.userIP) return
    emit('newInfoChange')
  }
}, { deep: true })

</script>

<style lang="scss" scoped>
.chat-info-container {
  --message-bg: #24292F;
  user-select: auto;

  .chat-name {
    color: #333;
    margin: 0 4px;
    font-size: 14px;
  }

  .chat-info-left, .chat-info-right {
    margin-bottom: 20px;
    .chat-message {
      color: #efefef;
      background-color: var(--message-bg);
      user-select: text;
      text-align: left;
      display: inline-block;
      word-break: break-word;
      position: relative;
      padding: 6px 12px;
      border-radius: 14px;
      font-size: 14px;
      min-height: 20px;
    }
    .chat-info-item-left::before {
      content: '';
      position: absolute;
      z-index: -1;
      bottom: -11px;
      left: 0px;
      display: inline-block;
      width: 0px;
      height: 0px;
      border: 5px solid transparent;
      border-top: 12px solid var(--message-bg);
      transform: rotate(32deg);
    }
    .chat-info-item-right::before {
      content: '';
      position: absolute;
      z-index: -1;
      bottom: -10px;
      right: 0px;
      display: inline-block;
      width: 0px;
      height: 0px;
      border: 5px solid transparent;
      border-top: 12px solid var(--message-bg);
      transform: rotate(312deg);
    }
  }

  .chat-info-left {
    text-align: left;
  }

  .chat-info-right {
    text-align: right;
    margin-right: 5px;
  }
}
</style>
