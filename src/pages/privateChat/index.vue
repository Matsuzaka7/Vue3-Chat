<template>
  <div class="chat-subject">
    <Chat :infoData="privateInfoData" :userIP="userIP" :ws="ws" @pooledData="pooledData" class="PChat"></Chat>
  </div>
</template>

<script setup lang="ts">
import { h, toRefs } from 'vue'
import { storeToRefs } from 'pinia';
import { base64ToUtf8 } from '@/utils/chat'
import Chat from '@/components/chat/index.vue'
import Store from '@/store'
import { ElNotification, ElLoading } from 'element-plus'

const store = Store()
const storeRef = storeToRefs(store)
const { carriedIP, privateInfoData } = toRefs(storeRef.private.value)
const { userIP } = toRefs(storeRef.wsData.value)

let ws
let loadingInstance = ElLoading.service()
  ; (() => {
    let reconnectCount = 0
    setTimeout(() => {
      return (function fn() {
        ws = new WebSocket(import.meta.env.VITE_APP_BASE_WSS_URL + carriedIP.value)
        // 接收到消息的回调
        ws.onmessage = (e) => {
          const { type, data } = JSON.parse(base64ToUtf8(e.data))
          switch (type) {
            // 加入私聊（让后端创建数据）
            case 'addWsPrivate':

              break;

            case "privateInfoData":
              store.setPrivateInfoData(data)
              break;
            case "privateNewInfo":
              store.addPrivateInfoData(data)
              break;
            default:
              break;
          }
        }

        // 连接成功执行
        ws.onopen = function () {
          loadingInstance.close()
          ElNotification({
            title: 'öÐÞ¸ÄÆ÷',
            message: h('i', { style: 'color: teal' }, `ﵽһÎÞÍêÈ«ÊÊÅäԼÎÄ¼þ¼ÐÖÐ`),
            duration: 3000
          })
        }

        // 连接失败执行
        ws.onerror = function () {
          ElNotification({
            title: '私聊连接失败',
            message: h('i', { style: 'color: teal' }, `尝试重连..第${++reconnectCount}次`),
            duration: 3000
          })
          loadingInstance = ElLoading.service()
          fn()
        }

        // 链接断开时执行的回调
        ws.onclose = function () {
          ElNotification({
            title: '当前私聊链接已断开',
            message: h('i', { style: 'color: teal' }, `尝试重连..第${++reconnectCount}次`),
            duration: 3000
          })
          loadingInstance = ElLoading.service()
          fn()
        }
      })()
    }, 500);
  })()

const pooledData = (data) => {

}

</script>

<style scoped>
.PChat:deep(label) {
  display: none;
}

.chat-subject {
  display: flex;
  min-width: 300px;
  height: 82.5vh;
  overflow: auto;
}
</style>