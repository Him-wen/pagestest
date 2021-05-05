**一句话，async 函数就是 Generator 函数的语法糖。**
**yield表达式本身没有返回值**
## async 函数的优点(对比Generator)
**async 函数对 Generator 函数的改进，体现在以下三点。**
（1）**内置执行器**。 Generator 函数的执行必须靠执行器，所以才有了 co 函数库，而 async 函数自带执行器。也就是说，async 函数的执行，与普通函数一模一样，只要一行。
var result = asyncReadFile();
（2）**更好的语义**。 async 和 await，比起星号和 yield，语义更清楚了。async 表示函数里有异步操作，await 表示紧跟在后面的表达式需要等待结果。
（3）**更广的适用性**。 co 函数库约定，yield 命令后面只能是 Thunk 函数或 Promise 对象，而 async 函数的 await 命令后面，可以跟 Promise 对象和原始类型的值（数值、字符串和布尔值，但这时等同于同步操作）。
## async await用法
同 Generator 函数一样，async 函数返回一个 Promise 对象，可以使用 then 方法添加回调函数。当函数执行的时候，一旦遇到 await 就会先返回，等到触发的异步操作完成，再接着执行函数体内后面的语句。
## 1. async 和 await 在干什么
任意一个名称都是有意义的，先从字面意思来理解。**async** 是“**异步**”的简写，而 **await **可以认为是 async wait 的简写。所以应该很好理解** async 用于申明一个 function 是异步**的，而 **await 用于等待一个异步方法执行完成**。(到底等的是什么)
另外还有一个很有意思的语法规定，await 只能出现在 async 函数中。然后细心的朋友会产生一个疑问，如果 await 只能出现在 async 函数中，那这个 async 函数应该怎么调用？
如果需要通过 await 来调用一个 async 函数，那这个调用的外面必须得再包一个 async 函数，然后……进入死循环，永无出头之日……
如果 async 函数不需要 await 来调用，那 async 到底起个啥作用？

### 1.1. async 起什么作用
这个问题的关键在于，**async **函数是怎么处理它的返回值的！都是返回**Promise对象**

我们当然希望它能直接通过 **`return` **语句返回我们想要的值，但是如果真是这样，似乎就没 await 什么事了。所以，写段代码来试试，看它到底会返回什么：
看到输出就恍然大悟了——输出的是一个 Promise 对象。
```javascript
async function testAsync() {
    return "hello async";
}

const result = testAsync();
console.log(result);

//输出
c:\var\test> node --harmony_async_await .
Promise { 'hello async' }
```
所以，async 函数返回的是一个 Promise 对象。从[文档](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/async_function)中也可以得到这个信息。
async 函数（包含函数语句、函数表达式、Lambda表达式）会**返回一个 Promise 对象**，
如果在函数中 **`return`** **返回**一个直接量，async 会把这个直接量通过 `Promise.resolve()` 封装成 **Promise **对象。所以说都是对象Promise
> 补充知识点 _[2020-06-04]_
> **`Promise.resolve(x)`** 可以看作是 `new Promise(resolve => resolve(x))` 的简写，可以用于快速封装字面量对象或其他对象，将其封装成 Promise 实例。

