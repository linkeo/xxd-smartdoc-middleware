import Koa from 'koa';

export = SmartdocMiddleware;

declare function SmartdocMiddleware(
  options: SmartdocMiddleware.MiddlewareOptions,
): Koa.Middleware;

declare namespace SmartdocMiddleware {
  export interface MiddlewareOptions {
    prefix: string;
    docsDir: string;
    spec: ApplicationSpec;
  }

  export interface CommonSpec {
    title: string;
    name: string;
    description: string;
    notes: string[];
  }

  export interface ApplicationSpec extends CommonSpec {
    type: 'application';
    address: string;
    author: string;
    contact: string;
    version: string;
    modules: ModuleSpec[];
  }

  export interface ModuleSpec extends CommonSpec {
    type: 'module';
    path: string;
    middlewares: Middleware[];
    filename: string;
    actions: ActionSpec[];
  }

  export interface ActionSpec extends CommonSpec {
    type: 'action';
    route: {
      method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD';
      path: string;
    };
    params: (Parameter | Mismatch)[];
    middlewares: Middleware[];
    filename: string;
    funcname: string;
  }

  export interface Middleware {
    name: string;
    args: string;
  }

  export interface Mismatch {
    mismatch: string;
  }

  export interface Parameter {
    type: string;
    name: string;
    description: string;
  }
}
