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
        {
          name: 'example-module-3',
          description:
            '```js\nconsole.log(\'Hello world!\');\n```\n\n```cpp\nvoid main() {\n  std::cout << "Hello world!" << std::eol;\n}\n```\n\n```go\nimport "fmt"\n\nfunc main() {\n  fmt.Println("Hello world!")\n}\n```',
          actions: [],
        },
        {
          name: 'example-module-4',
          description:
            '```js\nconsole.log(\'Hello world!\');\n```\n\n```cpp\nvoid main() {\n  std::cout << "Hello world!" << std::eol;\n}\n```\n\n```go\nimport "fmt"\n\nfunc main() {\n  fmt.Println("Hello world!")\n}\n```',
          actions: [],
        },
        {
          name: 'example-module-5',
          description:
            '```js\nconsole.log(\'Hello world!\');\n```\n\n```cpp\nvoid main() {\n  std::cout << "Hello world!" << std::eol;\n}\n```\n\n```go\nimport "fmt"\n\nfunc main() {\n  fmt.Println("Hello world!")\n}\n```',
          actions: [],
        },
        {
          name: 'example-module-6',
          description:
            '```js\nconsole.log(\'Hello world!\');\n```\n\n```cpp\nvoid main() {\n  std::cout << "Hello world!" << std::eol;\n}\n```\n\n```go\nimport "fmt"\n\nfunc main() {\n  fmt.Println("Hello world!")\n}\n```',
          actions: [],
        },
        {
          name: 'example-module-7',
          description:
            '```js\nconsole.log(\'Hello world!\');\n```\n\n```cpp\nvoid main() {\n  std::cout << "Hello world!" << std::eol;\n}\n```\n\n```go\nimport "fmt"\n\nfunc main() {\n  fmt.Println("Hello world!")\n}\n```',
          actions: [],
        },
        {
          name: 'example-module-8',
          description:
            '```js\nconsole.log(\'Hello world!\');\n```\n\n```cpp\nvoid main() {\n  std::cout << "Hello world!" << std::eol;\n}\n```\n\n```go\nimport "fmt"\n\nfunc main() {\n  fmt.Println("Hello world!")\n}\n```',
          actions: [],
        },
        {
          name: 'example-module-9',
          description:
            '```js\nconsole.log(\'Hello world!\');\n```\n\n```cpp\nvoid main() {\n  std::cout << "Hello world!" << std::eol;\n}\n```\n\n```go\nimport "fmt"\n\nfunc main() {\n  fmt.Println("Hello world!")\n}\n```',
          actions: [],
        },
        {
          name: 'example-module-10',
          description:
            '```js\nconsole.log(\'Hello world!\');\n```\n\n```cpp\nvoid main() {\n  std::cout << "Hello world!" << std::eol;\n}\n```\n\n```go\nimport "fmt"\n\nfunc main() {\n  fmt.Println("Hello world!")\n}\n```',
          actions: [],
        },
        {
          name: 'example-module-11',
          description:
            '```js\nconsole.log(\'Hello world!\');\n```\n\n```cpp\nvoid main() {\n  std::cout << "Hello world!" << std::eol;\n}\n```\n\n```go\nimport "fmt"\n\nfunc main() {\n  fmt.Println("Hello world!")\n}\n```',
          actions: [],
        },
        {
          name: 'example-module-12',
          description:
            '```js\nconsole.log(\'Hello world!\');\n```\n\n```cpp\nvoid main() {\n  std::cout << "Hello world!" << std::eol;\n}\n```\n\n```go\nimport "fmt"\n\nfunc main() {\n  fmt.Println("Hello world!")\n}\n```',
          actions: [],
        },
        {
          name: 'example-module-13',
          description:
            '```js\nconsole.log(\'Hello world!\');\n```\n\n```cpp\nvoid main() {\n  std::cout << "Hello world!" << std::eol;\n}\n```\n\n```go\nimport "fmt"\n\nfunc main() {\n  fmt.Println("Hello world!")\n}\n```',
          actions: [],
        },
      ],
      docs: [
        {
          prefix: '',
          list: [
            {
              link: '/articles/test.md',
              title: '测试文章',
              content: [
                '测试文章 1. 第一节 1.1. 第一小节 2. 第二节 2.1. 第一小节',
              ],
              markdown:
                '# 测试文章\n\n- [测试文章](#测试文章)\n  - [1. 第一节](#1-第一节)\n    - [1.1. 第一小节](#11-第一小节)\n  - [2. 第二节](#2-第二节)\n    - [2.1. 第一小节](#21-第一小节)\n\n## 1. 第一节\n\nLorem ipsum dolor, **sit amet** _consectetur_ `adipisicing` elit. Corrupti, natus eum. Excepturi fuga quia autem esse eaque? Sunt ad atque neque iusto qui omnis voluptas eius cupiditate iste. Eveniet, consequatur?\n\n| a       |     b      | c      |       d |\n| ------- | :--------: | :----- | ------: |\n| apple   |   black    | city   |    draw |\n| abandon |    blue    | cyber  |   drink |\n| ahead   | basketball | crisis |    dark |\n| asleep  |    bad     | clamp  | dismiss |\n\n### 1.1. 第一小节\n\nLorem ipsum dolor, **sit amet** _consectetur_ `adipisicing` elit. Corrupti, natus eum. Excepturi fuga quia autem esse eaque? Sunt ad atque neque iusto qui omnis voluptas eius cupiditate iste. Eveniet, consequatur?\n\n> Lorem ipsum dolor, **sit amet** _consectetur_ `adipisicing` elit. Corrupti, natus eum. Excepturi fuga quia autem esse eaque? Sunt ad atque neque iusto qui omnis voluptas eius cupiditate iste. Eveniet, consequatur?\n\nLorem ipsum dolor, **sit amet** _consectetur_ `adipisicing` elit. Corrupti, natus eum. Excepturi fuga quia autem esse eaque? Sunt ad atque neque iusto qui omnis voluptas eius cupiditate iste. Eveniet, consequatur?\n\n## 2. 第二节\n\nLorem ipsum dolor, **sit amet** _consectetur_ `adipisicing` elit. Corrupti, natus eum. Excepturi fuga quia autem esse eaque? Sunt ad atque neque iusto qui omnis voluptas eius cupiditate iste. Eveniet, consequatur?\n\n| a       |     b      | c      |       d |\n| ------- | :--------: | :----- | ------: |\n| apple   |   black    | city   |    draw |\n| abandon |    blue    | cyber  |   drink |\n| ahead   | basketball | crisis |    dark |\n| asleep  |    bad     | clamp  | dismiss |\n\n### 2.1. 第一小节\n\nLorem ipsum dolor, **sit amet** _consectetur_ `adipisicing` elit. Corrupti, natus eum. Excepturi fuga quia autem esse eaque? Sunt ad atque neque iusto qui omnis voluptas eius cupiditate iste. Eveniet, consequatur?\n\n> Lorem ipsum dolor, **sit amet** _consectetur_ `adipisicing` elit. Corrupti, natus eum. Excepturi fuga quia autem esse eaque? Sunt ad atque neque iusto qui omnis voluptas eius cupiditate iste. Eveniet, consequatur?\n\nLorem ipsum dolor, **sit amet** _consectetur_ `adipisicing` elit. Corrupti, natus eum. Excepturi fuga quia autem esse eaque? Sunt ad atque neque iusto qui omnis voluptas eius cupiditate iste. Eveniet, consequatur?\n',
              children: [
                {
                  link: '/articles/test.md#1-第一节',
                  title: '1. 第一节',
                  content: [
                    'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti, natus eum. Excepturi fuga quia autem esse eaque? Sunt ad atque neque iusto qui omnis voluptas eius cupiditate iste. Eveniet, consequatur?',
                    'a b c d apple black city draw abandon blue cyber drink ahead basketball crisis dark asleep bad clamp dismiss',
                    '1.1. 第一小节',
                    'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti, natus eum. Excepturi fuga quia autem esse eaque? Sunt ad atque neque iusto qui omnis voluptas eius cupiditate iste. Eveniet, consequatur?',
                    'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti, natus eum. Excepturi fuga quia autem esse eaque? Sunt ad atque neque iusto qui omnis voluptas eius cupiditate iste. Eveniet, consequatur?',
                    'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti, natus eum. Excepturi fuga quia autem esse eaque? Sunt ad atque neque iusto qui omnis voluptas eius cupiditate iste. Eveniet, consequatur?',
                  ],
                },
                {
                  link: '/articles/test.md#2-第二节',
                  title: '2. 第二节',
                  content: [
                    'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti, natus eum. Excepturi fuga quia autem esse eaque? Sunt ad atque neque iusto qui omnis voluptas eius cupiditate iste. Eveniet, consequatur?',
                    'a b c d apple black city draw abandon blue cyber drink ahead basketball crisis dark asleep bad clamp dismiss',
                    '2.1. 第一小节',
                    'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti, natus eum. Excepturi fuga quia autem esse eaque? Sunt ad atque neque iusto qui omnis voluptas eius cupiditate iste. Eveniet, consequatur?',
                    'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti, natus eum. Excepturi fuga quia autem esse eaque? Sunt ad atque neque iusto qui omnis voluptas eius cupiditate iste. Eveniet, consequatur?',
                    'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti, natus eum. Excepturi fuga quia autem esse eaque? Sunt ad atque neque iusto qui omnis voluptas eius cupiditate iste. Eveniet, consequatur?',
                  ],
                },
              ],
            },
          ],
        },
        {
          prefix: 'drafts',
          list: [
            {
              link: '/articles/drafts/test.md',
              title: '测试文章',
              content: [
                '测试文章 1. 第一节 1.1. 第一小节 2. 第二节 2.1. 第一小节',
              ],
              markdown:
                '# 测试文章\n\n- [测试文章](#测试文章)\n  - [1. 第一节](#1-第一节)\n    - [1.1. 第一小节](#11-第一小节)\n  - [2. 第二节](#2-第二节)\n    - [2.1. 第一小节](#21-第一小节)\n\n## 1. 第一节\n\nLorem ipsum dolor, **sit amet** _consectetur_ `adipisicing` elit. Corrupti, natus eum. Excepturi fuga quia autem esse eaque? Sunt ad atque neque iusto qui omnis voluptas eius cupiditate iste. Eveniet, consequatur?\n\n| a       |     b      | c      |       d |\n| ------- | :--------: | :----- | ------: |\n| apple   |   black    | city   |    draw |\n| abandon |    blue    | cyber  |   drink |\n| ahead   | basketball | crisis |    dark |\n| asleep  |    bad     | clamp  | dismiss |\n\n### 1.1. 第一小节\n\nLorem ipsum dolor, **sit amet** _consectetur_ `adipisicing` elit. Corrupti, natus eum. Excepturi fuga quia autem esse eaque? Sunt ad atque neque iusto qui omnis voluptas eius cupiditate iste. Eveniet, consequatur?\n\n> Lorem ipsum dolor, **sit amet** _consectetur_ `adipisicing` elit. Corrupti, natus eum. Excepturi fuga quia autem esse eaque? Sunt ad atque neque iusto qui omnis voluptas eius cupiditate iste. Eveniet, consequatur?\n\nLorem ipsum dolor, **sit amet** _consectetur_ `adipisicing` elit. Corrupti, natus eum. Excepturi fuga quia autem esse eaque? Sunt ad atque neque iusto qui omnis voluptas eius cupiditate iste. Eveniet, consequatur?\n\n## 2. 第二节\n\nLorem ipsum dolor, **sit amet** _consectetur_ `adipisicing` elit. Corrupti, natus eum. Excepturi fuga quia autem esse eaque? Sunt ad atque neque iusto qui omnis voluptas eius cupiditate iste. Eveniet, consequatur?\n\n| a       |     b      | c      |       d |\n| ------- | :--------: | :----- | ------: |\n| apple   |   black    | city   |    draw |\n| abandon |    blue    | cyber  |   drink |\n| ahead   | basketball | crisis |    dark |\n| asleep  |    bad     | clamp  | dismiss |\n\n### 2.1. 第一小节\n\nLorem ipsum dolor, **sit amet** _consectetur_ `adipisicing` elit. Corrupti, natus eum. Excepturi fuga quia autem esse eaque? Sunt ad atque neque iusto qui omnis voluptas eius cupiditate iste. Eveniet, consequatur?\n\n> Lorem ipsum dolor, **sit amet** _consectetur_ `adipisicing` elit. Corrupti, natus eum. Excepturi fuga quia autem esse eaque? Sunt ad atque neque iusto qui omnis voluptas eius cupiditate iste. Eveniet, consequatur?\n\nLorem ipsum dolor, **sit amet** _consectetur_ `adipisicing` elit. Corrupti, natus eum. Excepturi fuga quia autem esse eaque? Sunt ad atque neque iusto qui omnis voluptas eius cupiditate iste. Eveniet, consequatur?\n',
              children: [
                {
                  link: '/articles/drafts/test.md#1-第一节',
                  title: '1. 第一节',
                  content: [
                    'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti, natus eum. Excepturi fuga quia autem esse eaque? Sunt ad atque neque iusto qui omnis voluptas eius cupiditate iste. Eveniet, consequatur?',
                    'a b c d apple black city draw abandon blue cyber drink ahead basketball crisis dark asleep bad clamp dismiss',
                    '1.1. 第一小节',
                    'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti, natus eum. Excepturi fuga quia autem esse eaque? Sunt ad atque neque iusto qui omnis voluptas eius cupiditate iste. Eveniet, consequatur?',
                    'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti, natus eum. Excepturi fuga quia autem esse eaque? Sunt ad atque neque iusto qui omnis voluptas eius cupiditate iste. Eveniet, consequatur?',
                    'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti, natus eum. Excepturi fuga quia autem esse eaque? Sunt ad atque neque iusto qui omnis voluptas eius cupiditate iste. Eveniet, consequatur?',
                  ],
                },
                {
                  link: '/articles/drafts/test.md#2-第二节',
                  title: '2. 第二节',
                  content: [
                    'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti, natus eum. Excepturi fuga quia autem esse eaque? Sunt ad atque neque iusto qui omnis voluptas eius cupiditate iste. Eveniet, consequatur?',
                    'a b c d apple black city draw abandon blue cyber drink ahead basketball crisis dark asleep bad clamp dismiss',
                    '2.1. 第一小节',
                    'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti, natus eum. Excepturi fuga quia autem esse eaque? Sunt ad atque neque iusto qui omnis voluptas eius cupiditate iste. Eveniet, consequatur?',
                    'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti, natus eum. Excepturi fuga quia autem esse eaque? Sunt ad atque neque iusto qui omnis voluptas eius cupiditate iste. Eveniet, consequatur?',
                    'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Corrupti, natus eum. Excepturi fuga quia autem esse eaque? Sunt ad atque neque iusto qui omnis voluptas eius cupiditate iste. Eveniet, consequatur?',
                  ],
                },
              ],
            },
          ],
        },
      ],
    };
  });
