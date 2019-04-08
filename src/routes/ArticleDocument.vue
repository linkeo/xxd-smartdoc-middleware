<template>
  <div v-html="doc.html"></div>
</template>

<script>
export default {
  props: ['spec', 'apis'],
  data() {
    const path = (this.$route && this.$route.path) || '';
    const key = path.replace('/api/controller/', '');

    const doc = ((this.spec && this.spec.docs) || [])
      .map(group => group.list.find(item => item.link === path))
      .find(item => item);

    return {
      doc,
    };
  },
  watch: {
    $route(to) {
      const path = (to && to.path) || '';
      const key = path.replace('/api/controller/', '');
      this.doc = ((this.spec && this.spec.docs) || [])
        .map(group => group.list.find(item => item.link === path))
        .find(item => item);
    },
  },
};
</script>

<style lang="less" scoped>
span.open-request {
  cursor: pointer;
  user-select: none;
  color: #42b983;
  &:hover {
    text-decoration: underline;
  }
}
span.validator-list {
  opacity: 0.25;
  .validator-item {
    display: none;
  }
  &:hover {
    opacity: 1;
    .validator-item {
      display: initial;
    }
  }
}
</style>
