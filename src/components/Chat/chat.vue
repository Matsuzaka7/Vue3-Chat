<template>
  <div class="ChatBox">
    <div ref="ChatInfoEl" class="ChatInfo" @scroll="scroll">
      <div class="load" v-show="pageData.isLoad">{{ pageData.isLoad && loadText }}</div>
      <ChatInfo @newInfoChange="newInfoChange"></ChatInfo>
    </div>
    <div class="ChatText">
      <div class="newInfoCount" v-if="newInfoCount" @click="resetInfoCount">{{ newInfoCount }}</div>
      <textarea class="ChatInput" placeholder="输入内容按回车以发送.." @keydown="inputChange" v-model="textValue"></textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref, reactive, onMounted, inject } from 'vue'
import { ElMessage } from 'element-plus'
import ChatInfo from './children/chat-info.vue';
import { scrollBottom } from '../../utils/Chat.js'

const emit = defineEmits(['emitInfo', 'loadMore'])
const infoData: any = inject('infoData')
const textValue = ref('')
const ChatInfoEl: Ref<HTMLElement | null> = ref(null)


const pageData = reactive({
  isLoad: false, // 正在加载中？
  isMore: true,  // 是否还有更多？
  page: 1,       // 加载次数
  limit: 20,     // 每次加载的条数
  type: ''       // 用来判断是新消息还是上划加载的消息
})

let height = 0
onMounted(() => {
  height = ChatInfoEl.value!.scrollHeight
})

// 数据加载成功时执行
const loadText = ref('')
const updatePage = ({ isMore, data }, type) => {
  queueMicrotask(() => {
    ChatInfoEl.value!.scrollTo(0, ChatInfoEl.value!.scrollHeight - height)
  });

  pageData.type = type
  pageData.isLoad = false
  if (isMore) {
    pageData.page++
  } else {
    pageData.isMore = isMore
  }
  height = ChatInfoEl.value!.scrollHeight
}
// 检测是否滚动到头
const scroll = (e) => {
  if (pageData.isLoad) return
  if (e.target.scrollTop <= 0) {
    if (!pageData.isMore) return ElMessage.error('没有更早的消息了~')
    loadText.value = '加载中..'
    pageData.isLoad = true
    emit('loadMore', {
      page: pageData.page,
      limit: pageData.limit
    }, updatePage)
  }
}

let timer = 0
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
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        ElMessage({
          message: '空文本',
          type: 'warning',
        })
        setTimeout(() => textValue.value = '');
      }, 600);
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
  if (pageData.type !== 'loadMoreData') {
    newInfoCount.value++
  }
  pageData.type = ''
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
  position: relative;
  flex: 0.88;
  overflow: auto;
  margin-bottom: 5px;
}

.load {
  text-align: center;
  color: lightseagreen;
  font-size: 13px;
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
