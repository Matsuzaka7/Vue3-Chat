<template>
  <div @click="showUl">
    <i class="iconfont icon-dian temp"></i>
    <ul class="list" v-if="props.wsData.personList && props.wsData.personList.length">
      <li :class="{busy: item === props.userIP}" v-for="item in props.wsData.personList"><i style="font-size: 20px;" class="iconfont icon-dian"></i><span class="name">{{ item }}</span></li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const emit = defineEmits(['updateWidth'])
const props = defineProps({
  wsData: {
    type: Object,
    default: {}
  },
  userIP: {
    type: String,
    default: ''
  }
})

// false打开, true关闭
const isShowUl = ref(false)
const showUl = () => {
  isShowUl.value = !isShowUl.value
  emit('updateWidth', isShowUl)
}

</script>

<style scoped>
.temp {
  position: absolute;
  top: -9999px;
  left: -9999px;
}
.show {
  margin-bottom: 4px;
}
.icon-xiangzuo {
  padding: 0 4px;
  display: inline-block;
}
.list {
  display: flex;
  flex-direction: column;
  transition: none;
}

.list > li {
  margin: 5px 0;
}

.busy {
  margin-bottom: 5px;
  color: lightseagreen;
}

.name {
  margin: 0 5px;
}

.active {
  text-decoration: underline;
}
</style>