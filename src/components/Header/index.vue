<template>
  <div class="header" :style="{ background: props.wsLink ? '#FF7AAD' : '#000' }">
    <div class="desc">
      <h1 class="title">
        <i v-if="props.title === 1" class="iconfont icon-xiangzuo" @click="backGroup"></i> 
        {{ props.title === 0 ? '砂糖聊天室' : `正在和${privateS.carriedIP}聊天` }}
      </h1>
      <span class="personLength" v-if="props.title === 0">当前人数：{{ props.wsData?.personList?.length || 0 }}人</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import Store from '@/store';
import { useRouter } from 'vue-router'
import privateStore from '@/store/privateStore'
const privateS = privateStore()

const store = Store()
const router = useRouter()
const props = defineProps({
  wsLink: {
    type: Boolean,
    default: false
  },
  wsData: {
    type: Object,
    default: () => ({ personList: [] })
  },
  title: {
    type: Number,
    default: 0
  }
})

// 返回群里
const backGroup = () => {
  store.setChatState(0)
  router.replace('/groupChat')
}
</script>

<style scoped>
.icon-xiangzuo {
  font-size: 3.2vh;
  font-weight: 100;
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
.personLength {
  font-size: 1.8vh;
}
</style>