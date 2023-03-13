<template>
  <div class="time-message">{{ Date.now() - props.timer > Date.now() - new Date(new Date().toLocaleDateString()).getTime() ? dayjs(props.timer).format('MM-DD HH:mm:ss') : dayjs(props.timer).format('HH:mm:ss') }}</div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
const props = defineProps({
  timer: {
    type: Number,
    default: 0
  }
})
</script>

<style lang="scss" scoped>
.time-message {
  display: flex;
  justify-content: center;
  color: #24292F;
  font-size: 13px;
  padding: 15px 0;
}
</style>
