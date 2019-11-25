import marked from 'marked';
import dompurify from 'dompurify';
import mermaid from 'mermaid';
import Prism from 'prismjs';
import 'prismjs/components/prism-markup-templating';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-ejs';
import 'prismjs/components/prism-git';
import 'prismjs/components/prism-handlebars';
import 'prismjs/components/prism-http';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-jsonp';
import 'prismjs/components/prism-less';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-nginx';
import 'prismjs/components/prism-regex';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-yaml';

const temp = document.createElement('div');

Prism.languages.json = Prism.languages.json5 || Prism.languages.json;

const options = {
  highlight: (code, lang, callback) => {
    try {
      if (lang === 'mermaid') {
        let result;
        const t = Date.now() % 1000000;
        const r = Math.round(Math.random() * 10000) % 10000;
        mermaid.render(`mermaid_${t}${r}`, code, _result => {
          console.log('render');
          result = _result;
          if (typeof callback === 'function') {
            callback(null, result);
          }
        });
        console.log('next', result.slice(0, 100), result.slice(-100));
        return result;
      } else {
        const grammar = lang ? Prism.languages[lang] : null;
        if (grammar) {
          const result = Prism.highlight(code, grammar, lang);
          if (typeof callback === 'function') {
            callback(null, result);
          }
          return result;
        }
      }
    } catch (err) {
      console.error(err);
    }
    if (typeof callback === 'function') {
      callback(null, code);
    }
    return code;
  },
};

export const addLanguageTag = html => {
  temp.innerHTML = html;
  temp.querySelectorAll('pre > code[class*=language-]').forEach(code => {
    const langClass = code.className
      .trim()
      .split(/\s+/g)
      .find(c => c.slice(0, 9) === 'language-');
    if (langClass === 'language-mermaid') {
      const svg = code.querySelector('svg');
      if (svg) {
        const p = document.createElement('p');
        p.appendChild(svg);
        svg.style.width = '';
        svg.style.maxWidth = '100%';
        code.parentElement.replaceWith(p);
      }
    } else if (langClass) {
      const lang = langClass.slice(9).toUpperCase();
      code.parentElement.dataset.lang = lang;
    }
  });
  return temp.innerHTML;
};

export const sanitize = html =>
  dompurify.sanitize(html, {
    ALLOWED_TAGS: [
      ...['a', 'b', 'i', 'em', 'strong', 'big'],
      ...['small', 'br', 'caption', 'span', 'code'],
    ],
    ADD_ATTR: ['data-lang'],
  });

export const compileDesc = desc => addLanguageTag(marked(desc, options));
export const compileInlineDesc = desc => sanitize(marked(desc, options));
export const compileNote = note => addLanguageTag(marked(note, options));
export const compileMarkdown = markdown =>
  addLanguageTag(marked(markdown, options));
