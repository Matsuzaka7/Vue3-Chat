<template>
  <div class="card">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
.card {
  padding: 10px 0px;
  border-radius: 8px;
  box-shadow: 0 0 6px -3px #000;
  user-select: none;
  overflow: hidden;
}
</style>