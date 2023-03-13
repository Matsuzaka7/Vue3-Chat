<template>
  <div class="person-container" @click="e => showUl(e)" :style="{ minWidth: isShowUl ? '145px' : '12px', overflow: isShowUl ? 'auto' : 'hidden' }">
    <ul class="person-ul" v-if="props.wsData.personList && props.wsData.personList.length">
      <li @click="isShowUl && emitPrivate(item)" :class="{ busy: item === props.userIP }" v-for="item in wsData.personList">
        <i style="font-size: 20px;" class="iconfont icon-dian"></i><span class="name">{{ item }}</span></li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from "vue-router";
import { ElMessageBox } from 'element-plus'
import Store from '@/store';

const store = Store()
const router = useRouter()

const props = defineProps({
  wsData: {
    type: Object,
    default: () => ({})
  },
  userIP: {
    type: String,
    default: '0.0.0.0'
  }
})

// false打开, true关闭。打开左侧栏
const isShowUl = ref(false)
const showUl = (e) => {
  const target = e.target
  // 只有点击的是空白处、或面板是关闭的状态才能切换显示隐藏
  if (target.className.includes('person-container') || isShowUl.value === false) {
    isShowUl.value = !isShowUl.value
  }
}

// 进入私聊
const emitPrivate = (ip: string) => {
  if (ip == props.userIP) return
  ElMessageBox.confirm(`与${ip}私聊吗？`, '确认',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      center: true,
      customClass: 'custom'
    }
  ).then(() => {
    // 修改状态，进入私聊
    store.setChatState(1)
    // 保存正在聊天的用户ip
    store.setCarriedIP(ip)
    
    router.replace({
      name: 'privateChat',
      params: { ip }
    })
  }).catch(() => { })
}
</script>

<style lang="scss" scoped>
.person-ul {
  display: flex;
  flex-direction: column;
  transition: none;

  &>li {
    margin: 5px 0;
  }

  .busy {
    margin-bottom: 5px;
    color: lightseagreen;
  }

  .name {
    margin: 0 5px;
  }
}
</style>
