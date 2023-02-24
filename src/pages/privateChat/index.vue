<template>
  <Chat :infoData="infoData" :userIP="userIP" :ws="{}" @pooledData="pooledData"></Chat>
</template>

<script>

</script>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { base64ToUtf8 } from '@/utils/chat'
import Chat from '../../components/Chat/index.vue'
import Store from '@/store'
import privateStore from '@/store/privateStore'
import { ElNotification } from 'element-plus'

const store = Store()
const privateS = privateStore()
const { wsData, userIP } = storeToRefs(store)
const { privateWsList, privateInfoData: infoData, carriedIP } = storeToRefs(privateS)

// @ts-ignore
const ws = new WebSocket(import.meta.env.VITE_APP_BASE_WSS_URL+carriedIP.value)
ws.onmessage = (e) => {
  const { type, data } = JSON.parse(base64ToUtf8(e.data))
  switch (type) {
    // 加入私聊
    case 'addWsPrivate':
      setTimeout(() => {
        ElNotification({
          title: '开发中...',
          message: data,
          type: 'success'
        })
      }, 600);
      break;
    default:
      break;
  }
}
const pooledData = (data) => {
  
}

</script>

<style scoped>
.List {
  position: sticky;
  top: 0;
  min-width: 145px;
  width: 15px;
  border-right: 1px solid #eee;
  overflow: auto;
  padding: 8px 12px;
  transition: all 0.15s;
}


</style>