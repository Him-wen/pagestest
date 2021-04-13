## AST是什么


抽象语法树（`Abstract Syntax Tree`）简称 `AST`，是源代码的抽象语法结构的树状表现形式。`webpack`、`eslint` 等很多工具库的核心都是通过抽象语法书这个概念来实现对代码的检查、分析等操作。今天我为大家分享一下 JavaScript 这类解释型语言的抽象语法树的概念
我们常用的浏览器就是通过将 js 代码转化为抽象语法树来进行下一步的分析等其他操作。所以将 js 转化为抽象语法树更利于程序的分析。
首先一段代码转换成的抽象语法树是一个对象，该对象会有一个顶级的 type 属性 `Program`；第二个属性是 `body` 是一个数组。
`body` 数组中存放的每一项都是一个对象，里面包含了所有的对于该语句的描述信息
### 词法分析和语法分析
`JavaScript` 是解释型语言，一般通过 词法分析 -> 语法分析 -> 语法树，就可以开始解释执行了
词法分析：也叫`扫描`，是将字符流转换为记号流(`tokens`)，它会读取我们的代码然后按照一定的规则合成一个个的标识
比如说：`var a = 2` ，这段代码通常会被分解成 `var、a、=、2`
```javascript
[
  { type: 'Keyword', value: 'var' },
  { type: 'Identifier', value: 'a' },
  { type: 'Punctuator', value: '=' },
  { type: 'Numeric', value: '2' },
];
```
当词法分析源代码的时候，它会一个一个字符的读取代码，所以很形象地称之为扫描 - `scans`。当它遇到空格、操作符，或者特殊符号的时候，它会认为一个话已经完成了。
语法分析：也称`解析器`，将词法分析出来的数组转换成树的形式，同时验证语法。语法如果有错的话，抛出语法错误。
```javascript
{
  ...
  "type": "VariableDeclarator",
  "id": {
    "type": "Identifier",
    "name": "a"
  },
  ...
}
```
## AST 能做什么

- 编辑器的错误提示、代码格式化、代码高亮、代码自动补全；
- elint、pretiier 对代码错误或风格的检查；
- webpack 通过 babel 转译 javascript 语法；

比如说，有个函数 `function a() {}` 我想把它变成 `function b() {}`
比如说，在 `webpack` 中代码编译完成后 `require('a') --> __webapck__require__("*/**/a.js")`
下面来介绍一套工具，可以把代码转成语法树然后改变节点以及重新生成代码


## Babel编译器
Babel 是一个编译器，大多数编译器的工作过程可以分为三部分：

1. **「Parse(解析)」**：将源代码转换成更加抽象的表示方法（如**抽象语法树**）
1. **「Transform(转换)」**：对（抽象语法树）做一些特殊处理，让它符合编译器的期望
1. **「Generate(代码生成)」**：将第二步经过转换过的（抽象语法树）生成新的代码

结合上述编译过程，找到对应的 Babel 插件：

- `@babel/core`：用来解析 AST 以及将 AST 生成代码

解析 Parse（`@babel/parser`） ==> 转换 Transform（`@babel/traverse`、`@babel/types`） ==> 生成 Generate（`@babel/generator`）

1. **解析**：产物为 AST，分为词法分析和语法分析两个阶段；
1. **转换**：将获取AST并遍历它，并进行添加，更新和删除节点；
1. **生成**：获取最终的AST，并将其返回为一串代码

