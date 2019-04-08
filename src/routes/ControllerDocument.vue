<template>
  <div>
    <h1>{{controller.title}}</h1>
    <section v-if="controller.description" v-html="controller.description"></section>
    <blockquote v-for="(note,index) in controller.notes" :key="index" v-html="note"></blockquote>

    <ul v-if="controller.actions && controller.actions.length">
      <li v-for="route in controller.actions" :key="route.name">
        <router-link :to="route.link">
          <span>{{route.title || route.name}}</span>
          <code>{{route.route.method}} {{route.route.path}}</code>
        </router-link>
      </li>
    </ul>

    <section v-for="route in controller.actions" :key="route.name">
      <h2 :id="route.name">{{route.title}}</h2>
      <p>
        <code>{{route.route.method}} {{route.route.path}}</code>
      </p>
      <section v-if="route.description" v-html="route.description"></section>
      <blockquote v-for="(note,index) in route.notes" :key="index" v-html="note"></blockquote>
      <p>
        <strong>请求参数</strong>
        <span class="open-request" @click="$emit('open-request', route)">试一试</span>
      </p>
      <ul v-if="route.params&&route.params.length">
        <li v-for="(param,index) in route.params" :key="index">
          <strong>{{param.name}}</strong>
          <em>{{param.type}}</em>
          <template v-if="param.description">
            <span>-</span>
            <span v-html="param.description"></span>
          </template>
          <span class="validator-list" v-if="param.validators && param.validators.length">
            <em>[</em>
            <small>
              <em>Validators</em>
            </small>
            <small
              class="validator-item"
              v-for="(vtext,vindex) in param.validators"
              :key="vindex"
            >&nbsp;{{vtext}}</small>
            <em>]</em>
          </span>
        </li>
      </ul>
      <p v-else>无</p>
    </section>
  </div>
</template>

<script>
export default {
  props: ['spec', 'apis'],
  data() {
    const path = (this.$route && this.$route.path) || '';
    const name = path.replace('/api/controller/', '');

    return {
      controller:
        ((this.spec && this.spec.modules) || []).find(
          item => item.name == name,
        ) || {},
    };
  },
  watch: {
    $route(to) {
      const path = (to && to.path) || '';
      const name = path.replace('/api/controller/', '');
      this.controller =
        ((this.spec && this.spec.modules) || []).find(
          item => item.name == name,
        ) || {};
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
