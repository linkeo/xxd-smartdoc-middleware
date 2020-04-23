<template>
  <section class="request-plugin" :class="{hide:!show}" @keyup.esc="hide">
    <close-icon class="close-icon" @click="hide"></close-icon>
    <section v-if="action" class="request markdown-section">
      <header>
        <p>
          <strong>{{action.route.method}} {{action.route.path}}</strong>
          <router-link :to="action.link">
            <link-icon></link-icon>
          </router-link>
        </p>
      </header>
      <article class="request-content">
        <template v-if="params && params.length">
          <table class="request-params">
            <tbody>
              <tr class="param" v-for="param in params" :key="param.name">
                <td class="key">{{param.title || param.name}}</td>
                <td class="value">
                  <input-file
                    v-if="param.type == 'Upload'"
                    :placeholder="param.type"
                    v-model="param.value"
                    @focus="showPanel('preview')"
                  ></input-file>
                  <input
                    v-else
                    type="text"
                    :placeholder="param.type"
                    v-model="param.value"
                    @focus="showPanel('preview')"
                  >
                </td>
              </tr>
            </tbody>
          </table>
        </template>
        <table>
          <tbody>
            <tr>
              <td>
                <span class="link-button" @click="showPanel('preview')">预览</span>
              </td>
              <td>
                <span class="link-button" @click="send">发送</span>
              </td>
              <template v-if="response.status">
                <td>
                  <span class="link-button" @click="showPanel('response')">响应</span>
                </td>
                <td v-if="isPretty">
                  <span class="link-button" @click="setPretty(false)">简化</span>
                </td>
                <td v-else>
                  <span class="link-button" @click="setPretty(true)">美化</span>
                </td>
              </template>
            </tr>
          </tbody>
        </table>
        <template v-if="showingPreview">
          <pre class="preview"><code v-html="preview"></code></pre>
        </template>
        <template v-if="showingResponse">
          <pre v-if="response.pending"><code>Request pending...</code></pre>
          <template v-else>
            <p class="response-meta">
              <small>状态码</small>
              <span>{{response.status}}</span>
              <small>所用时间</small>
              <span>{{responseTime}}</span>
            </p>
            <pre class="response-error" v-if="response.error"><code v-html="response.error"></code></pre>
            <pre class="response-body" v-if="response.body"><code class="language-json" v-html="responseBody"></code></pre>
          </template>
        </template>
      </article>
    </section>
  </section>
</template>

<script>
import qs from 'qs';
import Prism from 'prismjs';
import InputFile from './InputFile.vue';

const html = (...nodes) => {
  const div = document.createElement('div');
  nodes.forEach(node => {
    div.appendChild(node);
  });
  return div.innerHTML;
};
const text = text => document.createTextNode(text);
const node = (tagName, className, text) => {
  const e = document.createElement(tagName);
  e.className = className;
  e.innerText = text;
  return e;
};

const getDefaultResponseState = () => ({
  pending: false,
  version: null,
  pretty: true,
  elapsed: null,
  status: null,
  body: null,
  error: null,
});

