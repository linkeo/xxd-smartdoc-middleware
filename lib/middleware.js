'use strict';

/* eslint no-console: 0 */

const Koa = require('koa');
const mount = require('koa-mount');
const serveStatic = require('koa-static');
const parse = require('./parser');
const ejs = require('ejs');
const os = require('os');
const path = require('path');
const fs = require('fs-extra');

module.exports = (srcPath, options) => {
  options = options || {};

  let spec;
  let page;
  let tempdir, specfile;

  try {
    tempdir = options.tempdir || fs.mkdtempSync(path.join(os.tmpdir(), 'smartdoc-'));
    specfile = path.join(tempdir, 'spec.json');
  } catch (err) {
    console.error('Smartdoc: Cannot get temporary directory, because', err.message);
  }
  if (tempdir) {
    try {
      if (!fs.existsSync(tempdir)) { fs.mkdirpSync(tempdir); }
      if (fs.existsSync(specfile)) {
        try {
          spec = JSON.parse(fs.readFileSync(specfile, 'utf-8'));
          console.log('Smartdoc: Read cached data from', specfile);
        } catch (err) {
          console.error('Smartdoc: Cannot read cached data, because', err.message);
        }
      }
    } catch (err) {
      console.error('Smartdoc: Error with caching', err.message);
    }
  }
  if (!spec) {
    console.log('Smartdoc: Generating smartdoc data...');
    spec = parse(srcPath);
    if (tempdir) {
      try {
        fs.writeFileSync(specfile, JSON.stringify(spec, 0, 2), 'utf-8');
        console.log('Smartdoc: Save cache data as', specfile);
      } catch (err) {
        console.error('Smartdoc: Failed to cache data, because', err.message);
      }
    }
  }
  if (options.address) {
    spec.address = options.address;
  }

  const middleware = new Koa();
  middleware.spec = spec;
  middleware.use(serveStatic(path.join(__dirname, '../public')));
  middleware.use(mount('/',  (ctx) => {
    let {url, originalUrl} = ctx;
    url = url.split('?')[0];
    originalUrl = originalUrl.split('?')[0];
    if (url.slice(-1) === '/' && originalUrl.slice(-1) !== '/') {
      originalUrl = `${originalUrl}/`;
    }
    const apiRoutePath = `${originalUrl.slice(0, -url.length)}/`;
    console.log(ctx.request);
    console.log({url, originalUrl});
    if (ctx.originalUrl !== apiRoutePath) {
      ctx.redirect(apiRoutePath);
    }
    
    if (!page) {
      ejs.renderFile(path.join(__dirname, '../views/index.ejs'), {spec, options, apiRoutePath}, (err, str) => {
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

  return middleware;
};
