<template>
  <div class="chat-subject">
    <List 
      class="list"
      :wsData="persons"
      :userIP="userIP"
    ></List>
    <Chat :infoData="groupInfoData" :userIP="userIP" :ws="ws" @pooledData="pooledData"></Chat>
  </div>
</template>

<script setup lang="ts">
import { toRefs } from 'vue'
import { storeToRefs } from 'pinia'
import List from '@/components/list/index.vue'
import Chat from '@/components/chat/index.vue'
import Store from '@/store'

const store = Store()
const storeRef = storeToRefs(store)

const { groupInfoData } = storeRef
const { ws, userIP, persons } = toRefs(storeRef.wsData.value)

// 滚动合并数据
const pooledData = (data) => {
  groupInfoData.value = [...data, ...store.groupInfoData]
}

</script>

<style lang="scss" scoped>
.chat-subject {
  display: flex;
  height: 100%;
  overflow: hidden;
  .list {
    min-width: 145px;
    width: 15px;
    border-right: 1px solid #eee;
    overflow: auto;
    padding: 0px 12px;
    margin-top: 6px;
    transition: all 0.15s;
  }
}
</style>
