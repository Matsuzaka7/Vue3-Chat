<template>
  <Dialog :isShowDialog="isShowDialog"></Dialog>
  <Card class="card-container">
    <!-- 头部：砂糖聊天室 -->
    <Header :title="chatState" :wsLink="wsLink" :persons="persons"></Header>
    <!-- 列表以及聊天 -->
    <div class="chat-container">
      <RouterView v-slot="{ Component }">
        <keep-alive>
          <Transition :name="transitionName">
            <component :is="Component"/>
          </Transition>
        </keep-alive>
      </RouterView>
    </div>
    <Hint :notice="notice" :privateMessageList="privateMessageList"></Hint>
  </Card>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ref, onUnmounted, h, watch, toRefs } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import { ElNotification, ElLoading } from 'element-plus'
import Dialog from '@/components/chat/components/dialog.vue'
import Header from '@/components/header/index.vue'
import Card from '@/components/card/index.vue'
import Hint from '@/components/hint/index.vue'
import Store from '@/store';

// 销毁链接
onUnmounted(() => {
  ws.close()
})

const store = Store()
const route = useRoute()
const router = useRouter()
const storeRef = storeToRefs(store)
const { chatState, wsLink, persons, notice, isShowDialog } = toRefs(storeRef.wsData.value)
const { privateMessageList } = toRefs(storeRef.private.value)

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
  let reconnectCount = 0
  setTimeout(() => {
    return (function fn() {
      ws = new WebSocket(import.meta.env.VITE_APP_BASE_WSS_URL)
      ws.onmessage = function (evt: MessageEvent) {
        store.handleGroupAllWs(evt, route, router)
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
  }, 500);
})()
</script>

<style lang="scss" scoped>
.card-container {
  display: flex;
  flex-direction: column;
  margin: 1vh;

  .chat-container {
    min-width: 300px;
    height: 82.5vh;
  }
}

/* transform 动画过渡之间 */
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  width: 100vw;
  height: 82.5vh;
  transition: all 400ms ease-in-out;
  position: fixed;
  transform-origin: right bottom;
}

.slide-right-enter-from,
.slide-left-leave-to {
  opacity: 0;
  filter: invert(1);
  transform: translateX(-50%) scale(1);
  background-color: #666;
}

.slide-right-leave-to,
.slide-left-enter-from {
  opacity: 0;
  filter: invert(1);
  transform: translateX(50%) scale(0);
  background-color: #666;
}</style>