async 函数返回的是一个 Promise 对象，所以在最外层不能用 await 获取其返回值的情况下，我们当然应该用原来的方式：`then()` 链来处理这个 Promise 对象，就像这样
```javascript
testAsync().then(v => {
    console.log(v);    // 输出 hello async
});
```
现在回过头来想下，如果 async 函数没有返回值，又该如何？很容易想到，它会返回 `Promise.resolve(undefined)`。
联想一下 Promise 的特点——无等待，所以在没有 `await` 的情况下执行 async 函数，它会立即执行，返回一个 Promise 对象，并且，绝不会阻塞后面的语句。这和普通返回 Promise 对象的函数并无二致。
那么下一个关键点就在于 await 关键字了。
### 1.2. await 到底在等啥(Promise或者常量)
一般来说，都认为 await 是在等待一个 async 函数完成。不过按[语法说明](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/await)，await 等待的是一个表达式，这个表达式的计算结果是 Promise 对象或者其它值（换句话说，就是没有特殊限定）。
因为 **async 函数返回一个 Promise 对象**，所以 await 可以用于等待一个 async 函数的返回值——这也可以说是 await 在等 async 函数，但要清楚，**它等的实际是一个返回值**。注意到 await 不仅仅用于等 Promise 对象，它可以等任意表达式的结果，所以，await 后面实际是**可以接普通函数调用或者直接量的**。所以下面这个示例完全可以正确运行
```javascript
function getSomething() {//普通函数
    return "something";
}

async function testAsync() {//async函数
    return Promise.resolve("hello async");
}

async function test() {
    const v1 = await getSomething();
    const v2 = await testAsync();
    console.log(v1, v2);
}

test();

//输出
test();
VM94:12 something hello async
Promise {<fulfilled>: undefined}
__proto__: Promise
[[PromiseState]]: "fulfilled"
[[PromiseResult]]: undefined
```
### 1.3. await 等到了要等的Promise对象，然后等待异步返回resolve或者常量
await 等到了它要等的东西，一个 Promise 对象，或者其它值，然后呢？我不得不先说，`await` 是个运算符，用于组成表达式，await 表达式的运算结果取决于它等的东西。
如果它等到的**不是**一个 Promise 对象，那 await 表达式的运算结果就是它等到的东西。(直接返回)
如果它等到的**是**一个 Promise 对象，await 就忙起来了，它会阻塞后面的代码，**等着 Promise 对象 resolve，然后得到 resolve 的值**，作为 await 表达式的运算结果。(**重点)**
> 看到上面的阻塞一词，心慌了吧……放心，这就是 await 必须用在 async 函数中的原因。async 函数调用不会造成阻塞，它内部所有的阻塞都被封装在一个 Promise 对象中异步执行。await 命令后面的 
**注意点：try...catch**
> Promise 对象，运行结果可能是 rejected，所以最好把 await 命令放在 try...catch 代码块中。
```javascript
async function myFunction() {
  try {
    await somethingThatReturnsAPromise();
  } catch (err) {
    console.log(err);
  }
}

// 另一种写法

async function myFunction() {
  await somethingThatReturnsAPromise().catch(function (err){
    console.log(err);
  });
}
```
## 2. async/await 帮我们干了啥
### 2.1. 作个简单的比较
上面已经说明了 async 会将其后的函数（函数表达式或 Lambda）的返回值封装成一个 Promise 对象，而 await 会**等待这个 Promise 完成，并将其 resolve 的结果返回出来**。返回对应的赋值
现在举例，用 **`setTimeout`**** **模拟耗时的异步操作，先来看看不用 async/await 会怎么写
```javascript
function takeLongTime() {
    return new Promise(resolve => {
        setTimeout(() => resolve("long_time_value"), 1000);
    });
}

takeLongTime().then(v => {
    console.log("got", v);
});
```
如果改用 async/await 呢，会是这样
```javascript
function takeLongTime() {
    return new Promise(resolve => {
        setTimeout(() => resolve("long_time_value"), 1000);
    });
}

async function test() {
    const v = await takeLongTime();//等待函数返回的Promise对象完成，并将resolve的结果（long_time_value）返回出来，赋值给v
    console.log(v);
}

test();
```
眼尖的同学已经发现 `takeLongTime()` 没有申明为 `async`。实际上，`takeLongTime()` 本身就是返回的 Promise 对象，加不加 `async` 结果都一样，如果没明白，请回过头再去看看上面的“async 起什么作用”。（**相当于一个意思**）
又一个疑问产生了，这两段代码，两种方式对异步调用的处理（实际就是对 Promise 对象的处理）差别并不明显，甚至使用 async/await 还需要多写一些代码，那它的优势到底在哪？
### 2.2. async/await 的优势在于处理 then 链
单一的 Promise 链并不能发现 async/await 的优势，但是，如果需要处理由多个 Promise 组成的 then 链的时候，优势就能体现出来了（很有意思，Promise 通过 then 链来解决多层回调的问题，现在又用 async/await 来进一步优化它）。
假设一个业务，分多个步骤完成，每个步骤都是异步的，而且依赖于上一个步骤的结果。我们仍然用 **`setTimeout` **来模拟异步操作：
