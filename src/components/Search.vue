<template>
  <div class="search">
    <div class="input-wrap">
      <input type="search" placeholder="搜索 API或文档" v-model="keyword">
      <clear-button :show="!!keyword" @click="clear"></clear-button>
    </div>
    <div class="results-panel" :class="{show:keyword}">
      <p class="empty" v-if="results.length === 0">无结果</p>
      <div class="matching-post" v-for="(item,index) in results" :key="index" @click="clear">
        <router-link :to="item.link">
          <h2>
            <small v-if="item.type">{{item.type}}</small>
            <span>{{item.title}}</span>
          </h2>
          <p v-if="item.text">{{item.text}}</p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import escapeRegexp from 'lodash.escaperegexp';
import ClearButton from './ClearButton.vue';

const makeRegexp = keyword => {
  const matches = keyword.match(/\w+|[\u4e00-\u9fa5]|[^\w\s\u4e00-\u9fa5]+/g);
  if (!matches) {
    return null;
  }
  const pattern = matches.map(escapeRegexp).join('.{0,100}');
  return new RegExp(pattern, 'i');
};

export default {
  components: { ClearButton },
  props: ['spec'],
  data() {
    return {
      keyword: '',
      results: [],
    };
  },
  methods: {
    clear() {
      this.keyword = '';
    },
  },
  watch: {
    keyword(to) {
      const regexp = makeRegexp(to);
      let limit = 90;
      if (regexp) {
        const results = [];
        for (const controller of (this.spec && this.spec.modules) || []) {
          if (regexp.test(controller.title)) {
            results.push({
              title: controller.title,
              text: '控制器',
              link: `/api/controller/${controller.name}`,
            });
          }
          for (const route of controller.actions || []) {
            if (
              regexp.test(route.title) ||
              regexp.test(`${route.route.method} ${route.route.path}`)
            ) {
              results.push({
                title: `${route.title}（${controller.title}）`,
                text: `接口：${route.route.method} ${route.route.path}`,
                link: `/api/controller/${controller.name}#${route.name}`,
              });
            }
          }
        }
        const match = (regexp, title, paragraphs) => {
          if (
            regexp.test(title) ||
            paragraphs.some(content => regexp.test(content))
          ) {
            let index = 0;
            const matchContent = paragraphs.find(content =>
              regexp.test(content),
            );
            const content = matchContent || paragraphs[0] || '';
            if (matchContent) {
              const match = matchContent.match(regexp);
              index = Math.max(
                0,
                Math.min(match.index - 20, matchContent.length - limit + 20),
              );
            }
            let prefix = index > 0 ? '...' : '';
            let suffix = index + limit < content.length ? '...' : '';
            return {
              result: true,
              preview: prefix + content.slice(index, index + limit) + suffix,
            };
          }
          return {
            result: false,
            preview: '',
          };
        };
        for (const group of (this.spec && this.spec.docs) || []) {
          for (const item of group.list) {
            for (const section of item.children) {
              const sectionMatch = match(
                regexp,
                section.title,
                section.content || [],
              );
              if (sectionMatch.result) {
                results.push({
                  title: item.title + ' • ' + section.title,
                  text: sectionMatch.preview || section.title,
                  link: section.link,
                });
              }
            }
            const itemMatch = match(regexp, item.title, item.content || []);
            if (itemMatch.result) {
              results.push({
                title: item.title,
                text: itemMatch.preview || item.title,
                link: item.link,
              });
            }
          }
        }
        this.results = results;
      } else {
        this.results = [];
      }
    },
  },
};
</script>
