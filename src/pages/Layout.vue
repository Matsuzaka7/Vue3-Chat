<template>
  <ElDialog class="Dialog" v-model="isShowDialog" title="初次到来是否给自己起个名字？" width="80%" :close-on-click-modal="false"
    :close-on-press-escape="false" :show-close="false">
    <input class="userNameInput" v-model="userName" type="text" placeholder="请输入用户名">
    <div class="buttonBox">
      <button @click="onCal">取消</button>
      <button @click="onOk">确认</button>
    </div>
  </ElDialog>

  <Card style="margin: 1vh; overflow: hidden; user-select: none;">
    <!-- 头部：砂糖聊天室 -->
    <Header :title="chatState" :wsLink="store.wsLink" :wsData="store.wsData"></Header>
    <!-- 列表以及聊天 -->
    <div class="chat-subject">
      <RouterView v-slot="{Component}">
        <keep-alive>
          <Transition :name="transitionName">
            <component :is="Component"/>
          </Transition>
        </keep-alive>
      </RouterView>
    </div>
    <span class="hint" v-if="store.notice">{{ store.notice }}</span>
  </Card>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref, Ref, onUnmounted, h, watch } from 'vue';
import { useRoute } from 'vue-router'
import { ElMessage, ElNotification, ElDialog, ElMessageBox, ElLoading } from 'element-plus'
import { setUserName, getUserName } from '@/api/ChatApi'
import { base64ToUtf8 } from '@/utils/chat'
import Header from '@/components/Header/index.vue'
import Card from '@/components/Card/index.vue'
import groupStore from '@/store/groupStore'
import Store from '@/store';

// 销毁链接
onUnmounted(() => {
  ws.close()
})

// @ts-ignore 
const route = useRoute()
const store = Store()
const group = groupStore()
const { chatState } = storeToRefs(store)
// 获取当前用户名称
const username: string = localStorage.getItem('userName')! || ''

type Meta = {
  from: string,
  index: number
}

const transitionName = ref('')
watch(() => route.meta as Meta, (newVal: Meta, oldVal: Meta) => {
  // 首次进入没有旧值，首次进入不应该做动画
  if (oldVal?.index === undefined) return
  transitionName.value = newVal.index < oldVal.index ? 'slide-right' : 'slide-left'
})

// 链接/重连ws
let ws
let loadingInstance = ElLoading.service()
;(() => {
  let flag = false
  let reconnectCount = 0
  return (function fn() {
    // @ts-ignore
    ws = new WebSocket(import.meta.env.VITE_APP_BASE_WSS_URL)
    // 接收到消息的回调
    ws.onmessage = function (evt: MessageEvent) {
      // let data = JSON.parse(evt.data)
      let { data, type } = JSON.parse(base64ToUtf8(evt.data))
      switch (type) {
        case "rejectWs":
          ws.close()
          ElMessage.error('')
          store.setWsLink(false)
          return
        case "personList":
          store.setWsData(data)
          break;
        case "userIP":
          store.setUserIP(data)
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
          }
          ipData.push(data)
          localStorage.setItem('data', JSON.stringify(ipData))
          break;
        case "notice":
          store.setNotice(data)
          break;
        case "infoData":
          group.setGroupInfoData(data)
          break;
        case "newInfo":
          group.addGroupInfoData(data)
          break;
        case "findUserName":
          !username && localStorage.setItem('userName', data)
          if (data && !localStorage.getItem('userName')) {
            isShowDialog.value = true
          } else {
            if (flag) return
            setTimeout(() => {
              ElNotification({
                title: '连接成功',
                message: h('i', { style: 'color: teal' }, `欢迎回来 ${username || data}`),
                duration: 3000
              })
              flag = false
            }, 200);
            flag = true
          }
          break;
        case "notUser":
          isShowDialog.value = true
          break;
        default:
          console.log(type, '未知类型，请联系管理员');
          break;
      }
    };

    // 连接成功执行
    ws.onopen = function () {
      store.setWsLink(true)
      loadingInstance.close()
      store.setWs(ws)
    }

    // 连接失败执行
    ws.onerror = function () {
      store.setWsLink(false)
      ElNotification({
        title: '连接失败',
        message: h('i', { style: 'color: teal' }, `尝试重连..第${++reconnectCount}次`),
        duration: 3000
      })
      loadingInstance = ElLoading.service()
      fn()
    }

    // 链接断开时执行的回调
    ws.onclose = function () {
      store.setWsLink(false)
      ElNotification({
        title: '当前链接已断开',
        message: h('i', { style: 'color: teal' }, `尝试重连..第${++reconnectCount}次`),
        duration: 3000
      })
      loadingInstance = ElLoading.service()
      fn()
    }
  })()
})()

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

  ElMessageBox.confirm( `是否设置用户名为：${userName.value}？确认后不可更改哦~`, '提示', { confirmButtonText: '确认', cancelButtonText: '再想想', type: 'warning', customClass: 'custom' })
  .then(() => {
    // 将用户名发送给服务器
    setUserName(userName.value)
      .then(({ data }) => {
        if (data.type === 'err') {

        } else if (data.type === 'rejectUserName') {
          ElMessage({ type: 'warning', message: '名称已重复' })
        } else if (data.type === 'succeedUserName') {
          isShowDialog.value = false
          localStorage.setItem('userName', userName.value)
          ElMessage({ type: 'success', message: '成功' })
        }
      })
      .catch(e => {
        console.log('err', e);
      })
  })
}

// 取消输入用户名
const onCal = () => {
  ElMessageBox.confirm( `不想输入用户名？`, '提示', { confirmButtonText: '确认', cancelButtonText: '再想想', type: 'warning', customClass: 'custom' })
  .then(() => {
    isShowDialog.value = false
  })
}
</script>

<style scoped>
/* 过渡之间
.slide-right-enter-active,
.slide-right-leave-active, */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 400ms;
  position: sticky;
  top: 0;
}


.slide-right-enter-from,
.slide-left-leave-to {
    transform: translateX(-100%);
}

.slide-right-leave-to,
.slide-left-enter-from {
  transform: translateX(100%);
}
.hint {
  margin-left: 12px;
  font-size: 14px;
  color: #333;
}

.buttonBox {
  margin: 1.6vh 15px 0;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
}

.buttonBox>button {
  border: none;
  padding: 1.2vh 3vh;
  border-radius: 6px;
}
.userNameInput {
  border: none;
  width: 100%;
  height: 4.2vh;
  background-color: #efefef;
  padding-left: 12px;
  margin-top: -20px;
}

.chat-subject {
  display: flex;
  min-width: 300px;
  height: 82.5vh;
  margin-top: 10px;
  overflow: auto;
}
</style>
