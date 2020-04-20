<template>
  <div @click="onContentClick" v-html="doc.html"></div>
</template>

<script>
export default {
  props: ['spec', 'apis'],
  data() {
    const path = (this.$route && this.$route.path) || '';
    const doc = ((this.spec && this.spec.docs) || [])
      .map(group => group.list.find(item => item.link === path))
      .find(item => item);

    return {
      doc,
    };
  },
  methods: {
    onContentClick(event) {
      console.log(event.target);
      const { target } = event;
      // if (even)
      if (target.tagName === 'A') {
        // raw id link
        if (
          location.origin === target.origin &&
          location.pathname === target.pathname &&
          /^#[^/]/.test(target.hash)
        ) {
          event.preventDefault();
          this.$router && this.$router.replace(target.hash);
        }
      }
      // if (event)
    },
  },
  watch: {
    $route(to) {
      const path = (to && to.path) || '';
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
