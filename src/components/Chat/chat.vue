<template>
  <div class="ChatBox">
    <div ref="ChatInfoEl" class="ChatInfo" @scroll="scroll">
      <div class="load" v-show="pageData.isLoad">{{ pageData.isLoad && loadText }}</div>
      <ChatInfo @newInfoChange="newInfoChange"></ChatInfo>
    </div>
    <div class="auxiliary">
      <div>
        <!-- 选择图片 -->
        <input id="uploadImg" type="file" @change="uploadImg" accept="image/*">
        <label for="uploadImg"><i class="iconfont icon-tupian"></i></label>
      </div>
      <div>
        <!-- 选择文件 -->
        <input id="uploadFile" type="file" @change="uploadFile">
        <label for="uploadFile"><i class="iconfont icon-wenjianjia"></i></label>
      </div>
    </div>
    <div class="ChatText">
      <div class="newInfoCount" v-if="newInfoCount" @click="resetInfoCount">{{ newInfoCount }}</div>
      <textarea class="ChatInput" placeholder="输入内容按回车以发送.." @keydown="inputChange" v-model="textValue"></textarea>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref, reactive, onMounted } from 'vue'
import { ElMessageBox } from 'element-plus'
import { ElMessage } from 'element-plus'
import ChatInfo from './children/chat-info.vue';
import { scrollBottom } from '../../utils/Chat'
import { compressPicture } from '../../utils/picture'
import { uploadImageBase64, uploadFormFile } from '../../api/ChatApi'

const emit = defineEmits(['emitInfo', 'loadMore'])
const textValue = ref('')
const ChatInfoEl: Ref<HTMLElement | null> = ref(null)
const userName = localStorage.getItem('userName') || ''

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
  const target = e.target
  if (pageData.isLoad) return
  if (target.scrollTop <= 0) {
    if (!pageData.isMore) return ElMessage.error('没有更早的消息了~')
    loadText.value = '加载中..'
    pageData.isLoad = true
    emit('loadMore', {
      page: pageData.page,
      limit: pageData.limit
    }, updatePage)
  } else if (target.scrollHeight - (target.scrollTop + target.offsetHeight) < 40) {
    newInfoCount.value = 0
  }
}

let timer = 0
const inputChange = (e) => {
  if (e.keyCode === 13) {
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

// 上传图片
const uploadImg = (e) => {
  const { type } = e.target.files[0]
  if (!type.includes('image')) {
    ElMessage({
      type: 'error',
      message: '仅支持png与jpg格式哦',
    })
    return
  }

  const readObj = new FileReader()
  readObj.onload = () => {
    compressPicture(readObj.result as string, 70, 'image/jpeg', (data: string) => {
      ElMessageBox.confirm( '确认发送该图吗？', '确认',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          center: true,
          customClass: 'custom'
        }
      ).then(() => {
        uploadImageBase64(userName, data).then(({ data }) => {
          if (data.data) {
            ElMessage({ type: 'success', message: '已发送！' })
            setTimeout(() => scrollBottom(), 500);
          } else {
            ElMessage({
              type: 'warning',
              message: '发送失败..',
            })
          }
        })
      }).catch(() => {
        ElMessage({
          type: 'info',
          message: '已取消',
        })
      })
    })
  }
  readObj.readAsDataURL(e.target.files[0])
}

// 上传文件
const uploadFile = (e) => {
  const fileObj = e.target.files[0]
  // 最大 100m
  const maxFileSize = 100 * 1024 * 1024
  if (fileObj.size > maxFileSize) {
    ElMessage({ type: 'warning', message: `所选文件不能大于${maxFileSize/1024/1024}M` })
    return void 0;
  }
  ElMessageBox.confirm( '确认发送该文件吗？', '确认',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      center: true,
      customClass: 'custom'
    }
  ).then(() => {
    ElMessage({ type: 'info', message: '发送中..' })
    uploadFormFile(userName, fileObj)
    .then(({data}) => {
      if (data.type === "saveFile" && data.data === true) {
        ElMessage({ type: 'success', message: '已发送！' })
      }
    })
    .catch(err => {
      ElMessage({ type: 'error', message: '意外错误：' + err.message })
    })
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: '已取消',
    })
  })
  
}
</script>

<style scoped>
#uploadImg, #uploadFile {
  display: none;
}

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

.auxiliary {
  border-top: 1px solid #efefef;
  padding-top: 3px;
  padding-left: 5px;
  margin-bottom: 3px;
  display: flex;
}

.auxiliary>div {
  margin: 0 5px 0 5px;
}

.icon-tupian,
.icon-wenjianjia {
  color: #666;
  font-size: 1.2em;
}

.ChatText {
  position: relative;
  flex: 0.12;
  padding: 0 10px;
}

.newInfoCount {
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
  border-top: 10px solid #F56C6C;
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