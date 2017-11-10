'use strict';

const Koa = require('koa');
const mount = require('koa-mount');
const serveStatic = require('koa-static');
const parse = require('./parser');
const ejs = require('ejs');
const os = require('os');
const path = require('path');
const fs = require('fs-extra');
const log = require('xxd-log').newLogger({ withTimestamp: false });

module.exports = (srcPath, options) => {
  options = options || {};

  let spec;
  let page;
  let tempdir, specfile, params;
  
  params = options.params;
  
  try {
    tempdir = options.tempdir || fs.mkdtempSync(path.join(os.tmpdir(), 'smartdoc-'));
    specfile = path.join(tempdir, 'spec.json');
  } catch (err) {
    log.error('Smartdoc: Cannot get temporary directory, because', err.message);
  }
  if (tempdir) {
    try {
      if (!fs.existsSync(tempdir)) { fs.mkdirpSync(tempdir); }
      if (fs.existsSync(specfile)) {
        try {
          spec = JSON.parse(fs.readFileSync(specfile, 'utf-8'));
          log.trace('Smartdoc: Read cached data from', specfile);
        } catch (err) {
          log.error('Smartdoc: Cannot read cached data, because', err.message);
        }
      }
    } catch (err) {
      log.error('Smartdoc: Error with caching', err.message);
    }
  }
  if (!spec) {
    log.trace('Smartdoc: Generating smartdoc data...');
    spec = parse(srcPath, undefined, { params });
    if (tempdir) {
      try {
        fs.writeFileSync(specfile, JSON.stringify(spec, 0, 2), 'utf-8');
        log.trace('Smartdoc: Save cache data as', specfile);
      } catch (err) {
        log.error('Smartdoc: Failed to cache data, because', err.message);
      }
    }
  }
  if (options.address) {
    spec.address = options.address;
  }

  const middleware = new Koa();
  middleware.spec = spec;
  middleware.use(mount('/', async (ctx, next) => {
    let { path: _path, url, originalUrl } = ctx;
    console.log(_path);
    if (_path !== '/') { return await next(); }
    url = url.split('?')[0];
    originalUrl = originalUrl.split('?')[0];
    if (url.slice(-1) === '/' && originalUrl.slice(-1) !== '/') {
      originalUrl = `${originalUrl}/`;
    }
    const apiRoutePath = `${originalUrl.slice(0, -url.length)}/`;
    if (ctx.originalUrl !== apiRoutePath) {
      ctx.redirect(apiRoutePath);
    }
    
    if (!page) {
      ejs.renderFile(path.join(__dirname, '../views/index.ejs'), { spec, options, apiRoutePath }, (err, str) => {
        if (err) {
          ctx.status = 500;
          ctx.body = `${err.stack || err}`;
          return;
        }
        page = str;
        ctx.body = page;
      });
    } else {
      ctx.body = page;
    }
  }));
  middleware.use(serveStatic(path.join(__dirname, '../dist'), {}));

  return middleware;
};
