<template>
  <aside class="sidebar" ref="container">
    <search :spec="spec"></search>
    <h1 class="app-name">
      <router-link to="/" class="app-name-link">{{spec && spec.title}}</router-link>
    </h1>
    <section class="sidebar-nav">
      <ul>
        <li v-if="apis && apis.length">
          <p>APIs</p>
          <ul>
            <li
              v-for="controller in apis"
              :key="controller.link"
              :class="{active:isCurrent(controller.link)}"
            >
              <router-link
                class="section-link"
                :to="controller.link"
                :ref="controller.link"
              >{{controller.text}}</router-link>
              <ul v-if="isPrefixed(controller.link)" class="app-sub-sidebar">
                <li
                  v-for="route in controller.children"
                  :key="route.link"
                  :class="{active:isCurrent(route.link)}"
                >
                  <router-link
                    class="section-link"
                    :to="route.link"
                    :ref="route.link"
                  >{{route.text}}</router-link>
                </li>
              </ul>
            </li>
          </ul>
        </li>
        <!-- <li>
          <p>数据字典</p>
          <ul>
            <li>
              <a href="#" class="section-link">
                <small>
                  <small>模型</small>
                </small>
                <strong>Info</strong>
              </a>
            </li>
            <li>
              <a href="#" class="section-link">
                <small>
                  <small>模型</small>
                </small>
                <strong>User</strong>
              </a>
            </li>
          </ul>
        </li>-->
        <li v-if="spec.docs && spec.docs.length">
          <p>文章</p>
          <template v-for="(group,gid) in spec.docs">
            <p v-if="group.prefix" :key="group.prefix">
              <small>{{group.prefix}}</small>
            </p>
            <ul :key="gid">
              <li
                v-for="(item,iid) in group.list"
                :key="iid"
                :class="{active:isCurrent(item.link)}"
              >
                <router-link class="section-link" :to="item.link" :ref="item.link">{{item.title}}</router-link>
                <ul
                  v-if="isPrefixed(item.link) && item.children && item.children.length"
                  class="app-sub-sidebar"
                >
                  <li
                    v-for="(sec,sid) in item.children"
                    :key="sid"
                    :class="{active:isCurrent(sec.link)}"
                  >
                    <router-link class="section-link" :to="sec.link" :ref="sec.link">{{sec.title}}</router-link>
                  </li>
                </ul>
              </li>
            </ul>
          </template>
        </li>
      </ul>
    </section>
  </aside>
</template>
<script>
import Search from './Search.vue';
import clamp from 'lodash.clamp';
import { timer as createTimer } from 'd3-timer';
import { easeCubicOut as ease } from 'd3-ease';

const timestamp = Symbol('timestamp');
const scrollDuration = 500;

export default {
  components: { Search },
  props: ['spec', 'apis'],
  data() {
    return {
      curr: this.$route.fullPath,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.scrollToCurrent();
    });
  },
  watch: {
    $route(to) {
      this.curr = to.fullPath;
      setTimeout(() => {
        this.scrollToCurrent();
      }, 0);
    },
  },
  methods: {
    isPrefixed(link) {
      return (this.curr || '').startsWith(link);
    },
    isCurrent(link) {
      return this.curr === link;
    },
    scrollToCurrent() {
      const container = this.$refs.container;
      const ref =
        (this.$refs[this.curr] && this.$refs[this.curr][0]) ||
        this.$refs[this.curr];
      const element = (ref && ref.$el) || ref;
      if (container && element) {
        let t = Date.now();
        this[timestamp] = t;
        const from = container.scrollTop;
        const to = clamp(
          element.offsetTop -
            (container.clientHeight - element.clientHeight) / 2,
          0,
          container.scrollHeight - container.clientHeight,
        );
        let timer = createTimer(elapsed => {
          const percent = elapsed / scrollDuration;
          const progress = ease(percent);
          const curr = from + (to - from) * progress;
          container.scrollTop = curr;
          if (elapsed > scrollDuration || t !== this[timestamp]) {
            timer.stop();
          }
        });
      }
    },
  },
};
</script>
<style scoped>
small {
  text-transform: uppercase;
  font-size: 0.7em;
}
details summary {
  display: block;
  user-select: none;
  appearance: none;
  outline: none;
}
details summary::-webkit-details-marker {
  display: none;
}
.scroll-list {
  max-height: 60vh;
  overflow: hidden auto;
}
</style>
