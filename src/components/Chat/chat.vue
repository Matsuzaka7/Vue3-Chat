<template>
  <div class="ChatBox">
    <div class="ChatInfo">
      <ChatInfo @newInfoChange="newInfoChange"></ChatInfo>
    </div>
    <div class="ChatText">
      <div class="newInfoCount" v-if="newInfoCount" @click="resetInfoCount">{{ newInfoCount }}</div>
      <textarea class="ChatInput" placeholder="输入内容按回车以发送.." @keydown="inputChange" v-model="textValue"></textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import ChatInfo from './children/chat-info.vue';
import { scrollBottom } from '../../utils/Chat.js'

const emit = defineEmits(['emitInfo'])
const textValue = ref('')

const inputChange = (e) => {
  if (e.keyCode === 13) {
    if (textValue.value.length >= 200) {
      ElMessage({
        message: '一段文本最大200字哦',
        type: 'warning',
      })
      setTimeout(() => textValue.value = textValue.value.slice(0, -1));
      return
    }

    if (!textValue.value.trim()) {
      ElMessage({
        message: '空文本',
        type: 'warning',
      })
      setTimeout(() => textValue.value = textValue.value.slice(0, -1));
      return
    }

    newInfoCount.value = 0
    emit('emitInfo', textValue.value)
    setTimeout(() => textValue.value = '')
    setTimeout(() => scrollBottom(), 100);
  }
}

const newInfoCount = ref(0)
const newInfoChange = () => {
  newInfoCount.value = newInfoCount.value+1
}

const resetInfoCount = () => {
  newInfoCount.value = 0;
  setTimeout(() => scrollBottom(), 100);
}
</script>

<style scoped>
.ChatBox {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 10px;
}

.ChatInfo {
  flex: 0.88;
  overflow: auto;
  margin-bottom: 5px;
}

.ChatText {
  position: relative;
  flex: 0.12;
  border-top: 1px solid #efefef;
  padding: 10px;
  padding-bottom: 0;
}

.newInfoCount {
  position: absolute;
  z-index: 2;
  top: -45px;
  right: 30px;
  width: 30px;
  height: 30px;
  color: #efefef;
  background-color: #FF7AAD;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.newInfoCount::before {
  position: absolute;
  z-index: 1;
  top: 25px;
  content: '';
  display: inline-block;
  width: 0;
  height: 0;
  border: 10px solid transparent;
  border-top: 10px solid #FF7AAD;
}

.ChatInput {
  resize: none;
  font-size: 15px;
  border: none;
  outline: none;
  width: 100%;
  height: 100%;
  word-break: break-all;
}
</style>