const cheerio = require('cheerio');
const difference = require('lodash.difference');
const flatten = require('lodash.flatten');
const fs = require('fs');
const klaw = require('klaw');
const marked = require('marked');
const path = require('path');
const send = require('koa-send');

const dist = path.join(__dirname, '../dist/');

/**
 * @param {string} path
 * @param {'utf-8'} encoding
 * @return {Promise<string>}
 */
const readFile = (path, encoding) =>
  new Promise((resolve, reject) => {
    fs.readFile(path, encoding, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });

/** @param {Error} err */
const handleError = err => {
  console.error(err && err.stack);
};

/** @param {MiddlewareOptions} options */
module.exports = options => {
  const prefix = (options && options.prefix) || '';
  const docsDir = options && options.docsDir;
  const specDir = options && options.spec;

  let spec = {};
  let readingSpec = specDir
    ? typeof specDir === 'string'
      ? readFile(specDir, 'utf-8')
          .then(content => JSON.parse(content))
          .then(specData => {
            Object.assign(spec, specData);
          })
          .catch(handleError)
      : Promise.resolve(specDir)
    : Promise.resolve();
  let markdownDocuments = [];
  let readingArticles = docsDir
    ? readDocs(docsDir)
        .then(res => {
          markdownDocuments = res.map(group => ({
            prefix: group.prefix,
            list: group.list.map(item => ({
              link: item.title.link,
              title: item.title.title,
              content: difference(
                item.content,
                flatten([
                  item.title.title,
                  ...item.sections.map(sec => [sec.title, ...sec.content]),
                ]),
              ),
              markdown: item.markdown,
              children: item.sections.map(sec => ({
                link: sec.link,
                title: sec.title,
                content: sec.content,
              })),
            })),
          }));
        })
        .catch(handleError)
    : Promise.resolve();

  let renderingIndex;
  const renderIndex = prefix => {
    if (!renderingIndex) {
      renderingIndex = Promise.all([readingSpec, readingArticles]).then(
        async () => {
          const indexFile = path.join(dist, 'index.html');
          const indexContent = await readFile(indexFile, 'utf-8');
          const injectScript = `<script>window.serverPath=${JSON.stringify(
            prefix.replace(/\/?$/, '/'),
          )};window.getAppSpec=function(){return ${JSON.stringify({
            ...spec,
            docs: markdownDocuments,
          })};}</script>`;

          return indexContent.replace(
            '<script id="inject"></script>',
            injectScript,
          );
          // .replace(/\/server-render-path/g, prefix);
        },
      );
    }
    return renderingIndex;
  };

  /**
   * @param {KoaContext} ctx
   * @param {Function} next
   */
  const middleware = async (ctx, next) => {
    if (!dist) {
      await next();
    }
    const path = ctx.path;
    if (path === '/' && !ctx.originalUrl.endsWith('/')) {
      ctx.body = 'Trailing / is required.';
      ctx.status = 404;
      return;
    }
    if (path === '/index.html') {
      ctx.status = 404;
      return;
    }
    if (path === '/') {
      ctx.type = 'html';
      ctx.body = await renderIndex(prefix);
      return;
    }
    await send(ctx, path, { root: dist });
  };

  return middleware;
};

async function readDocs(dir) {
  const extractText = html => {
    const $ = cheerio.load(`<body>${html || ''}</body>`);
    return $('body')
      .children()
      .get()
      .map(e =>
        $(e)
          .text()
          .replace(/\s+/g, ' ')
          .trim(),
      );
  };

  const dirs = await readdirDocs(dir);
  const result = [];
  for (const prefix of Object.keys(dirs)) {
    const group = { prefix, list: [] };
    for (const file of dirs[prefix]) {
      try {
        if (!/\.(md|mdown|markdown)$/.test(file)) {
          continue;
        }
        const markdown = await readFile(file, 'utf-8');
        const html = marked(markdown);
        const headings = parseHeaders(html);
        const link = `/articles/${prefix ? `${prefix}/` : ''}${path.basename(
          file,
        )}`;
        group.list.push({
          title: {
            id: headings.title ? headings.title.id : null,
            title: headings.title ? headings.title.title : path.basename(file),
            link,
            content: headings.title ? headings.title.content : [],
          },
          sections: headings.sections.map(({ id, title, content }) => ({
            id,
            title,
            link: `${link}#${id}`,
            content,
          })),
          html,
          markdown,
          content: extractText(html),
        });
      } catch (err) {
        console.error(err.stack);
      }
    }
    if (group.list.length > 0) {
      result.push(group);
    }
  }
  return result;
}

function readdirDocs(dir) {
  return new Promise((resolve, reject) => {
    const docs = {};
    klaw(dir)
      .on('error', err => {})
      .on('data', ({ path: p, stats }) => {
        if (stats.isFile()) {
          const rel = p.replace(dir, '');
          const prefix = path.dirname(rel).replace(/^\/|\/$|^.$/g, '');
          docs[prefix] = docs[prefix] || [];
          docs[prefix].push(p);
        }
      })
      .on('end', () => resolve(docs));
  });
}

function parseHeaders(html) {
  const $ = cheerio.load(`<body>${html || ''}</body>`);
  const headings = [];
  const levels = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

  const findHeaders = lv =>
    $(levels[lv])
      .get()
      .map(item => ({
        id: $(item).attr('id') || null,
        title: $(item).text(),
        content: $(item)
          .nextUntil(levels.slice(0, lv + 1).join(','))
          .get()
          .map(e =>
            $(e)
              .text()
              .replace(/\s+/g, ' ')
              .trim(),
          ),
      }));
  for (let i = 0; i < levels.length; i++) {
    const first = findHeaders(i);
    if (first.length > 0) {
      headings.push(first);
      if (i + 1 < levels.length) {
        const second = findHeaders(i + 1);
        if (second.length > 0) {
          headings.push(second);
        }
      }
      break;
    }
  }

  if (!headings[0]) {
    return {
      title: null,
      sections: [],
    };
  }
  if (headings[0].length > 1) {
    return {
      title: headings[0][0],
      sections: headings[0].slice(1),
    };
  }
  return {
    title: headings[0][0],
    sections: headings[1] || [],
  };
}
