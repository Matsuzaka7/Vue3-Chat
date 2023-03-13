<template>
  <div class="chat-container">
    <!-- 消息数 -->
    <div ref="ChatInfoEl" class="chat-info" @scroll="scroll">
      <div class="load" v-show="pageData.isLoad">{{ pageData.isLoad && loadText }}</div>
      <ChatInfo @newInfoChange="newInfoChange" :infoData="props.infoData" :userIP="props.userIP"></ChatInfo>
    </div>
    <Auxiliary></Auxiliary>
    <!-- 输入框 -->
    <div class="chat-text">
      <div class="new-info-count" v-if="newInfoCount" @click="resetInfoCount">{{ newInfoCount }}</div>
      <textarea class="chat-input" placeholder="输入内容按回车以发送.." @keydown.enter="inputChange" v-model="textValue"></textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { scrollBottom } from '@/utils/chat'
import { loadMoreInfo } from '@/api/ChatApi'
import ChatInfo from './components/chat-info.vue';
import Auxiliary from './components/auxiliary.vue'

const emit = defineEmits(['pooledData'])
const props = defineProps({
  infoData: {
    type: Array,
    default: () => []
  },
  userIP: {
    type: String,
    default: '0.0.0.0'
  },
  ws: {
    type: Object,
    default: () => ({})
  }
})

const textValue = ref('')
const ChatInfoEl: Ref<HTMLElement | null> = ref(null)

const pageData = reactive({
  isLoad: false, // 正在加载中？
  isMore: true,  // 是否还有更多？
  page: 1,       // 加载次数
  limit: 20,     // 每次加载的条数
  type: ''       // 用来判断是新消息(loadMoreData)还是上划加载的消息
})

let height = 0
onMounted(() => {
  height = ChatInfoEl.value!.scrollHeight
})

// 数据加载成功时执行
const loadText = ref('')
const updatePage = ({ isMore }, type) => {
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
  const target = e.target
  if (pageData.isLoad) return
  if (target.scrollTop <= 0) {
    if (!pageData.isMore) return ElMessage.error('没有更早的消息了~')
    loadText.value = '加载中..'
    pageData.isLoad = true
    // 发送请求获取更多消息
    loadMoreInfo({
      page: pageData.page,
      limit: pageData.limit
    }).then(({ data }) => {
      // 合并数据
      emit('pooledData', data.data.data)
      updatePage(data.data, 'loadMoreData')
    })
  } else if (target.scrollHeight - (target.scrollTop + target.offsetHeight) < 40) {
    newInfoCount.value = 0
  }
}

let timer: any = 0
const inputChange = (e) => {
  if (textValue.value.length >= 200) {
    ElMessage({ message: '一段文本最大200字哦', type: 'warning' })
    setTimeout(() => textValue.value = textValue.value.slice(0, -1));
    return
  }

  if (!textValue.value.trim()) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      ElMessage({ message: '空文本', type: 'warning' })
      setTimeout(() => textValue.value = '');
    }, 400);
    return
  }

  newInfoCount.value = 0
  // 提交消息给服务器
  props.ws.send(JSON.stringify({
    type: 'addInfoData',
    data: {
      value: textValue.value,
      username: localStorage.getItem('userName')
    }
  }))
  setTimeout(() => {
    textValue.value = ''
    scrollBottom()
  })
}

// 新消息数量
const newInfoCount = ref(0)
const newInfoChange = () => {
  if (pageData.type !== 'loadMoreData') {
    newInfoCount.value++
  }
  pageData.type = ''
}

// 点击新消息计数器滚到底部
const resetInfoCount = () => {
  newInfoCount.value = 0;
  setTimeout(() => scrollBottom(true));
}
</script>

<style lang="scss" scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 10px;
  padding-top: 0;

  // 消息列表
  .chat-info {
    flex: 0.88;
    overflow-y: scroll;

    .load {
      text-align: center;
      color: lightseagreen;
      font-size: 13px;
    }
  }

  // 输入框
  .chat-text {
    position: relative;
    flex: 0.12;
    padding: 0 10px;

    .new-info-count {
      position: absolute;
      z-index: 2;
      top: -45px;
      right: 30px;
      width: 30px;
      height: 30px;
      color: #efefef;
      background-color: #F56C6C;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;

      &::before {
        position: absolute;
        z-index: 1;
        top: 25px;
        content: '';
        display: inline-block;
        width: 0;
        height: 0;
        border: 10px solid transparent;
        border-top: 10px solid #F56C6C;
      }
    }

    .chat-input {
      resize: none;
      font-size: 13px;
      border: none;
      outline: none;
      width: 100%;
      height: 100%;
      word-break: break-all;
    }
  }
}
</style>