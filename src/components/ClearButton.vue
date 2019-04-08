<template>
  <div class="clear-button" :class="{show:show}" @click="$emit('click')">
    <svg width="26" height="24">
      <circle cx="12" cy="12" r="11" fill="#ccc"></circle>
      <path stroke="white" stroke-width="2" d="M8.25,8.25,15.75,15.75"></path>
      <path stroke="white" stroke-width="2" d="M8.25,15.75,15.75,8.25"></path>
    </svg>
  </div>
</template>
<script>
export default {
  props: ['show'],
};
</script>
<style lang="less" scoped>
.clear-button svg {
  transform: scale(0.5);
}
</style>
