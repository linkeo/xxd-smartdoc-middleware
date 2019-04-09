const g = g || global;

g.serverPath = g.serverPath || location.pathname;
g.getAppSpec =
  g.getAppSpec ||
  (() => {
    return {
      type: 'application',
      title: '',
      name: 'xxd-backend',
      description: 'RESTful API service for xuanxiaodi.com web+app',
      notes: [],
      address: '',
      author: 'linkang <linkang@innobuddy.com>',
      contact: '',
      version: '2.51.0',
      modules: [
        {
          name: 'example-module-1',
          description:
            '```js\nconsole.log(\'Hello world!\');\n```\n\n```cpp\nvoid main() {\n  std::cout << "Hello world!" << std::eol;\n}\n```\n\n```go\nimport "fmt"\n\nfunc main() {\n  fmt.Println("Hello world!")\n}\n```',
          actions: [
            {
              name: 'example-action-1',
              route: {
                method: 'get',
                path: '/example/1',
              },
              params: [
                { type: 'string', name: 'a' },
                { type: 'string', name: 'b' },
              ],
            },
            {
              name: 'example-action-2',
              route: {
                method: 'post',
                path: '/example/:a',
              },
              params: [
                { type: 'string', name: 'a' },
                { type: 'string', name: 'b' },
              ],
            },
            {
              name: 'example-action-3',
              route: {
                method: 'post',
                path: '/example/3',
              },
              params: [
                { type: 'string', name: 'a' },
                { type: 'string', name: 'b' },
                { type: 'Upload', name: 'f' },
              ],
            },
            {
              name: 'example-action-4',
              route: {
                method: 'get',
                path: '/example/4',
              },
              params: [],
            },
            {
              name: 'example-action-5',
              route: {
                method: 'get',
                path: '/example/5',
              },
              params: [],
            },
          ],
        },
        {
          name: 'example-module-2',
          description:
            '```js\nconsole.log(\'Hello world!\');\n```\n\n```cpp\nvoid main() {\n  std::cout << "Hello world!" << std::eol;\n}\n```\n\n```go\nimport "fmt"\n\nfunc main() {\n  fmt.Println("Hello world!")\n}\n```',
          actions: [
            {
              name: 'example-action-1',
              route: {
                method: 'get',
                path: '/example/1',
              },
              params: [],
            },
            {
              name: 'example-action-2',
              route: {
                method: 'get',
                path: '/example/2',
              },
              params: [],
            },
            {
              name: 'example-action-3',
              route: {
                method: 'get',
                path: '/example/3',
              },
              params: [],
            },
            {
              name: 'example-action-4',
              route: {
                method: 'get',
                path: '/example/4',
              },
              params: [],
            },
            {
              name: 'example-action-5',
              route: {
                method: 'get',
                path: '/example/5',
              },
              params: [],
            },
          ],
        },
      ],
      docs: [],
    };
  });
