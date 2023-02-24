<template>
  <List 
    class="List"
    :wsData="wsData"
    :userIP="userIP"
  ></List>
  <Chat :infoData="infoData" :userIP="userIP" :ws="ws" @pooledData="pooledData"></Chat>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import List from '../../components/List/index.vue'
import Chat from '../../components/Chat/index.vue'

import groupStore from '@/store/groupStore'
import Store from '@/store'

const store = Store()
const group = groupStore()

// 用户ip
const { ws, wsData, userIP } = storeToRefs(store)
// 消息数据
const { groupInfoData: infoData } = storeToRefs(group)

// 滚动合并数据
const pooledData = (data) => {
  infoData.value = [...data, ...group.groupInfoData]
}
</script>

<style scoped>
.List {
  position: sticky;
  top: 0;
  min-width: 145px;
  width: 15px;
  border-right: 1px solid #eee;
  overflow: auto;
  padding: 8px 12px;
  transition: all 0.15s;
}


</style>