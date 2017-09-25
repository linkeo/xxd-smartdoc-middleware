'use strict';

/* eslint no-console: 0 */

const esprima = require('esprima');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

function parseDirectorySync(dir, entryDir) {
  // console.log('CALL', 'parseDirectorySync', dir);
  let application;
  let modules = [];
  let actions = [];

  try {
    if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) {

      const files = fs.readdirSync(dir).filter(file => /\.js$/.test(file)).map(file => path.join(dir, file));
      for (const file of files) {
        try {
          const stat = fs.existsSync(file) && fs.statSync(file);
          if (stat && stat.isDirectory()) {
            parseDirectorySync(file, entryDir || dir);
          } else if (stat && stat.isFile()) {
            const result = parseFileSync(file, entryDir || dir);
            if (result.application) {
              if (application) { throw new Error(`Expect exact one application definition, given 2 or more. (${file})`); }
              application = result.application;
            }
            Array.prototype.push.apply(modules, result.modules);
            Array.prototype.push.apply(actions, result.actions);
          }
        } catch (err) {
          console.error('Error occurred while parsing', file, err.stack);
        }
      }
    }

    if (!application) { throw new Error('Expect exact one application definition, but not given.'); }

    application.modules = modules;
    application.actions = actions;

    return application;
  } catch (err) {
    return {
      error: err.message || err.stack || err,
    };
  }
}