export default {
  components: { InputFile },
  props: ['show', 'action', 'root'],
  data() {
    return {
      params: [],
      panel: 'preview',
      response: getDefaultResponseState(),
    };
  },
  mounted() {
    if (this.keyupListener) {
      window.removeEventListener('keyup', this.keyupListener);
    }
    this.keyupListener = event => {
      if (this.show && event.key === 'Escape') {
        this.hide();
      }
    };
    window.addEventListener('keyup', this.keyupListener);
    if (this.action) {
      const routePath = (this.action.route && this.action.route.path) || '';
      const routeParams = (routePath.match(/:\w+/g) || []).map(pn =>
        pn.slice(1),
      );
      // console.log(routePath, routeParams);
      const hasBody = !/^(get|delete)$/i.test(this.action.route.method);
      const hasMultipart = (this.action.params || []).some(
        param => param.type === 'Upload',
      );
      const pos = param =>
        param.type === 'Upload'
          ? 'file'
          : routeParams.includes(param.name)
          ? 'param'
          : hasBody
          ? hasMultipart
            ? 'field'
            : 'body'
          : 'query';
      this.params = (this.action.params || []).map(param => ({
        key: param.name,
        pos: pos(param),
        name: param.name,
        type: param.type,
        value: null,
      }));
    }
  },
  beforeDestroy() {
    if (this.keyupListener) {
      window.removeEventListener('keyup', this.keyupListener);
    }
  },
  watch: {
    show(to, from) {
      if (to && !from) {
        this.panel = 'preview';
        this.response = getDefaultResponseState();
        if (this.action) {
          const routePath = (this.action.route && this.action.route.path) || '';
          const routeParams = (routePath.match(/:\w+/g) || []).map(pn =>
            pn.slice(1),
          );
          // console.log(routePath, routeParams);
          const hasBody = !/^(get|delete)$/i.test(this.action.route.method);
          const hasMultipart = (this.action.params || []).some(
            param => param.type === 'Upload',
          );
          const pos = param =>
            param.type === 'Upload'
              ? 'file'
              : routeParams.includes(param.name)
              ? 'param'
              : hasBody
              ? hasMultipart
                ? 'field'
                : 'body'
              : 'query';
          this.params = (this.action.params || []).map(param => ({
            key: param.name,
            pos: pos(param),
            name: param.name,
            type: param.type,
            value: null,
          }));
        }
      }
    },
    action(to, from) {
      if (from && to !== from) {
        const routePath = (to.route && to.route.path) || '';
        const routeParams = (routePath.match(/:\w+/g) || []).map(pn =>
          pn.slice(1),
        );
        // console.log(routePath, routeParams);
        const hasBody = !/^(get|delete)$/i.test(to.route.method);
        const hasMultipart = (to.params || []).some(
          param => param.type === 'Upload',
        );
        const pos = param =>
          param.type === 'Upload'
            ? 'file'
            : routeParams.includes(param.name)
            ? 'param'
            : hasBody
            ? hasMultipart
              ? 'field'
              : 'body'
            : 'query';
        this.params = (to.params || []).map(param => ({
          key: param.name,
          pos: pos(param),
          name: param.name,
          type: param.type,
          value: null,
        }));
        this.panel = 'preview';
        this.response = getDefaultResponseState();
      }
    },
  },
  computed: {
    showingPreview() {
      return this.panel === 'preview';
    },
    showingResponse() {
      return this.panel === 'response';
    },
    isPretty() {
      return this.response.pretty;
    },
    responseTime() {
      const value = this.response.elapsed;
      if (!value) {
        return 'N/A';
      }
      return value >= 1000 ? (value / 1000).toFixed(1) + 's' : value + 'ms';
    },
    previewPath() {
      if (!this.action) {
        return '';
      }
      let path = this.action.route.path;
      let params = {};
      for (const param of this.params) {
        if (param.pos === 'param' && param.value) {
          if (param.name) {
            params[param.name] = param.value;
          } else {
            for (const key of Object.keys(param.value)) {
              params = Object.assign({}, param.value[key], params);
            }
          }
        }
      }
      for (const key of Object.keys(params)) {
        path = path.replace(':' + key, params[key]);
      }
      return html(node('b', 'p', location.origin + this.root + path));
    },
    previewSearch() {
      if (!this.action) {
        return '';
      }
      let query = {};
      for (const param of this.params) {
        if (param.pos === 'query' && param.value) {
          if (param.name) {
            query[param.name] = param.value;
          } else {
            for (const key of Object.keys(param.value)) {
              query = Object.assign({}, param.value[key], query);
            }
          }
        }
      }
      if (Object.keys(query).length === 0) {
        return '';
      }
      return (
        html(text('?')) +
        Object.keys(query)
          .map(key =>
            html(
              node('b', 'bk', encodeURIComponent(key)),
              text('='),
              node('b', 'bv', encodeURIComponent(query[key])),
            ),
          )
          .join(html(text('&')))
      );
    },
    previewHeaders() {
      if (!this.action) {
        return [];
      }
      let headers = {};
      for (const param of this.params) {
        if (param.pos === 'header' && param.value) {
          if (param.name) {
            headers[param.name] = param.value;
          } else {
            for (const key of Object.keys(param.value)) {
              headers = Object.assign({}, param.value[key], headers);
            }
          }
        }
      }
      if (Object.keys(headers).length === 0) {
        return [];
      }
      return Object.keys(headers).map(key =>
        html(node('b', 'hk', key), text(': '), node('b', 'hv', headers[key])),
      );
    },
    previewBody() {
      if (!this.action) {
        return [];
      }
      let rawBody;
      let simple = {};
      let multipart = [];
      for (const param of this.params) {
        if (param.value) {
          if (param.pos === 'rawbody') {
            rawBody = param.value;
          } else if (param.pos === 'body') {
            if (param.name) {
              simple[param.name] = param.value;
            } else {
              simple = Object.assign({}, param.value[key], simple);
            }
          } else if (param.pos === 'file') {
            multipart.push([param.name, param.value.name]);
          } else if (param.pos === 'files') {
            for (const file of param.value) {
              multipart.push([param.name, file.name]);
            }
          } else if (param.pos === 'field') {
            multipart.push([param.name, param.value]);
          } else if (param.pos === 'fields') {
            for (const value of param.value) {
              multipart.push([param.name, value]);
            }
          }
        }
      }
      if (rawBody) {
        return [
          html(
            node('b', 'hk', 'Content-Type'),
            text(': '),
            node('b', 'hv', 'text/plain'),
          ),
          '',
          html(node('b', 'b', rawBody)),
        ];
      }
      if (multipart.length > 0) {
        return [
          html(
            node('b', 'hk', 'Content-Type'),
            text(': '),
            node('b', 'hv', 'multipart/form-data'),
          ),
          '',
          multipart
            .map(([key, value]) =>
              html(
                node('b', 'bk', encodeURIComponent(key)),
                text('='),
                node('b', 'bv', encodeURIComponent(value)),
              ),
            )
            .join('\n'),
        ];
      }
      if (Object.keys(simple).length > 0) {
        return [
          html(
            node('b', 'hk', 'Content-Type'),
            text(': '),
            node('b', 'hv', 'application/x-www-form-urlencoded'),
          ),
          '',
          Object.keys(simple)
            .map(key =>
              html(
                node('b', 'bk', encodeURIComponent(key)),
                text('='),
                node('b', 'bv', encodeURIComponent(simple[key])),
              ),
            )
            .join(html(text('&'))),
        ];
      }
      return [];
    },
    requestPath() {
      if (!this.action) {
        return '';
      }
      let path = this.action.route.path;
      let params = {};
      for (const param of this.params) {
        if (param.pos === 'param' && param.value) {
          if (param.name) {
            params[param.name] = param.value;
          } else {
            for (const key of Object.keys(param.value)) {
              params = Object.assign({}, param.value[key], params);
            }
          }
        }
      }
      for (const key of Object.keys(params)) {
        path = path.replace(':' + key, params[key]);
      }
      return location.origin + this.root + path;
    },
    requestSearch() {
      if (!this.action) {
        return '';
      }
      let query = {};
      for (const param of this.params) {
        if (param.pos === 'query' && param.value) {
          if (param.name) {
            query[param.name] = param.value;
          } else {
            for (const key of Object.keys(param.value)) {
              query = Object.assign({}, param.value[key], query);
            }
          }
        }
      }
      if (Object.keys(query).length === 0) {
        return '';
      }
      return '?' + qs.stringify(query);
    },
    requestHeaders() {
      if (!this.action) {
        return null;
      }
      let headers = {};
      for (const param of this.params) {
        if (param.pos === 'header' && param.value) {
          if (param.name) {
            headers[param.name] = param.value;
          } else {
            for (const key of Object.keys(param.value)) {
              headers = Object.assign({}, param.value[key], headers);
            }
          }
        }
      }
      if (Object.keys(headers).length === 0) {
        return null;
      }
      return Object.keys(headers).reduce((hds, key) => {
        hds.set(key, headers[key]);
        return hds;
      }, new Headers());
    },
    requestBody() {
      let rawBody;
      let simple = {};
      let multipart = [];
      for (const param of this.params) {
        if (param.value) {
          if (param.pos === 'rawbody') {
            rawBody = String(param.value);
          } else if (param.pos === 'body') {
            if (param.name) {
              simple[param.name] = param.value;
            } else {
              simple = Object.assign({}, param.value[key], simple);
            }
          } else if (param.pos === 'file') {
            multipart.push([param.name, param.value]);
          } else if (param.pos === 'files') {
            for (const file of param.value) {
              multipart.push([param.name, file]);
            }
          } else if (param.pos === 'field') {
            multipart.push([param.name, param.value]);
          } else if (param.pos === 'fields') {
            for (const value of param.value) {
              multipart.push([param.name, value]);
            }
          }
        }
      }
      if (rawBody) {
        return rawBody;
      }
      if (multipart.length > 0) {
        return multipart.reduce((formData, part) => {
          formData.append(part[0], part[1]);
          return formData;
        }, new FormData());
      }
      if (Object.keys(simple).length > 0) {
        return Object.keys(simple).reduce((search, key) => {
          search.append(key, simple[key]);
          return search;
        }, new URLSearchParams());
      }
      return null;
    },
    preview() {
      if (!this.action) {
        return '';
      }
      const method = this.action.route.method;
      const lines = [
        [
          html(node('b', 'm', method)),
          this.previewPath + this.previewSearch,
        ].join(' '),
        ...this.previewHeaders,
        ...this.previewBody,
      ];
      return lines.join('\n');
    },
    responseBody() {
      if (!this.response.body) {
        return '';
      }
      const json = this.response.pretty
        ? JSON.stringify(this.response.body, 0, 2)
        : JSON.stringify(this.response.body);
      return Prism.highlight(json, Prism.languages.javascript, 'json');
    },
  },
  methods: {
    hide() {
      this.$emit('hide');
    },
    showPanel(key) {
      this.panel = key;
    },
    setPretty(pretty) {
      this.response.pretty = pretty;
    },
    clearFile(key) {
      this.params[key] = null;
      this.paramsUpdated = Date.now();
    },
    hasFile(key) {
      return this.params[key] instanceof File;
    },
    send() {
      if (!this.action) {
        return;
      }
      const url = this.requestPath + this.requestSearch;
      const options = {
        method: this.action.route.method,
        mode: 'same-origin',
        credentials: 'same-origin',
      };
      const headers = this.requestHeaders;
      if (headers) {
        options.headers = headers;
      }
      const body = this.requestBody;
      if (body) {
        options.body = body;
      }
      const version = Date.now();
      this.response.version = version;
      this.response.pending = true;
      this.response.status = null;
      this.response.body = null;
      this.response.error = null;
      this.response.elapsed = null;
      const start = Date.now();
      this.showPanel('response');
      fetch(url, options)
        .then(res => {
          if (this.response.version === version) {
            this.response.status = res.status;
            return res.json();
          }
        })
        .then(body => {
          if (this.response.version === version) {
            this.response.body = body;
            this.response.pending = false;
            this.response.elapsed = Date.now() - start;
          }
        })
        .catch(err => {
          if (this.response.version === version) {
            this.response.error = err.message;
            this.response.pending = false;
            this.response.elapsed = Date.now() - start;
          }
        });
    },
  },
};
</script>

