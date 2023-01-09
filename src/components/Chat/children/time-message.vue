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

<style scoped>
.time-message {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
  color: #24292F;
  font-size: 13px;
}
</style>