function parseFileSync(file, entryDir) {
  // console.log('CALL', 'parseFileSync', file);
  const data = fs.readFileSync(file, 'utf-8');
  const ast = esprima.parse(data, {attachComment: true});
  let application;
  let moduleDefinitions = new Set();
  let actionDefinitions = new Set();
  let firstModule;
  let moduleIndex = 0, actionIndex = 0;
  let filename = path.relative(entryDir, file);

  readNode(ast, [], 0);

  // console.log(require('util').inspect(ast, { depth: null, colors: true }));

  return {
    application,
    modules: Array.from(moduleDefinitions),
    actions: Array.from(actionDefinitions),
  };

  function readNode(node, moduleStack, depth) {
    // console.log('  '.repeat(depth + 1) + node.type);
    if (node.leadingComments && node.leadingComments.length) {
      for (const doc of node.leadingComments) {
        const docObject = readDoc(doc, node, moduleStack);
        if (docObject && docObject.type === 'application') {
          if (application) { throw new Error(`Expect exact one application definition, given 2 or more. (${file})`); }
          application = docObject;
        } else if (docObject && docObject.type === 'module') {
          firstModule = firstModule || docObject;
          docObject.actions = [];
          moduleStack = [].concat(moduleStack, docObject);
          moduleDefinitions.add(docObject);
          // console.log(moduleDefinitions);
        } else if (docObject && docObject.type === 'action') {
          const module = moduleStack[0] || firstModule;
          if (module) {
            module.actions = (module.actions || []).concat(docObject);
            if (module.path) {
              docObject.route.path = path.join(module.path, docObject.route.path);
            }
            // docObject.module = module;
          }
          actionDefinitions.add(docObject);
          // console.log(actionDefinitions);
        }
      }
    }

    // handle all chilren type.
    const children = Array.prototype.concat.apply([], [
      node.alternate, node.argument, node.arguments,
      node.block, node.blocks, node.body,
      node.callee, node.cases, node.consequent,
      node.declarations, node.discriminant,
      node.elements, node.expression, node.expressions,
      node.filter, node.finalizer,
      node.guard, node.guardedHandlers,
      node.handler, node.head,
      node.init,
      node.left,
      node.object,
      node.properties, node.property,
      node.right,
      node.test,
      node.update,
      node.value,
    ]).filter(node => node && node.type);
    for (const child of children) {
      readNode(child, moduleStack, depth + 1);
    }
  }


  function readDoc(comment, node, moduleStack) {
    if (comment && comment.type === 'Block' && comment.value) {
      const isDocumentComment = comment.value[0] === '*';
      const content = comment.value.trim().split('\n').map(t => t.trim().replace(/^\*\s*/, '')).join('\n');
      if (isDocumentComment) {
        if (/@application\s/.test(comment.value)) { return readApplicationDoc(content); }
        if (/@module\s/.test(comment.value)) { return readModuleDoc(content); }
        if (/@route\s/.test(comment.value)) { return readActionDoc(content); }
      }
    }
  }

  function readApplicationDoc(content) {
    const title = firstTextLine(content) || '';
    const name = findInlineSpec('application')(content)[0] || '';
    const description = findMultilineSpec('description')(content)[0] || '';
    const notes = findMultilineSpec('note')(content) || [];
    const address = findInlineSpec('address')(content)[0] || '';
    const author = findInlineSpec('author')(content)[0] || '';
    const contact = findInlineSpec('contact')(content)[0] || '';
    const version = findInlineSpec('version')(content)[0] || '';
    return {type: 'application', title, name, description, notes, address, author, contact, version};
  }

  function readModuleDoc(content) {
    const title = firstTextLine(content) || '';
    let name = findInlineSpec('module')(content)[0] || '';
    name = name ? `${name}-${hash(`${filename}:a${moduleIndex}`)}` : hash(`${filename}:a${moduleIndex}`);
    const path = findInlineSpec('path')(content)[0] || '';
    const description = findMultilineSpec('description')(content)[0] || '';
    const notes = findMultilineSpec('note')(content) || [];
    moduleIndex++;
    return {type: 'module', title, name, path, description, notes};
  }
  function readActionDoc(content) {
    const title = firstTextLine(content) || '';
    const route = findInlineSpec('route', routeParser)(content)[0];
    let name = findInlineSpec('action')(content)[0] || (route && route.method && `${route.method.toLowerCase()}:${route.path}`);
    name = name ? `${name.replace(/[^A-Za-z0-9]+/g, '-').replace(/-$/, '')}-${hash(`${filename}:a${actionIndex}`)}` : hash(`${filename}:a${actionIndex}`);
    const params = findInlineSpec('param', paramParser)(content) || [];
    const description = findMultilineSpec('description')(content)[0] || '';
    const notes = findMultilineSpec('note')(content) || [];
    actionIndex++;
    return {type: 'action', title, name, route, params, description, notes};
  }
  function firstTextLine(content) {
    return content.trim().split(/^@|\n@/)[0].split('\n')[0].trim();
  }
  function findInlineSpec(name, fn = text => text) {
    const regexp = new RegExp(`^@${name}\\s+(.+)$`, 'mg');
    return (text) => {
      let match = null, result = [];
      while ((match = regexp.exec(text)) !== null) { result.push(fn(match[1] && match[1].trim())); }
      return result;
    };
  }
  function findMultilineSpec(name, fn = text => text) {
    const regexp = new RegExp(`(?:^|\n)@${name}\\s+((?:.+)(?:\n+[^@\n].*)*)(?=$|\n+@)`, 'g');
    return (text) => {
      let match = null, result = [];
      while ((match = regexp.exec(text)) !== null) { result.push(fn(match[1] && match[1].trim())); }
      return result;
    };
  }
  function routeParser(text) {
    const pattern = /^\{(\w+)\}\s+(.+)$/;
    const matches = text.match(pattern);
    if (matches) {
      return {
        method: matches[1].toUpperCase(),
        path: matches[2].trim(),
      };
    }
    return {mismatch: text};
  }
  function paramParser(text) {
    const pattern = /^\{(.+?)\}\s+(\w+)(?:\s+(.+))?$/;
    const matches = text.match(pattern);
    if (matches) {
      return {
        type: matches[1].trim(),
        name: matches[2],
        description: matches[3] || '',
      };
    }
    return {mismatch: text};
  }
}

function hash(str) {
  const md5 = crypto.createHash('md5');
  md5.update(`${str}`);
  return md5.digest('hex').slice(0, 6);
}

module.exports = parseDirectorySync;
