<template>
  <div ref="scrollEl" class="scroll-container" @touchstart="touchstart" @touchmove="touchmove" @touchend="touchend" @scroll="scroll">
    <div class="scroll-loading" :style="{ transition: !data.fl && 'all 0.2s', transform: `translateY(${data.upHeight}px)`}">
      <Transition name="scroll">
        <div v-if="data.fl || data.showStr" class="loader"></div>
      </Transition>
    </div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ref, Ref, reactive, watch } from 'vue'
let emit = defineEmits(['update:isLoad', 'pullDownHandler', 'cloneInfo']);
const isPC = !(/(\bAndroid(?:.+)Mobile\b|iPhone|iPod|iPad|Android)/i.test(navigator.userAgent))

const props = defineProps({
  // 是否加载完毕，完毕后才更改动画
  isLoad: {
    type: Boolean,
    default: false
  }
})
const scrollEl: Ref<HTMLElement | null> = ref(null)
defineExpose({
  scrollEl
});
const data = reactive({
  // 记录是否上拉刷新
  fl: false,
  // 刷新成功后显示文字
  showStr: false,
  // 起始位置
  startY: 0,
  // 下拉
  upHeight: 0,
  timer: 0
})

// 关闭动画函数
const closeLoading = () => {
  data.fl = false
  // 展示刷新成功字样
  data.showStr = true
  // 一秒后全部清除
  data.timer = setTimeout(() => {
    data.startY = 0
    data.upHeight = 0
    data.showStr = false
  }, 100);
}

// 触摸按下，记录第一次位置
const touchstart = (e: TouchEvent) => {
  data.startY = e.touches[0].pageY
}
// 上拉触发的距离
const height = window.innerHeight / 4

// 如果第一次位置减去当前位置坐标小于指定的触发距离，并且元素顶部距离时0时才执行下拉
const touchmove = (e: TouchEvent) => {
  // 判断
  if (data.startY - e.touches[0].pageY < -height && scrollEl.value.scrollTop === 0) {
    // fl代表开始执行下拉事件
    data.fl = true
    data.upHeight = Math.abs((data.startY - e.touches[0].pageY + height) / 2)
  } else {
    data.fl = false
  }
}

// 松开时间，先清除
const touchend = (e: TouchEvent) => {
  clearTimeout(data.timer)
  // 如果下拉开启了，才执行
  if (data.fl) {
    emit('pullDownHandler')
  }
}

watch(() => props.isLoad, () => {
  if (props.isLoad) {
    closeLoading()
    emit('update:isLoad', false)
  }
})

const scroll = (e) => {
  if (!isPC) return
  const target = e.target
  if (target.scrollHeight - (target.scrollTop + target.offsetHeight) < 40) {
    emit('cloneInfo')
  } else if (target.scrollTop <= 0) {
    emit('pullDownHandler')
  }
}
</script>

<style lang="scss" scoped>
.scroll-container {
  position: relative;
  height: 300px;
  padding: 16px;
  overflow: auto;
  .scroll-loading {
    position: absolute;
    z-index: 9999;
    top: 3vh;
    left: 50%;
    transform: translateY(-50%);
  }
}

.scroll-enter-active,
.scroll-leave-active {
  transition: all 0.33s;
}

.scroll-enter-from,
.scroll-leave-to {
  opacity: 1;
}

.scroll-leave-to,
.scroll-enter-from {
  opacity: 0;
}

// 加载动画
.loader {
 position: absolute;
 z-index: 8888;
 width: 2.5em;
 height: 2.5em;
 transform: rotate(165deg);
}

.loader:before, .loader:after {
 content: "";
 position: absolute;
 top: 50%;
 left: 50%;
 display: block;
 width: 0.5em;
 height: 0.5em;
 border-radius: 0.25em;
 transform: translate(-50%, -50%);
}

.loader:before {
 animation: before8 2s infinite;
}

.loader:after {
 animation: after6 2s infinite;
}

@keyframes before8 {
 0% {
  width: 0.5em;
  box-shadow: 1em -0.5em rgba(225, 20, 98, 0.75), -1em 0.5em rgba(111, 202, 220, 0.75);
 }

 35% {
  width: 2.5em;
  box-shadow: 0 -0.5em rgba(225, 20, 98, 0.75), 0 0.5em rgba(111, 202, 220, 0.75);
 }

 70% {
  width: 0.5em;
  box-shadow: -1em -0.5em rgba(225, 20, 98, 0.75), 1em 0.5em rgba(111, 202, 220, 0.75);
 }

 100% {
  box-shadow: 1em -0.5em rgba(225, 20, 98, 0.75), -1em 0.5em rgba(111, 202, 220, 0.75);
 }
}

@keyframes after6 {
 0% {
  height: 0.5em;
  box-shadow: 0.5em 1em rgba(61, 184, 143, 0.75), -0.5em -1em rgba(233, 169, 32, 0.75);
 }

 35% {
  height: 2.5em;
  box-shadow: 0.5em 0 rgba(61, 184, 143, 0.75), -0.5em 0 rgba(233, 169, 32, 0.75);
 }

 70% {
  height: 0.5em;
  box-shadow: 0.5em -1em rgba(61, 184, 143, 0.75), -0.5em 1em rgba(233, 169, 32, 0.75);
 }

 100% {
  box-shadow: 0.5em 1em rgba(61, 184, 143, 0.75), -0.5em -1em rgba(233, 169, 32, 0.75);
 }
}

.loader {
 position: absolute;
 top: calc(50% - 1.25em);
 left: calc(50% - 1.25em);
}
</style>