<template>
  <div class="hint" v-if="props.notice">
    <span>{{ props.privateMessageList.length === 0 ? props.notice : '有新消息' }}</span>
    <div class="newPrivate">
      <span v-for="item in props.privateMessageList" :key="item.ip" @click="() => toPrivate(item)">{{ item.ip }}<i
          class="prompt" v-if="!item.isFlag"></i></span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Store from '@/store';
import { useRouter } from 'vue-router'

const store = Store()
const router = useRouter()

type propsType = {
  isFlag: boolean,
  ip: string
}
const props = defineProps({
  notice: {
    type: String,
    default: ''
  },
  privateMessageList: {
    type: Array<propsType>,
    default: () => []
  }
})

const toPrivate = ({ ip }) => {
  // 修改状态，进入私聊
  store.setChatState(1)
  // 保存正在聊天的用户ip
  store.setCarriedIP(ip)
  router.replace({
    name: 'privateChat',
    params: {
      ip
    }
  })
  const find = props.privateMessageList.find(item => item.ip === ip)
  if (find) {
    find.isFlag = true
  }
}
</script>

<style lang="scss" scoped>
.hint {
  display: flex;
  margin-left: 12px;
  font-size: 14px;
  color: #333;

  .newPrivate>span {
    margin-left: 5px;
    padding: 6px 8px;
    color: #33aaff;
    background-color: #f6f6f6;
    position: relative;

    .prompt {
      position: absolute;
      right: -2px;
      top: -2px;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: #ff6666;
    }
  }
}
</style>