<style scoped>
td.value >>> input {
  margin: 0;
  padding: 0;
  border: none;
  appearance: none;
  outline: none;
  background-color: transparent;
  font-family: inherit;
  font-size: inherit;
  color: inherit;
}

td.value >>> input::-webkit-input-placeholder {
  color: #ccc;
  font-style: italic;
}
td.value >>> input::-moz-placeholder {
  color: #ccc;
  font-style: italic;
}
td.value >>> input:-ms-input-placeholder {
  color: #ccc;
  font-style: italic;
}
td.value >>> input:-moz-placeholder {
  color: #ccc;
  font-style: italic;
}

pre.preview code {
  color: #ccc;
}
pre.preview code >>> b {
  font-weight: normal;
}
pre.preview code >>> b.m {
  color: #42b983;
}
pre.preview code >>> b.p,
pre.preview code >>> b.sv,
pre.preview code >>> b.br,
pre.preview code >>> b.bv {
  color: #666;
}
pre.preview code >>> b.sk,
pre.preview code >>> b.bk,
pre.preview code >>> b.hk,
pre.preview code >>> b.hv {
  color: #999;
}
.close-icon {
  position: relative;
}
.close-icon >>> svg {
  fill: #ccc;
}
.close-icon::after {
  position: absolute;
  content: 'esc';
  font-size: 14px;
  top: 2px;
  left: -30px;
  padding: 0 4px;
  background-color: #f8f8f8;
  color: #ccc;
  border-radius: 4px;
}
</style>


<style lang="less" scoped>
section.request-plugin {
  position: fixed;
  top: 0;
  right: 0;
  margin: 16px;
  width: ~'calc(100vw - 32px)';
  max-width: 640px;
  transition: right 0.25s ease-out;
  background-color: #fff;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  z-index: 4;

  &.hide {
    right: -100%;
  }

  > .close-icon {
    z-index: 3;
    position: absolute;
    font-size: 1.3em;
    color: #ccc;
    right: 16px;
    top: 20px;
  }

  section.request {
    padding: 1px 16px;

    > header {
      padding-right: 32px;
    }
  }
  article.request-content {
    max-height: 75vh;
    overflow: hidden auto;

    > :first-child {
      margin-top: 0;
    }
  }

  .link-button {
    color: #42b983;
    cursor: pointer;
    user-select: none;

    &.disabled {
      color: #ccc;
    }
  }
  .response-meta small {
    color: #999;
    font-size: 0.7em;
  }
  pre.preview,
  pre.response-error,
  pre.response-body {
    max-height: 50vh;
    white-space: pre-wrap;
    word-break: break-all;
  }
  pre.response-error > code {
    color: #be0e2e;
  }
}
</style>
