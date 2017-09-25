# smartdoc-middleware

Smartdoc is an RESTful document generator according to document-style comment.

Smartdoc是一个基于文档化注释的RESTful文档生成器，同时也包括一个浏览接口的网页。

[(Poor) English version](https://github.com/linkeo/smartdoc-middleware/blob/master/README.eng.md)

### 如何工作

Smartdoc通过AST读取接口目录下所有的API文档化注释，生成一个描述接口的数据文件，然后在中间件的挂载目录上提供一个网页，用来查看文档和测试接口。

[TOC]

## 用法

### 1. 安装

```bash
npm install --save smartdoc-middleware
```

### 2. 引入中间件

例如有如下的项目结构：

```
- index.js
+ services // The directory where api functions defined in.
  - user.js
  - post.js
  - ...
```

而且，services里面的接口方法都已经写好了文档化注释。

然后就可以在Express中引用：

```js
// index.js
const app = require('express')();
const smartdoc = require('smartdoc-middleware');
const pathToServices = path.join('../services');
// ...
app.use('/doc', smartdoc(pathToServices));
// ...
app.listen(3000);
```

然后启动服务器，就可以用`http://localhost:3000/doc`访问文档页面了.

### 3. 编写文档化注释

首先需要在services目录里定义Application（任意文件都可以，但是推荐在index.js中）

```js
// services/index.js
/**
 * 示例应用
 * @application example-app
 *
 * @author linkeo
 * @version 0.0.1
 */
module.exports = {};
```

>   **注意:**  `@application [name]` 是定义Application的必须条件

然后在接口模块文件中定义模块和接口：

```js
// services/user.js

/**
 * 用户模块
 * @module user
 * @path /user
 */
module.exports = class UserService {

  /**
   * 用户登录
   *
   * @note 登陆成功时会在响应中设置cookie
   *
   * @route {post} /login
   * @param {String} account 用户的手机号或邮箱
   * @param {String} password
   * @param {String} from 登陆的位置，可以是 'app', 'web'
   * @return {Object} 用户信息
   */
  *login(req, res) {
    //...
  }
}
```

>   **注意:**  `@module [name]` 是定义Module的必须条件
>
>   **注意:**  `@route [method] [path]` 是定义Action的必须条件

解析出来的结构描述文件大致如下：

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



## 功能

- 读取RESTful风格的文档化注释
- 提供一个单页应用，用于查看和测试接口。

## Todo

- [ ] 更丰富的请求设置
- [ ] 可以提供一个沙箱环境，保存一些请求用的变量
- [ ] 可以在沙箱环境中执行接口测试代码
