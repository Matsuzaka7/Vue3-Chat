<template>
  <Cart style="margin: 1vh; overflow: hidden; user-select: none;">
    <div class="header" :style="{ background: wsLink ? '#FF7AAD' : '#000' }">
      <div class="desc">
        <h1 class="title">砂糖聊天室</h1>
        <span class="personLength">当前人数：{{ wsData?.personList?.length || 0 }}人</span>
        <span></span>
      </div>
    </div>
    <div class="box">
      <List :style="{ minWidth: flag ? '145px' : '12px', overflow: flag ? 'auto' : 'hidden' }" class="List"
        :wsData="wsData" :userIP="userIP" @updateWidth="updateWidth"></List>
      <Chat @emitInfo="emitInfo" @loadMore="loadMore"></Chat>
    </div>
    <span class="hint" v-if="notice">{{ notice }}</span>
  </Cart>
</template>

<script setup lang="ts">
import base64js from 'base64-js'
import { ref, provide, onUnmounted, h } from 'vue';
import { ElMessage, ElNotification } from 'element-plus'
import List from './components/List.vue';
import Cart from './components/Cart.vue';
import Chat from './components/Chat/chat.vue'

const flag = ref(false)
const updateWidth = ({ value }) => {
  flag.value = value
}

const base64ToUtf8 = (base64: string) => {
  return new TextDecoder().decode(base64js.toByteArray(base64))
}

// 名单列表数据
const wsData: any = ref([])
// ws是否连接成功
const wsLink: any = ref(false)
// 用户ip
const userIP: any = ref('')
// 公告栏
const notice: any = ref('')
// 聊天数据
const infoData: any = ref([])
provide('userIP', userIP)
provide('infoData', infoData)

const ws = new WebSocket('ws://127.0.0.1:1001');
// 接收到消息的回调
ws.onmessage = function (evt: MessageEvent) {
  // let data = JSON.parse(evt.data)
  let { data, type } = JSON.parse(base64ToUtf8(evt.data))
  console.log(data);
  switch (type) {
    case "rejectWs":
      ws.close()
      ElMessage.error('')
      wsLink.value = false
      return
    case "personList":
      wsData.value = data
      break;
    case "userIP":
      userIP.value = data
      const ipData: any[] = JSON.parse(localStorage.getItem('data')!) || []
      if (ipData.includes(data)) return
      ipData.push(data)
      localStorage.setItem('data', JSON.stringify(ipData))
      break;
    case "notice":
      notice.value = data
      break;
    case "infoData":
      infoData.value = data
      break;
    case "newInfo":
      infoData.value.push(data)
      break;
    case "loadMoreData":
      infoData.value = [...data.data, ...infoData.value]
      tempFn && tempFn(data, type)
      tempFn = null
      break;
    default:
      console.log('未知类型，请联系管理员');
      break;
  }
};

// 连接成功执行
ws.onopen = function () {
  wsLink.value = true
  ElNotification({
    title: '连接成功',
    duration: 1000
  })
}

// 连接失败执行
ws.onerror = function () {
  wsLink.value = false
  ElNotification({
    title: '连接失败',
    message: h('i', { style: 'color: teal' }, '请刷新或稍后重试..'),
    duration: 0
  })
}

// 链接断开时执行的回调
ws.onclose = function () {
  wsLink.value = false
  ElNotification({
    title: '当前链接已断开',
    message: h('i', { style: 'color: teal' }, '请刷新页面重连..'),
    duration: 0
  })
}

// 提交消息给服务器
const emitInfo = (data) => {
  ws.send(JSON.stringify({
    type: 'addInfoData',
    data
  }))
}

// 加载更多聊天数据
let tempFn: null | Function = null
const loadMore = (pageData, fn) => {
  ws.send(JSON.stringify({
    type: 'loadMoreInfo',
    data: pageData
  }))
  tempFn = fn
}

onUnmounted(() => {
  ws.close()
})

</script>

<style>
* {
  margin: 0;
  padding: 0;
  transition: all 0.15s;
}

li {
  list-style: none;
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

.hint {
  margin-left: 12px;
  font-size: 14px;
  color: #333;
}

.personLength {
  font-size: 1.8vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  border-bottom: 1px solid #eee;
  padding: 15px 35px 5px;
  margin: -10px -15px;
  transition: all 0.3s;
}

.desc {
  display: flex;
  align-items: baseline;
}

.title {
  font-size: 3.2vh;
  padding: 8px 6px;
}

.box {
  display: flex;
  min-width: 300px;
  height: 82.5vh;
  margin-top: 10px;
  overflow: auto;
}

.List {
  position: sticky;
  top: 0;
  min-width: 145px;
  width: 15px;
  border-right: 1px solid #eee;
  overflow: auto;
  padding: 8px 12px;
}

.WBox {
  flex: 1;
  margin: 10px 20px;
  margin-right: 0;
  border: none;
  height: 100%;
  max-height: calc(82.5vh - 20px);
  font-size: 14px;
  line-height: 20px;
}
</style>
