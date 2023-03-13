<template>
  <div class="header" :style="{ background: props.wsLink ? '#FF7AAD' : '#000' }">
    <div class="desc">
      <h1 class="title">
        <i v-if="props.title === 1" class="iconfont icon-xiangzuo" @click="backGroup"></i> 
        {{ props.title === 0 ? '砂糖聊天室' : `正在和${store.private.carriedIP}聊天` }}
      </h1>
      <span class="person-length" v-if="props.title === 0">当前人数：{{ props.persons?.personList?.length || 0 }}人</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import Store from '@/store';
import { useRouter } from 'vue-router'

const store = Store()
const router = useRouter()
const props = defineProps({
  wsLink: {
    type: Boolean,
    default: false
  },
  persons: {
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

<style lang="scss" scoped>
.icon-xiangzuo {
  font-size: 5.5vw;
  font-weight: 100;
}

.header {
  color: #fff;
  padding: 15px 35px 5px;
  margin: -10px -15px 0;
  transition: all 0.3s;
  box-shadow: 0 0 10px -3px #333;
  .desc {
    display: flex;
    align-items: baseline;
    .title {
      font-size: 5.5vw;
      padding: 8px 6px;
    }
    .person-length {
      font-size: 3.2vw;
    }
  }
}
</style>
