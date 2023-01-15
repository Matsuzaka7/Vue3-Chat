<template>
  <ElDialog 
    class="Dialog" 
    v-model="isShowDialog" 
    title="初次到来是否给自己起个名字？" 
    width="80%"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
  >
    <input class="userNameInput" v-model="userName" type="text" placeholder="请输入用户名">
    <div class="buttonBox">
      <button @click="onCal">取消</button>
      <button @click="onOk">确认</button>
    </div>
  </ElDialog>

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
import { ref, Ref, provide, onUnmounted, h } from 'vue';
import { ElMessage, ElNotification, ElDialog, ElMessageBox } from 'element-plus'
import List from './components/List.vue';
import Cart from './components/Cart.vue';
import Chat from './components/Chat/chat.vue'
import { setUserName, getUserName } from './api/ChatApi'

const flag = ref(false)
const updateWidth = ({ value }) => {
  flag.value = value
}

const base64ToUtf8 = (base64: string) => {
  return new TextDecoder().decode(base64js.toByteArray(base64))
}

// 名单列表数据
const wsData: Ref<any> = ref([])
// ws是否连接成功
const wsLink: Ref<any> = ref(false)
// 用户ip
const userIP: Ref<any> = ref('')
// 公告栏
const notice: Ref<string> = ref('')
// 聊天数据
const infoData: Ref<any> = ref([])
// 获取当前用户名称
const username: string = localStorage.getItem('userName')! || ''
provide('userIP', userIP)
provide('infoData', infoData)
provide('username', username)

const ws = new WebSocket('ws://47.95.112.111:1001');
// 接收到消息的回调
ws.onmessage = function (evt: MessageEvent) {
  // let data = JSON.parse(evt.data)
  let { data, type } = JSON.parse(base64ToUtf8(evt.data))
  console.log(data, type);
  
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
      // 如果ip列表中有本次ip则不执行
      if (ipData.includes(data)) return
      const userName = localStorage.getItem('userName')!
      if (userName) {
        getUserName(userName)
        .then(() => {
          isShowDialog.value = false
          ElMessage('灰常抱歉，弹窗闪了你一下')
        })
        .catch(e => {})
      }
      
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
    case "findUserName":
      !username && localStorage.setItem('userName', data)
      if (data && !localStorage.getItem('userName')) {
        isShowDialog.value = true
      } else {
        setTimeout(() => {
          ElNotification({
            title: '连接成功',
            message: h('i', { style: 'color: teal' }, `欢迎回来 ${username || data}`),
            duration: 1500
          })
        }, 200);
      }
      break;
    case "notUser": 
      isShowDialog.value = true
      break;
    default:
      console.log(type,'未知类型，请联系管理员');
      break;
  }
};

// 连接成功执行
ws.onopen = function () {
  wsLink.value = true
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
    data: {
      value: data,
      username: localStorage.getItem('userName')
    }
  }))
}

// 组件挂载完毕后出现是否自定义用户名
const userName: Ref<string> = ref('')
const isShowDialog: Ref<boolean> = ref(false)

// 确认输入用户名
const onOk = () => {
  if (!userName.value.trim()) {
    ElMessage('用户名不能为空哦~')
    return
  }
  if (userName.value.trim().length > 6) {
    ElMessage('用户名字数不能大于6位')
    return
  }

  ElMessageBox.confirm(
    `是否设置用户名为：${userName.value}？确认后不可更改哦~`,
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '再想想',
      type: 'warning',
      customClass: 'custom'
    }
  )
    .then(() => {
      // 将用户名发送给服务器
      setUserName(userName.value)
      .then(({ data }) => {
        if (data.type === 'err') {
        } else if (data.type === 'rejectUserName') {
          ElMessage({
            type: 'warning',
            message: '名称已重复',
          })
        } else if (data.type === 'succeedUserName') {
          isShowDialog.value = false
          localStorage.setItem('userName', userName.value)
          ElMessage({
            type: 'success',
            message: '成功',
          })
        }
      })
      .catch(e => {})
    })
}

// 取消输入用户名
const onCal = () => {
  ElMessageBox.confirm(
    `不想输入用户名？`,
    '提示',
    {
      confirmButtonText: '确认',
      cancelButtonText: '再想想',
      type: 'warning',
      customClass: 'custom'
    }
  )
    .then(() => {
      isShowDialog.value = false
    })
}

// 加载更多聊天数据
let tempFn: null | Function = null
const loadMore = (pageData, fn) => {
  ws.send(JSON.stringify({
    type: 'loadMoreInfo',
    data: pageData
  }))
  // fn调用后需要告诉子组件, 数据是否全部被获取了
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

.userNameInput {
  border: none;
  width: 100%;
  height: 4.2vh;
  background-color: #efefef;
  padding-left: 12px;
  margin-top: -20px;
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
  transition: all 0.15s;
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

.buttonBox {
  margin: 1.6vh 15px 0;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
}

.buttonBox > button { 
  border: none;
  padding: 1.2vh 3vh;
  border-radius: 6px;
}

.custom {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -75%);
}
</style>