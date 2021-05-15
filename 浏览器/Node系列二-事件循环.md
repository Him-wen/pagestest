## 什么是事件循环
事件循环是 Node.js 处理非阻塞 I/O 操作的机制——尽管 JavaScript 是单线程处理的——当有可能的时候，它们会把操作转移到系统内核中去。
既然目前大多数内核都是多线程的，它们可在后台处理多种操作。当其中的一个操作完成的时候，内核通知 Node.js 将适合的回调函数添加到_轮询_队列中等待时机执行。我们在本文后面会进行详细介绍
## 事件循环机制解析
当 Node.js 启动后，它会初始化事件循环，处理已提供的输入脚本（或丢入[REPL](https://nodejs.org/api/repl.html#repl_repl)，本文不涉及到），它可能会调用一些异步的 API、调度定时器，或者调用process.nextTick()，然后开始处理事件循环。
下面的图表展示了事件循环操作顺序的简化概览。
![image.png](https://cdn.nlark.com/yuque/0/2021/png/2932826/1618841413611-8ffec597-02b9-4492-aecd-f1544aacf091.png#clientId=u81f9fb9e-79fe-4&from=paste&height=296&id=u85e7ab84&margin=%5Bobject%20Object%5D&name=image.png&originHeight=591&originWidth=1312&originalType=binary&size=47386&status=done&style=none&taskId=u1647f05e-eced-44cd-b5c4-8bfdc7001c3&width=656)
_注意：每个框被称为事件循环机制的一个阶段。_
每个阶段都有一个 **FIFO 队列**来执行回调。虽然每个阶段都是特殊的，但通常情况下，当事件循环进入给定的阶段时，它将**执行特定于该阶段的任何操作，然后执行该阶段队列中的回调**，直到队列用尽或最大回调数已执行。当该队列已用尽或达到回调限制，**事件循环将移动到下一阶段**，等等。
由于这些操作中的任何一个都可能调度_更多的_操作和由内核排列在**轮询**阶段被处理的新事件， 且在处理轮询中的事件时，轮询事件可以排队。因此，长时间运行的回调可以允许轮询阶段运行长于计时器的阈值时间。有关详细信息，请参阅[计时器](https://nodejs.org/zh-cn/docs/guides/event-loop-timers-and-nexttick/#timers)和[轮询](https://nodejs.org/zh-cn/docs/guides/event-loop-timers-and-nexttick/#poll)部分。
## 阶段概述

- **定时器timer**：本阶段执行已经被setTimeout()和setInterval()的调度回调函数。
- **待定回调**：执行延迟到下一个循环迭代的 I/O 回调。
- **idle, prepare**：仅系统内部使用。
- **轮询poll**：检索新的 I/O 事件;执行与 I/O 相关的回调（几乎所有情况下，除了关闭的回调函数，那些由计时器和setImmediate()调度的之外），其余情况 node 将在适当的时候在此阻塞。
- **检测check**：setImmediate()回调函数在这里执行。
- **关闭的回调函数**：一些关闭的回调函数，如：socket.on('close', ...)。

在每次运行的事件循环之间，Node.js 检查它是否在等待任何异步 I/O 或计时器，如果没有的话，则完全关闭。
我们重点看**timers、poll、check**这3个阶段就好，因为日常开发中的绝大部分异步任务都是在这3个阶段处理的。


### 定时器timers
计时器指定_可以执行所提供回调_的**阈值**，而不是用户希望其执行的确切时间。在指定的一段时间间隔后， 计时器回调将被尽可能早地运行。但是，操作系统调度或其它正在运行的回调可能会延迟它们。
timers 是事件循环的第一个阶段，Node 会去检查有无已过期的**timer**，
1.如果有则把它的回调**压入timer的任务队列中**等待执行（如果队列里面有可执行的定时器，然后就会一一弹出来执行，这里是直接执行了，然后在队列都清空了，  
关于微任务的处理：node11之前，执行下一个阶段之前，将多个宏任务（也就是定时器里面产生的微任务） 给清空，相当于多个宏任务对应一个微任务），到了node11之后，就直接保持了和浏览器的顺序一致，  
其中微任务有二种：一种是nexttick微任务，一种是promise产生的

2。事实上，Node 并不能保证timer在预设时间到了就会立即执行，因为Node对timer的过期检查不一定靠谱，它会受机器上其它运行程序影响，或者那个时间点主线程不空闲。
3.没有的话直接到轮询阶段


比如下面的代码，**setTimeout**()和**setImmediate**()的执行顺序是不确定的。
#### setImmediate()对比setTimeout()
setImmediate()和setTimeout()很类似，但是基于被调用的时机，他们也有不同表现。

- setImmediate()设计为一旦在当前**轮询**阶段完成， 就执行脚本。
- setTimeout()在最小阈值（ms 单位）过后运行脚本。
```javascript
setTimeout(() => {
  console.log('timeout')
}, 0)

setImmediate(() => {
  console.log('immediate')
```
但是把它们放到一个I/O回调里面，就一定是setImmediate()先执行，因为poll阶段后面就是check阶段。
优势：使用setImmediate()相对于setTimeout()的主要优势是，如果setImmediate()是在 I/O 周期内被调度的，那它将会在其中任何的定时器之前执行，跟这里存在多少个定时器无关
注意：[轮询阶段](https://nodejs.org/zh-cn/docs/guides/event-loop-timers-and-nexttick/#poll)控制何时定时器执行。
例如，假设您调度了一个在 100 毫秒后超时的定时器，然后您的脚本开始异步读取会耗费 95 毫秒的文件:
```javascript
const fs = require('fs');

function someAsyncOperation(callback) {
  // Assume this takes 95ms to complete
  fs.readFile('/path/to/file', callback);
}

const timeoutScheduled = Date.now();

setTimeout(() => {
  const delay = Date.now() - timeoutScheduled;

  console.log(`${delay}ms have passed since I was scheduled`);
}, 100);

// do someAsyncOperation which takes 95 ms to complete
someAsyncOperation(() => {
  const startCallback = Date.now();

  // do something that will take 10ms...
  while (Date.now() - startCallback < 10) {
    // do nothing
  }
});
```
当事件循环进入**轮询**阶段时，它有一个空队列（此时fs.readFile()尚未完成），因此它将等待剩下的毫秒数，直到达到最快的一个计时器阈值为止。
1.当它等待 95 毫秒过后时，fs.readFile()完成读取文件，
2.它的那个需要 10 毫秒才能完成的回调（这个是文件操作里面的函数 属于IO事件），将被添加到**轮询**队列中并执行。
3.当回调完成时，队列中不再有回调，因此事件循环机制将**查看**最快到达阈值的计时器，然后将回到**计时器timer**阶段，以执行定时器的回调。在本示例中，您将看到调度计时器到它的回调被执行之间的总延迟将为 105 毫秒。
**注意**：为了防止**轮询**阶段饿死事件循环，[libuv](https://libuv.org/)（实现 Node.js 事件循环和平台的所有异步行为的 C 函数库），在停止轮询以获得更多事件之前，还有一个硬性最大值（依赖于系统）。


### 轮询阶段
**轮询**阶段有两个重要的功能：

1. 计算应该阻塞和轮询 I/O 的时间。（**当有已超时的 timer，执行它的回调函数**）
1. 然后，处理poll**轮询**队列里的事件。

当事件循环进入**轮询poll**阶段且_没有被调度的计时器时_，将发生以下两种情况之一：

- _如果**轮询**队列**不是空的**_，事件循环将循环访问回调队列并同步执行它们，直到队列已用尽，或者达到了与系统相关的硬性限制。
- _如果**轮询**队列**是空的**_，还有两件事发生：
   - 如果脚本被setImmediate()调度，则事件循环将结束**轮询poll**阶段，并继续**检查check**阶段以执行那些被调度的脚本。
   - 如果脚本**未被**setImmediate()调度，则事件循环将**等待回调**被添加到队列中，然后立即执行。

一旦**轮询**队列为空，事件循环将检查 _已达到时间阈值的计时器_。如果一个或多个计时器已准备就绪，则事件循环将绕回计时器阶段以执行这些计时器的回调。


⚠️：**注意一个细节**，没有setImmediate()会导致event loop阻塞在poll阶段，这样之前设置的timer岂不是执行不了了？所以咧，在poll阶段event loop会有一个检查机制，检查timer队列是否为空，如果timer队列非空，event loop就开始下一轮事件循环，即重新进入到timer阶段。


### 检查阶段
此阶段允许人员在轮询阶段完成后立即执行回调。如果轮询阶段变为空闲状态，并且脚本使用setImmediate()后被排列在队列中，则事件循环可能继续到**检查**阶段而不是等待。
setImmediate()实际上是一个在事件循环的单独阶段运行的特殊计时器。它使用一个 libuv API 来安排回调在**轮询**阶段完成后执行。
通常，在执行代码时，事件循环最终会命中**轮询阶段**，在那等待传入连接、请求等。但是，如果回调已使用setImmediate()调度过，并且轮询阶段变为空闲状态，则它将结束此阶段，并继续到检查check阶段而不是继续等待轮询事件。


#### process.nextTick()对比setImmediate()
就用户而言，我们有两个类似的调用，但它们的名称令人费解。

- process.nextTick()在**同一个阶段立即**执行。
- setImmediate()在事件循环的**接下来的迭代或 'tick' 上**触发。

实质上，这两个名称应该交换，因为process.nextTick()比setImmediate()触发得更快，但这是过去遗留问题，因此不太可能改变。如果贸然进行名称交换，将破坏 npm 上的大部分软件包。每天都有更多新的模块在增加，这意味着我们要多等待每一天，则更多潜在破坏会发生。尽管这些名称使人感到困惑，但它们本身名字不会改变。
process.nextTick()会在各个事件阶段之间执行，一旦执行，要直到nextTick队列被清空，才会进入到下一个事件阶段，所以如果递归调用process.nextTick()，会导致出现I/O starving（饥饿）的问题
_我们建议开发人员在所有情况下都使用setImmediate()，因为它更容易理解。_
## 小结

- event loop 的每个阶段都有一个任务队列
- 当 event loop 到达某个阶段时，将执行该阶段的任务队列，直到队列清空或执行的回调达到系统上限后，才会转入下一个阶段
- 当所有阶段被顺序执行一次后，称 event loop 完成了一个 tick
## Node.js 与浏览器的 Event Loop 差异
回顾上一篇，浏览器环境下，microtask的任务队列是每个macrotask执行完之后执行。
![](https://cdn.nlark.com/yuque/0/2021/png/2932826/1618844212178-eb918f55-26a4-4737-9a7b-eafefb3231a8.png#clientId=u81f9fb9e-79fe-4&from=paste&height=339&id=u22a9afad&margin=%5Bobject%20Object%5D&originHeight=414&originWidth=810&originalType=url&status=done&style=none&taskId=u375d34cf-5d57-4e5a-91bf-3a3e2e40b4f&width=663)
而在Node.js中，microtask会在事件循环的各个阶段之间执行，也就是一个阶段执行完毕，就会去执行microtask队列的任务。
![image.png](https://cdn.nlark.com/yuque/0/2021/png/2932826/1618844224481-f3527ef1-966a-4e62-99a6-12ebc6cdf111.png#clientId=u81f9fb9e-79fe-4&from=paste&height=503&id=u98636ace&margin=%5Bobject%20Object%5D&name=image.png&originHeight=503&originWidth=655&originalType=binary&size=28129&status=done&style=none&taskId=u5b36b14c-164b-4181-aa36-f74bae7f10c&width=655)
参考资料：
[https://nodejs.org/zh-cn/docs/guides/event-loop-timers-and-nexttick/](https://nodejs.org/zh-cn/docs/guides/event-loop-timers-and-nexttick/)
[http://lynnelv.github.io/js-event-loop-nodejs](http://lynnelv.github.io/js-event-loop-nodejs)
