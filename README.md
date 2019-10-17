# Smartdoc Middleware (For XXD) v1.x

\* It's an project specific version, maybe not suitable for other projects.

## Usage

```bash
npm i koa-mount xxd-smartdoc-middleware@^1
```

```js
const app = new Koa();
const smartdoc = require('xxd-smartdoc-middleware');
//...
const spec = require('./spec.json'); // The API specification of your web application
// const spec = require.resolve('./spec.json'); // Path to a JSON file is also acceptable
const prefix = '/docs'; // The prefix you want to serve smartdoc.
const docsDir = `${__dirname}/docs`; // The directory of markdown documents.
app.use(mount(prefix, smartdoc({ prefix, spec, docsDir })));
```

> Note: Must use koa-mount instead of koa-router, because koa-mount will strip the prefix off but koa-router wont.

## Options

- `options.prefix`: The prefix defined here will be treat as relative path of the document page from the api root.
- `options.spec`: API specification, describes your application, modules and actions.
- `options.docs`: The directory you put markdown documents, this module will parse them to generate the catalog and search index.

## API Specification

### ApplicationSpecification

| Field       | Type                  | Description                                                       |
| ----------- | --------------------- | ----------------------------------------------------------------- |
| type        | string                | Must be `"application"`                                           |
| title       | string                | Display name of the application                                   |
| name        | string                | Inner name of the application, generally the name in package.json |
| description | string                | Description of the application, **supports markdown**             |
| notes       | string[]              | Notes of the application, **supports markdown**                   |
| address     | string                | The url of the application                                        |
| contact     | string                | Contact messages of the developer.                                |
| version     | string                | Version of the application, generally the version in package.json |
| modules     | ModuleSpecification[] | Modules in the application                                        |

### ModuleSpecification

| Field       | Type                      | Description                                                  |
| ----------- | ------------------------- | ------------------------------------------------------------ |
| type        | string                    | Must be `"module"`                                           |
| title       | string                    | Display name of the module                                   |
| name        | string                    | Inner name of the module, generally the name in package.json |
| description | string                    | Description of the module, **supports markdown**             |
| notes       | string[]                  | Notes of the module, **supports markdown**                   |
| path        | string                    | The path prefix of the module                                |
| middlewares | MiddlewareSpecification[] | Middlewares applied to every actions of the module           |
| filename    | string                    | Filename of the module                                       |
| actions     | ActionSpecification[]     | Actions of the module                                        |

> Note:
> According to the implementation of XXD:
>
> - Path of module spec doesn't affect path of actions, but must be prefix of those paths.

### ActionSpecification

| Field        | Type                      | Description                                                                                                |
| ------------ | ------------------------- | ---------------------------------------------------------------------------------------------------------- |
| type         | string                    | Must be `"action"`                                                                                         |
| title        | string                    | Display name of the module                                                                                 |
| name         | string                    | Inner name of the module, generally the name in package.json                                               |
| description  | string                    | Description of the module, **supports markdown**                                                           |
| notes        | string[]                  | Notes of the module, **supports markdown**                                                                 |
| route.method | string                    | Request method of the action, one of `"GET"`, `"POST"`, `"PUT"`, `"DELETE"`,`"HEAD"`,`"OPTIONS"`,`"PATCH"` |
| route.path   | string                    | Request path of the action, if module has prefix, route.path must be prefixed by that                      |
| params       | ParameterSpecification[]  | Request parameters of the action                                                                           |
| middlewares  | MiddlewareSpecification[] | Middlewares applied to the action                                                                          |
| filename     | string                    | Filename of the module                                                                                     |
| funcname     | string                    | Function name of the action                                                                                |

> Note:
> According to the implementation of XXD:
>
> - Path of module spec doesn't affect path of actions, but must be prefix of those paths.

### ParameterSpecification

| Field       | Type   | Description                                               |
| ----------- | ------ | --------------------------------------------------------- |
| type        | string | Type of the parameter                                     |
| name        | string | Name of the parameter, generally the name in package.json |
| description | string | Description of the parameter, **supports markdown**       |

> Note:
> According to the implementation of XXD:
>
> - Parameter can be transferred by route parameters, query, request body (if possible, support json, urlencoded)
> - Type `"Upload"` is representing a multipart file parameter.
> - Multipart body is only supported when an `Upload` parameter is declared in the action.
> - There will be some "mismatch parameter" if a `@param` annotation cannot be parsed correctly, these will be **ignored** in this module.

### MiddlewareSpecification

| Field | Type   | Description                                                    |
| ----- | ------ | -------------------------------------------------------------- |
| name  | string | Name of the parameter, generally the name in package.json      |
| args  | string | Arguments of the parameter, in the same format of query string |

> Note:
> According to the implementation of XXD:
>
> - Args of middlewares is a querystring.
