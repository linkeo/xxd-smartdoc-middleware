import Vue from 'vue';
import VueRouter from 'vue-router';
import LinkIcon from 'vue-material-design-icons/LinkVariant.vue';
import CloseIcon from 'vue-material-design-icons/CloseCircle.vue';
import { timer as createTimer } from 'd3-timer';
import { easeCubicOut as ease } from 'd3-ease';
import clamp from 'lodash.clamp';
import throttle from 'lodash.throttle';
import maxBy from 'lodash.maxby';
import App from './App.vue';
import Home from './routes/Home';
import ControllerDocument from './routes/ControllerDocument.vue';
import ArticleDocument from './routes/ArticleDocument.vue';
import './defaults';

const anchorOffset = 100;
const setAnchorInterval = 1000;
const scrollDuration = 500;
const scrollListenInterval = 100;
let autoScroller = 0;
let autoAnchorer = 0;

Vue.use(VueRouter);
Vue.component('close-icon', CloseIcon);
Vue.component('link-icon', LinkIcon);

const clearAnchor = () => {
  document.querySelectorAll('.anchor-active').forEach(element => {
    element.classList.remove('anchor-active');
  });
};
const setAnchor = (() => {
  let state = {};
  return (selector, selectorAsId = false) => {
    const getTargetElement = () =>
      selectorAsId
        ? document.getElementById(selector)
        : document.querySelector(selector);

    if (state[selector]) {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      clearAnchor();
      const element = getTargetElement();
      console.log(selector, selectorAsId, element);
      if (element) {
        state[selector] = true;
        setTimeout(() => {
          const showingElement = getTargetElement();
          if (showingElement) {
            showingElement.classList.add('anchor-active');
          }
          resolve();
          setTimeout(() => {
            state[selector] = false;
          }, setAnchorInterval);
        }, 0);
      }
    });
  };
})();

const scrollToElement = (() => {
  let timestamp;
  return (selector, selectorAsId = false) => {
    const getTargetElement = () =>
      selectorAsId
        ? document.getElementById(selector)
        : document.querySelector(selector);

    return new Promise((resolve, reject) => {
      autoScroller += 1;
      let t = Date.now();
      timestamp = t;
      const element = getTargetElement();
      if (!element) {
        resolve();
        return;
      }
      const change = element.getBoundingClientRect().top - anchorOffset;
      const from = window.scrollY;
      const max = document.body.scrollHeight - document.body.clientHeight;
      const to = clamp(from + change, 0, max);
      let timer = createTimer(elapsed => {
        const percent = elapsed / scrollDuration;
        const progress = ease(percent);
        const curr = from + (to - from) * progress;
        window.scrollTo(0, curr);
        if (elapsed > scrollDuration || t !== timestamp) {
          timer.stop();
          resolve();
        }
      });
    })
      .catch(err => {
        console.error(err);
      })
      .then(() => {
        setTimeout(() => {
          autoScroller -= 1;
        }, scrollListenInterval * 2);
      });
  };
})();

const router = new VueRouter({
  mode: 'hash',
  routes: [
    { path: '/', component: Home },
    { path: '/api/controller/*', component: ControllerDocument },
    { path: '/articles/*', component: ArticleDocument },
  ],
  // scrollBehavior(to, from, savedPosition) {
  //   if (to.hash) {
  //     setAnchor(to.hash, true);
  //     return {
  //       selector: to.hash,
  //       offset: { x: 0, y: 100 },
  //     };
  //   }
  //   if (savedPosition) {
  //     return savedPosition;
  //   }
  //   return { x: 0, y: 0 };
  // },
});

router.afterEach((to, from) => {
  setTimeout(() => {
    if (to.hash) {
      setAnchor(decodeURIComponent(to.hash).slice(1), true);
    } else {
      clearAnchor();
    }
  }, scrollListenInterval);
  if (autoAnchorer === 0) {
    setTimeout(() => {
      if (to.hash) {
        scrollToElement(decodeURIComponent(to.hash).slice(1), true);
      } else {
        scrollToElement('body');
      }
    }, scrollListenInterval);
  }
});

window.addEventListener(
  'scroll',
  throttle(() => {
    if (autoScroller > 0) {
      return;
    }
    const anchors = Array.from(
      document.querySelectorAll(
        [
          '#main h1[id]',
          '#main h2[id]',
          '#main h3[id]',
          '#main h4[id]',
          '#main h5[id]',
          '#main h6[id]',
        ].join(', '),
      ),
    )
      .map(element => ({
        element,
        top: element.getBoundingClientRect().top - anchorOffset,
      }))
      .filter(entry => entry.top <= 0);
    // console.log(autoScroller, anchors);
    autoAnchorer += 1;
    let dest = '';
    if (anchors.length > 0) {
      const id = maxBy(anchors, 'top').element.id;
      if (id) {
        dest = '#' + id;
      }
    }
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(
      navigator.userAgent,
    );
    const moved = dest !== router.history.current.hash;
    if (moved) {
      if (isMobile) {
        router.replace(dest);
      } else {
        router.push(dest);
      }
    }
    setTimeout(() => {
      autoAnchorer -= 1;
    }, scrollListenInterval);
  }, scrollListenInterval),
);

const app = new Vue({
  el: 'main',
  render: h => h(App),
  router,
});
