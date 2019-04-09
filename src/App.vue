<template>
  <main>
    <sidebar-toggle-button @click="toggleSidebar"></sidebar-toggle-button>
    <sidebar :spec="spec" :apis="menu"></sidebar>
    <section class="content" @click="closeSidebar">
      <article class="markdown-section" id="main">
        <transition :name="transitionName">
          <router-view :spec="spec" :apis="menu" @open-request="openRequest"></router-view>
        </transition>
      </article>
    </section>
    <request-plugin
      @hide="hideRequest"
      :show="requestState.show"
      :action="requestState.routeSpec"
      :root="requestState.root"
    ></request-plugin>
    <div class="tips">
      <span>Press</span>
      <span class="key">F</span>
      <span>to search</span>
    </div>
  </main>
</template>

<script>
import {
  compileDesc,
  compileInlineDesc,
  compileNote,
  compileMarkdown,
} from './utils';
import SidebarToggleButton from './components/SidebarToggleButton.vue';
import Sidebar from './components/Sidebar.vue';
import RequestPlugin from './components/RequestPlugin.vue';
export default {
  components: { SidebarToggleButton, Sidebar, RequestPlugin },
  mounted() {
    const { name, version } = this.spec || {};
    if (name) {
      document.querySelector('body').dataset.name = name;
      document.title = version ? name + '@' + version : name;
    }
    if (version) {
      document.querySelector('body').dataset.version = version;
    }
    document.querySelector('body').classList.add('ready');
  },
  data() {
    let spec = {};
    let menu = [];

    if (typeof window.getAppSpec === 'function') {
      spec = window.getAppSpec();
    }

    spec.title = spec.title || spec.name;
    spec.description = spec.description && compileDesc(spec.description);
    spec.notes = spec.notes && spec.notes.map(compileNote);

    for (const c of spec.modules) {
      const children = [];
      for (const r of c.actions) {
        r.link = `/api/controller/${c.name}#${r.name}`;
        r.title = r.title || r.name;
        r.description = r.description && compileDesc(r.description);
        r.notes = r.notes && r.notes.map(compileNote);
        r.params = r.params
          .filter(p => p.type)
          .map(p => {
            p.description = p.description && compileInlineDesc(p.description);
            return p;
          });
        children.push({
          link: r.link,
          text: r.title,
        });
      }
      c.link = `/api/controller/${c.name}`;
      c.title = c.title || c.name;
      c.description = c.description && compileDesc(c.description);
      c.notes = c.notes && c.notes.map(compileNote);
      menu.push({
        link: c.link,
        text: c.title,
        children,
      });
    }

    for (const group of spec.docs || []) {
      for (const doc of group.list) {
        if (doc.markdown && !doc.html) {
          doc.html = compileMarkdown(doc.markdown);
        }
      }
    }

    const root = location.pathname.replace(window.serverPath, '');
    const requestState = {
      root,
      show: false,
      routeSpec: null,
      params: {},
      res: {
        status: null,
        body: null,
      },
    };
    return { spec, menu, requestState, transitionName: 'slide-left' };
  },
  watch: {
    $route(to, from) {
      const toDepth = to.path.split('/').length;
      const fromDepth = from.path.split('/').length;
      this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left';
    },
  },
  methods: {
    openRequest(routeSpec) {
      this.requestState.show = true;
      this.requestState.routeSpec = routeSpec;
    },
    hideRequest() {
      this.requestState.show = false;
    },
    toggleSidebar() {
      document.body.classList.toggle('close');
    },
    closeSidebar() {
      document.body.classList.remove('close');
    },
  },
};
</script>
<style scoped>
section.content {
  min-height: 100vh;
}
.tips {
  display: none;
  position: fixed;
  right: 16px;
  bottom: 16px;
  color: #999;
}
.tips .key {
  display: inline-block;
  margin: 0 4px;
  padding: 0 4px;
  background-color: #f3f3f3;
  border-radius: 4px;
}
@media screen and (min-width: 768px) {
  .tips {
    display: block;
  }
}
</style>
