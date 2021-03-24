JavaScript语言没有类型，我更喜欢使用TypeScript，它本质上也是运行JavaScript的代码。

在TypeScript中使用Promise的时候，Promise.then()函数的返回值类型有时需要考虑。

我们都知道，Promise.then和Promise.catch这两个函数都是可以链式调用的，说明他们返回的类型也是一个Promise类型的对象。每一个then或catch函数调用完都返回一个Promise，然后再调用这个返回的Promise的then函数，就这样可以链式调用下去。

## 返回值类型
在TypeScript中Promise类型是有模板参数的。TypeScript中Promise如果不指定模板参数则默认为Promise<any>，而这个模板参数也不是可以随便指定的，要根据你的then函数的返回值类型判断

1. 如果then函数中回调函数的**return**返回值类型为**基本类型如object，number，string**等
则相应的then函数的返回值类型为Promise<object>, Promise<number>, Promise<string>

2. 如果then函数中回调函数的**return**返回值类型为**Promise类型的对象**，如**Promise<string>**，则相应的返回值类型也为**Promise<string>**，不是Promise<Promise<string>>

## 参数传递
在**参数传递**上也是一样类似上面的两种情况，下面再来说说then的参数传递。当我们的then函数执行完了，我们要将处理完的结果的对象传递给下一个then函数的回调函数的参数，这个对象要如何进行传递，且其类型如何确定。

**当前**then函数的回调函数的参数 是由 **上一个**then函数中的回调函数的返回值（**return**）传入的。
可以简单总结一下：上次then的return **值** 对应 下一次then的回调函数的**参数**

1. 当上一个then函数的回调函数返回值的类型为基本类型如object，number等，则该**返回值**作为下一个then函数的回调函数的**参数**的值传入。

2. 当上一个then函数的回调函数返回值的类型为Promise<T>类型，则下一个then函数的回调函数的参数的值的类型为T即**模板中指定的类型**。


## 例子
用一个示例程序来解释一下上面的废话（我觉得我解释的不清楚，下面才是正文）
————————————————
```javascript

Promise.resolve(2) // 直接初始化为resolve解决状态，resolve(2) 函数返回一个Promise<number>对象
.then(x=>{
   console.log( x ); // 输出2， 表示x类型为number且值为2，也就是上面resolve参数值(手写Promise可以知道，值就是resolve里面的值)
   return "hello world"; // 回调函数返回字符串类型，then函数返回Promise<string>
}) // then函数返回Promise<string>类型
.then(x=>{
   console.log( x ); // 输出hello world，也就是上一个then回调函数返回值(Promise<string>)，表明上一个then的返回值就是下一个then的参数
   // return 这里没有返回值
}) // then函数回调函数中没有返回值，则为Promise<void>//相当于返回了一个underfined
.then(x=>{ // 前面的then的回调函数没有返回值，所以这个x是undefined
   console.log( x ); // undefined
}) // Promise<void>
.then(()=>{ // 前面没有返回值，这里回调函数可以不加返回值
   return Promise.resolve("hello world"); // 返回一个Promise<string>类型
}) // 这里then的返回值是Promise<string>
.then(x=>{ // 虽然上面的then中回调函数返回的是Promise<string>类型但是这里x并不是Promise<string>类型而是string类型
   console.log(x); // hello world
   return Promise.resolve(2); // 返回一个Promise<number>类型对象
```


