生成器(Generator)是 ES6 中的新语法，相对于之前的异步语法，上手的难度还是比较大的。因此这里我们先来好好熟悉一下 Generator 语法。
## 生成器执行流程
上面是生成器函数？
生成器是一个带 * **`星号`**的"函数"(注意：它并不是真正的函数)，可以通过**`yield`**关键字`暂停执行`和`恢复执行`的
举个例子:
```javascript
function* gen() {
  console.log("enter");
  let a = yield 1;
  let b = yield (function () {return 2})();
  return 3;
}
var g = gen() // 阻塞住，不会执行任何语句
console.log(typeof g)  // object  看到了吗？不是"function"
console.log(g.next())  
console.log(g.next())  
console.log(g.next())  
console.log(g.next()) 
// enter
// { value: 1, done: false }
// { value: 2, done: false }
// { value: 3, done: true }
// { value: undefined, done: true }
```


由此可以看到，生成器的执行有这样几个**关键点**:

1. 调用 gen() 后，首先执行 **Generator** 函数，获取遍历器对象,程序会阻塞住，不会执行任何语句。
1. 调用 g.next() 后，程序继续执行，直到遇到 yield 程序暂停。
1. next 方法返回一个对象， 有两个属性: **`value`**** **和 **`done`**。**value **为`当前 yield 后面的结果`，**done **表示`是否执行完`，遇到了**`return` **后，`done` 会由`false`变为`true`。分阶段执行 **Generator **函数。每次调用 next 方法，会返回一个对象，表示当前阶段的信息（ value 属性和 done 属性）。value 属性是 yield 语句**后面表达式的值**，表示当前阶段的值；done 属性是一个布尔值，表示 Generator 函数是否执行完毕
1. g.next()里面可以带**参数**,带参数的话就是是给Generator 函数体内输入数据
```javascript
function* gen(x){
  var y = yield x + 2;
  return y;
}

var g = gen(1);
g.next() // { value: 3, done: false }
g.next(2) // { value: 2, done: true }
```
上面代码中，第一个 next 方法的 value 属性，返回表达式 x + 2 的值（3）。第二个 next 方法带有参数2，这个参数可以传入 Generator 函数，作为上个阶段异步任务的返回结果，被函数体内的**变量 y **接收。因此，这一步的 value 属性，返回的就是2（变量 y 的值）。
## yield*
当一个生成器要调用另一个生成器时，使用 yield* 就变得十分方便。比如下面的例子:
```
function* gen1() {
    yield 1;
    yield 4;
}
function* gen2() {
    yield 2;
    yield 3;
}
```

我们想要按照`1234`的顺序执行，如何来做呢？
在 `gen1` 中，修改如下:
```
function* gen1() {
    yield 1;
    yield* gen2();
    yield 4;
}
```


这样修改之后，之后依次调用`next`即可。
## 生成器实现机制——协程
可能你会比较好奇，生成器究竟是如何让函数暂停, 又会如何恢复的呢？接下来我们就来对其中的执行机制——`协程`一探究竟。
### 什么是协程？
协程是一种比线程更加轻量级的存在，协程处在线程的环境中，`一个线程可以存在多个协程`，可以将协程理解为线程中的一个个任务。不像进程和线程，协程并不受操作系统的管理，而是被具体的应用程序代码所控制。
### [#](https://sanyuan0704.top/my_blog/blogs/javascript/js-async/009.html#%E5%8D%8F%E7%A8%8B%E7%9A%84%E8%BF%90%E4%BD%9C%E8%BF%87%E7%A8%8B)协程的运作过程
那你可能要问了，JS 不是单线程执行的吗，开这么多协程难道可以一起执行吗？
答案是：并不能。一个线程一次只能执行一个协程。比如当前执行 A 协程，另外还有一个 B 协程，如果想要执行 B 的任务，就必须在 A 协程中将`JS 线程的控制权转交给 B协程`，那么现在 B 执行，A 就相当于处于暂停的状态。
举个具体的例子:
```javascript
function* A() {
  console.log("我是A");
  yield B(); // A停住，在这里转交线程执行权给B
  console.log("结束了");
}
function B() {
  console.log("我是B");
  return 100;// 返回，并且将线程执行权还给A
}
let gen = A();
gen.next();
gen.next();
// 我是A
// 我是B
// 结束了
```


在这个过程中，A 将执行权交给 B，也就是 `A 启动 B`，我们也称 A 是 B 的**父协程**。因此 B 当中最后`return 100`其实是将 100 传给了父协程。
需要强调的是，对于协程来说，它并不受操作系统的控制，完全由**用户自定义切换**，因此并没有进程/线程`上下文切换`的开销，这是`高性能`的重要原因。
OK, 原理就说到这里。可能你还会有疑问: 这个生成器不就暂停-恢复、暂停-恢复这样执行的吗？它和异步有什么关系？而且，每次执行都要调用next，能不能让它一次性执行完毕呢？下一节我们就来仔细拆解这些问题。
参考资料:[博客](https://sanyuan0704.top/my_blog/blogs/javascript/js-async/010.html#promise-%E7%89%88%E6%9C%AC) [阮一峰](http://www.ruanyifeng.com/blog/2015/04/generator.html)
### Generator 函数的用法
下面看看如何使用 Generator 函数，执行一个真实的异步任务。
```javascript
var fetch = require('node-fetch');
function* gen(){
  var url = 'https://api.github.com/users/github';
  var result = yield fetch(url);
  console.log(result.bio);
}
```
上面代码中，Generator 函数封装了一个异步操作，该操作先读取一个远程接口，然后从 JSON 格式的数据解析信息。就像前面说过的，这段代码非常像同步操作，除了加上了 yield 命令。
执行这段代码的方法如下。
```javascript
var g = gen();
var result = g.next();
result.value.then(function(data){//Fetch 模块返回的是一个 Promise 对象
  return data.json();
}).then(function(data){//将data.json转为data传递
  g.next(data);//将执行权从fetch(url)还给gen函数，并赋值给result
});
```
上面代码中，首先执行 Generator 函数，获取遍历器对象，然后**使用 next 方法**（第二行），执行异步任务的第一阶段。由于 Fetch 模块返回的是一个 Promise 对象，因此要用 then 方法调用下一个next 方法。在then方法中将执行权从**fetch(url)**还给**gen**函数，并赋值给**result，再继续往下执行**
可以看到，虽然 Generator 函数将异步操作表示得很简洁，但是流程管理却不方便（即何时执行第一阶段、何时执行第二阶段）。本系列的后面部分，就将介绍如何自动化异步任务的流程管理。

参考**Promise **及**async await**
