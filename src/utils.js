import marked from 'marked';
import dompurify from 'dompurify';
import Prism from 'prismjs';
import 'prismjs/components/prism-markup-templating';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
// import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-css';
// import 'prismjs/components/prism-dart';
import 'prismjs/components/prism-ejs';
import 'prismjs/components/prism-git';
// import 'prismjs/components/prism-go';
// import 'prismjs/components/prism-graphql';
// import 'prismjs/components/prism-haml';
import 'prismjs/components/prism-handlebars';
import 'prismjs/components/prism-http';
// import 'prismjs/components/prism-ini';
// import 'prismjs/components/prism-java';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-jsonp';
// import 'prismjs/components/prism-kotlin';
import 'prismjs/components/prism-less';
// import 'prismjs/components/prism-latex';
// import 'prismjs/components/prism-lua';
// import 'prismjs/components/prism-makefile';
import 'prismjs/components/prism-markdown';
// import 'prismjs/components/prism-matlab';
import 'prismjs/components/prism-nginx';
// import 'prismjs/components/prism-perl';
// import 'prismjs/components/prism-php';
// import 'prismjs/components/prism-powershell';
// import 'prismjs/components/prism-protobuf';
// import 'prismjs/components/prism-python';
// import 'prismjs/components/prism-r';
import 'prismjs/components/prism-regex';
// import 'prismjs/components/prism-ruby';
// import 'prismjs/components/prism-rust';
// import 'prismjs/components/prism-sass';
// import 'prismjs/components/prism-scala';
// import 'prismjs/components/prism-scss';
import 'prismjs/components/prism-sql';
// import 'prismjs/components/prism-stylus';
// import 'prismjs/components/prism-swift';
// import 'prismjs/components/prism-toml';
// import 'prismjs/components/prism-vim';
// import 'prismjs/components/prism-wasm';
import 'prismjs/components/prism-yaml';

const temp = document.createElement('div');

Prism.languages.json = Prism.languages.json5 || Prism.languages.json;

const options = {
  highlight: (code, lang) => {
    try {
      const grammar = lang ? Prism.languages[lang] : null;
      if (grammar) {
        return Prism.highlight(code, grammar, lang);
      }
    } catch (err) {
      console.error(err);
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
    if (langClass) {
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
