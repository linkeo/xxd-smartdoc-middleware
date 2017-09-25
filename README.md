#smartdoc-middleware

Smartdoc is an RESTful document generator according to document-style comment.

## How it works

Smartdoc reads all API-Document comments in service folder by AST, generates a delaration data file, then serve a single-page application for browsering and testing interfaces at the mounted route.

## Usage

1. Install

```bash
npm install --save koa-smartdoc-middleware
```

### 2. Basic Usage

For example, we have an project like this:

```
- index.js
+ services // The directory where api functions defined in.
  - user.js
  - post.js
  - ...
```

And you've commented these service functions correctly. (See below)

Then, you can easily extend your app with smartdoc:

```js
// index.js
const app = require('koa')();
const mount = require('koa-mount');
const smartdoc = require('koa-smartdoc-middleware');
const pathToServices = path.join('../services');
// ...
app.use(mount('/doc', smartdoc(pathToServices)));
// ...
app.listen(3000);
```

Then, you will able to access the document page at `http://localhost:3000/doc`.

### 3. Writing API-Document Comments

First, you should declare an app like this (In any file inside the services folder, generally, services/index.js):

```js
// services/index.js
/**
 * Example Application
 * @application example-app
 *
 * @author linkeo
 * @version 0.0.1
 */
module.exports = {};
```

>   **Notice:** To declare an Application, `@application [name]` is necessary.

Then, in every service modules, declare your APIs.

```js
// services/user.js

/**
 * User Services
 * @module user
 * @path /user
 */
module.exports = class UserService {

  /**
   * User Login
   *
   * @note If success, will set cookies with response.
   *
   * @route {post} /login
   * @param {String} account Phone or email of the user
   * @param {String} password
   * @param {String} from Where the user logins, can be 'app', 'web'
   * @return {Object} An object contains user information
   */
  *login(req, res) {
    //...
  }
}
```

>   **Notice:** To declare a Module, `@module [name]` is necessary.
>
>   **Notice:** To declare an Action, `@route [method] [path]` is necessary.

Then, you will get an API declaration structure like this:

```yaml
name: example-app
title: Example Application
modules:
  - name: user-674e7e
    title: User Services
    path: /user
    actions:
      - name: post-login-768ed4
        title: User Login
        route:
          method: post
          path: /login
        params: ...
```



## Features

- Read document-style comment of RESTful interface.
- Serve a single-page application to display informations about your interfaces, e.g. method, path, params.
- Can send request to test your interface.

## Todo

- [ ] More powerful request, with custom headers, cookies, etc.
- [ ] Support Environment, a scope to store some variables.
- [ ] Custom code, will run after response received.