![](https://cdn.nlark.com/yuque/0/2021/png/2932826/1618313552203-4a832356-31ce-48f9-a7c5-42efd85a697b.png#align=left&display=inline&height=615&margin=%5Bobject%20Object%5D&originHeight=615&originWidth=1290&size=0&status=done&style=none&width=1290)
## Babel的工作原理
提到 AST 我们肯定会想到 babel，自从 Es6 开始大规模使用以来，babel 就出现了，它主要解决了就是一些浏览器不兼容 Es6 新特性的问题，其实就把 Es6 代码转换为 Es5 的代码，兼容所有浏览器，babel 转换代码其实就是用了 AST，babel 与 AST 就有着很一种特别的关系。
那么我们就在 babel 的中来使用 AST，看看 babel 是如何编译代码的（不讲源码啊）
需要用到两个工具包 **`@babel/core`**、**`@babel/preset-env`**
当我们配置 babel 的时候，不管是在 `.babelrc` 或者 `babel.config.js` 文件里面配置的都有 **`presets` **和 **`plugins` **两个配置项（还有其他配置项，这里不做介绍）
### 插件和预设的区别
```javascript
// .babelrc
{
  "presets": ["@babel/preset-env"],
  "plugins": []
}
```
当我们配置了 `presets` 中有 `@babel/preset-env`，那么 `@babel/core` 就会去找 `preset-env` 预设的插件包，它是一套
babel 核心包并不会去转换代码，核心包只提供一些核心 API，真正的代码转换工作由**插件**或者**预设**来完成，比如要转换箭头函数，会用到这个 plugin，**`@babel/plugin-transform-arrow-functions`**，当需要转换的要求增加时，我们不可能去一一配置相应的 plugin，这个时候就可以用到预设了，也就是 presets。presets 是 plugins 的集合，一个 presets 内部包含了很多 plugin。
### Babel插件的使用-——结点的转换定义
babel 的插件就是定义如何转换当前结点，所以从这里可以看出 babel 的插件能做的事情，只能转换 ast 树，而不能在作用在前序阶段（语法分析）
这里不得不提下 babel 的插件体系是怎么样的，babel 的插件分为两部分

- babel-preset-xxx
- babel-plugin-xxx


preset: 预设, preset 和 plugin 其实是一个东西，preset 定义了一堆 plugin list
这里值得一提的是，preset 的顺序是倒着的，plugin 的顺序是正的，也就是说
preset: ['es2015', 'react'], 其实是先使用 react 插件再用 es2015
plugin: ['transform-react', 'transfrom-async-function'] 的顺序是正的遍历节点的时候先用 transform-react 再用 transfrom-async-function


## Babel的工作流程
Babel 会将源码转换 AST 之后，通过便利 AST 树，对树做一些修改，然后再将 AST 转成 code，即成源码。
![](https://cdn.nlark.com/yuque/0/2021/png/2932826/1618314002497-cef4b8dc-6829-4437-9312-8e360cda7c2f.png#align=left&display=inline&height=326&margin=%5Bobject%20Object%5D&originHeight=326&originWidth=920&size=0&status=done&style=none&width=920)
## Babel 的前序工作——转换为 AST
Babel 转 AST 树的过程涉及到语法的问题，转 AST 树一定有对就的语法，如果在解析过程中，出现了不符合 Babel 语法的代码，就会报错，Babel 转 AST 的解析过程在 Babylon 中完成
解析成 AST 树使用 babylon.parse 方法
例子：
```javascript
import babylon from 'babylon';
 
let code = `
     let a = 1, b = 2;
     function sum(a, b){
          return a + b;
     }
 
    sum(a, b);
`;
 
let ast = babylon.parse(code);
console.log(ast);
```
AST结构如下：
```javascript
{
  "type": "Program",
  "body": [
    {
      "type": "VariableDeclaration",
      "declarations": [
        {
          "type": "VariableDeclarator",
          "id": {
            "type": "Identifier",
            "name": "a"
          },
          "init": {
            "type": "Literal",
            "value": 1,
            "raw": "1"
          }
        },
        {
          "type": "VariableDeclarator",
          "id": {
            "type": "Identifier",
            "name": "b"
          },
          "init": {
            "type": "Literal",
            "value": 2,
            "raw": "2"
          }
        }
      ],
      "kind": "let"
    },
    {
      "type": "FunctionDeclaration",
      "id": {
        "type": "Identifier",
        "name": "sum"
      },
      "params": [
        {
          "type": "Identifier",
          "name": "a"
        },
        {
          "type": "Identifier",
          "name": "b"
        }
      ],
      "body": {
        "type": "BlockStatement",
        "body": [
          {
            "type": "ReturnStatement",
            "argument": {
              "type": "BinaryExpression",
              "operator": "+",
              "left": {
                "type": "Identifier",
                "name": "a"
              },
              "right": {
                "type": "Identifier",
                "name": "b"
              }
            }
          }
        ]
      },
      "generator": false,
      "expression": false,
      "async": false
    },
    {
      "type": "ExpressionStatement",
      "expression": {
        "type": "CallExpression",
        "callee": {
          "type": "Identifier",
          "name": "sum"
        },
        "arguments": [
          {
            "type": "Identifier",
            "name": "a"
          },
          {
            "type": "Identifier",
            "name": "b"
          }
        ]
      }
    }
  ],
  "sourceType": "script"
}
```
示例如图：
![](https://cdn.nlark.com/yuque/0/2021/png/2932826/1618314178605-842f9259-2c0c-445a-a8e8-e8b2ce94e6ca.png#align=left&display=inline&height=723&margin=%5Bobject%20Object%5D&originHeight=723&originWidth=989&size=0&status=done&style=none&width=989)
### 关于 AST 树的详细定义 Babel 有文档
[https://github.com/babel/babylon/blob/master/ast/spec.md](https://github.com/babel/babylon/blob/master/ast/spec.md)
## Babel 的中序工作——Babel-traverse、遍历 AST 树，插件体系

- **遍历的方法**
一旦按照 AST 中的定义，解析成一颗 AST 树之后，接下来的工作就是遍历树，并且在遍历的过程中进行转换

Babel 负责遍历工作的是 Babel-traverse 包，使用方法
```javascript
import traverse from "babel-traverse";
 
traverse(ast, {
  enter(path) {//有属性和方法
    if (
      path.node.type === "Identifier" &&//当前节点的类型
      path.node.name === "n"
    ) {
      path.node.name = "x";
    }
  }
});
```
遍历结点让我们可以获取到我们想要操作的结点的可能，在遍历一个节点时，存在 **enter **和 **exit **两个时刻，一个是进入结点时，这个时候节点的子节点还没触达，遍历子节点完成的时刻，会离开该节点，所以会有 exit 方法触发
访问节点，可以使用的参数是 **path **参数，path 这个参数并不直接等同于节点，path 的属性有几个重要的组成，如下

![](https://cdn.nlark.com/yuque/0/2021/png/2932826/1618314321125-7d73326c-be04-457a-9adc-4e9cc4f5aa95.png#align=left&display=inline&height=884&margin=%5Bobject%20Object%5D&originHeight=884&originWidth=899&size=0&status=done&style=none&width=899)
### 转换例子
比如说一段代码 **`function getUser() {}`**，我们把函数名字更改为 **`hello`**，看代码流程
看以下代码，简单说明 `AST` 遍历流程
#### 转为AST
```javascript
const esprima = require('esprima');
const estraverse = require('estraverse');
const code = `function getUser() {}`;
// 生成 AST
const ast = esprima.parseScript(code);//前序阶段
// 转换 AST，只会遍历 type 属性
// traverse 方法中有进入和离开两个钩子函数
estraverse.traverse(ast, {
  enter(node) {
    console.log('enter -> node.type', node.type);
  },
  leave(node) {
    console.log('leave -> node.type', node.type);
  },
});
```
输出结果如下：
![](https://cdn.nlark.com/yuque/0/2021/jpeg/2932826/1618314711024-5681bf3d-6a56-4dc9-904b-0e0162d88ba7.jpeg#align=left&display=inline&height=185&margin=%5Bobject%20Object%5D&originHeight=185&originWidth=374&size=0&status=done&style=none&width=374)
由此可以得到 AST 遍历的流程是深度优先，遍历过程如下：
![](https://cdn.nlark.com/yuque/0/2021/jpeg/2932826/1618314711027-f4d9b390-524c-4119-9a31-57f0bb1ac021.jpeg#align=left&display=inline&height=577&margin=%5Bobject%20Object%5D&originHeight=577&originWidth=511&size=0&status=done&style=none&width=511)
#### 转换函数名字
此时我们发现函数的名字在 `type` 为 `Identifier` 的时候就是该函数的名字，我们就可以直接修改它便可实现一个更改函数名字的 `AST` 工具
![](https://cdn.nlark.com/yuque/0/2021/jpeg/2932826/1618314802010-4d70a356-cf70-4295-8ae0-70808a96b5bd.jpeg#align=left&display=inline&height=510&margin=%5Bobject%20Object%5D&originHeight=510&originWidth=505&size=0&status=done&style=none&width=505)
```javascript
// 转换树
estraverse.traverse(ast, {
  // 进入离开修改都是可以的
  enter(node) {
    console.log('enter -> node.type', node.type);
    if (node.type === 'Identifier') {
      node.name = 'hello';
    }
  },
  leave(node) {
    console.log('leave -> node.type', node.type);
  },
});
// 生成新的代码
const result = escodegen.generate(ast);
console.log(result);
// function hello() {}
```
#### AST转为源代码
如上


### 另外举一个例子
访问者会以`深度优先`的顺序, 或者说递归地对 AST 进行遍历，其调用顺序如下图所示:
```javascript
function hello(v) {
  console.log('hello' + v + '!')
}
```
AST访问顺序：![](https://cdn.nlark.com/yuque/0/2021/webp/2932826/1618314619228-9c713648-3ad1-48c1-8259-a4f4e54eaad4.webp#align=left&display=inline&height=862&margin=%5Bobject%20Object%5D&originHeight=862&originWidth=807&size=0&status=done&style=none&width=807)
## Babel 的后序工作——Babel-generator、AST 树转换成源码
Babel-generator 的工作就是将一颗 ast 树转回来，具体操作如下
```javascript
import generator from "babel-generator";
 
let code = generator(ast);
 
```
参考资料：
[https://juejin.cn/post/6844903956905197576#heading-0](https://juejin.cn/post/6844903956905197576#heading-0)
[https://chengyuming.cn/views/webpack/AST.html#babel%E6%8F%92%E4%BB%B6%E7%9A%84%E4%BD%BF%E7%94%A8](https://chengyuming.cn/views/webpack/AST.html#babel-%E6%8F%92%E4%BB%B6%E7%9A%84%E4%BD%BF%E7%94%A8)
[https://zhuanlan.zhihu.com/p/258933494?utm_source=wechat_session](https://zhuanlan.zhihu.com/p/258933494?utm_source=wechat_session)
[http://www.alloyteam.com/2017/04/analysis-of-babel-babel-overview/#prettyPhoto](http://www.alloyteam.com/2017/04/analysis-of-babel-babel-overview/#prettyPhoto)
