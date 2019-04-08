declare interface MiddlewareOptions {
  prefix: string;
  docsDir: string;
  spec: ApplicationSpec;
}

declare interface CommonSpec {
  title: string;
  name: string;
  description: string;
  notes: string[];
}

declare interface ApplicationSpec extends CommonSpec {
  type: 'application';
  address: string;
  author: string;
  contact: string;
  version: string;
  modules: ModuleSpec[];
}

declare interface ModuleSpec extends CommonSpec {
  type: 'module';
  path: string;
  middlewares: Middleware[];
  filename: string;
  actions: ActionSpec[];
}

declare interface ActionSpec extends CommonSpec {
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

declare interface Middleware {
  name: string;
  args: string;
}

declare interface Mismatch {
  mismatch: string;
}

declare interface Parameter {
  type: string;
  name: string;
  description: string;
}
