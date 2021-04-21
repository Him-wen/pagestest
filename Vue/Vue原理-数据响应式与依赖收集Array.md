# 使Array型数据可观测
getter与Object同理
**setter**
要想让Array型数据发生变化，那必然是操作了Array，而JS中提供的操作数组的方法就那么几种，我们可以把这些方法都重写一遍，在不改变原有功能的前提下，我们为其新增一些其他功能
## 数组方法拦截器
在Vue中创建了一个数组方法拦截器，它拦截在数组实例与Array.prototype之间，在拦截器内重写了操作数组的一些方法，当数组实例使用操作数组方法时，
其实使用的是拦截器中重写的方法，而不再使用Array.prototype上的原生方法
![image](https://user-images.githubusercontent.com/24501320/115499359-e3c98000-a2a1-11eb-941a-552833952d87.png)
经过整理，Array原型中可以改变数组自身内容的方法有7个，分别是：**push,pop,shift,unshift,splice,sort,reverse**。那么源码中的拦截器代码如下：
```jaavscript
// 源码位置：/src/core/observer/array.js

const arrayProto = Array.prototype
// 创建一个对象作为拦截器
export const arrayMethods = Object.create(arrayProto)

// 改变数组自身内容的7个方法
const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  const original = arrayProto[method]      // 缓存原生方法
  Object.defineProperty(arrayMethods, method, {
    enumerable: false,
    configurable: true,
    writable: true,
    value:function mutator(...args){
      const result = original.apply(this, args)
      return result
    }
  })
})
```
在上面的代码中，首先创建了**arrayMethods**对象，Create()继承自Array原型的空对象，接着在**arrayMethods**上使用object.defineProperty方法将那些可以改变数组自身的7个方法遍历逐个进行封装。
最后，当我们使用push方法的时候，其实用的是arrayMethods.push，而arrayMethods.push就是封装的新函数mutator，
也就是说，实标上执行的是函数mutator，而mutator函数内部执行了original函数，这个original函数就是Array.prototype上对应的原生方法。 
**那么，接下来我们就可以在mutator函数中做一些其他的事，比如说发送变化通知。**

## 使用拦截器
在上一小节的图中，我们把拦截器做好还不够，还要把它挂载到数组实例与Array.prototype之间，这样拦截器才能够生效。

其实挂载不难，我们只需把数据的__proto__属性设置为拦截器arrayMethods即可，源码实现如下：
```javascript
// 源码位置：/src/core/observer/index.js
export class Observer {
  constructor (value) {
    this.value = value
    if (Array.isArray(value)) {
      const augment = hasProto
        ? protoAugment
        : copyAugment
      augment(value, arrayMethods, arrayKeys)
    } else {
      this.walk(value)
    }
  }
}
// 能力检测：判断__proto__是否可用，因为有的浏览器不支持该属性
export const hasProto = '__proto__' in {}

const arrayKeys = Object.getOwnPropertyNames(arrayMethods)

/**
 * Augment an target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src: Object, keys: any) {
  target.__proto__ = src
}

/**
 * Augment an target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment (target: Object, src: Object, keys: Array<string>) {
  for (let i = 0, l = keys.length; i < l; i++) {
    const key = keys[i]
    def(target, key, src[key])
  }
}
```
上面代码中首先判断了浏览器是否支持**__proto__**，如果支持，则调用protoAugment函数把value.__proto__ = arrayMethods；如果不支持，则调用copyAugment函数把拦截器中重写的7个方法**循环**加入到value上。

拦截器生效以后，当数组数据再发生变化时，我们就可以在拦截器中通知变化了，也就是说现在我们就可以知道数组数据何时发生变化了，OK，以上我们就完成了对Array型数据的可观测。

# 依赖收集

数组数据的依赖也在getter中收集，而给数组数据添加getter/setter都是在Observer类中完成的，所以我们也应该在Observer类中收集依赖，源码如下：
```javascript
// 源码位置：/src/core/observer/index.js
export class Observer {
  constructor (value) {
    this.value = value
    this.dep = new Dep()    // 实例化一个依赖管理器，用来收集数组依赖
    if (Array.isArray(value)) {
      const augment = hasProto
        ? protoAugment
        : copyAugment
      augment(value, arrayMethods, arrayKeys)
    } else {
      this.walk(value)
    }
  }
}
```
其他部分可参考Object
# 深度侦测

在前文所有讲的Array型数据的变化侦测都仅仅说的是数组自身变化的侦测，比如给数组新增一个元素或删除数组中一个元素，而在Vue中，不论是Object型数据还是Array型数据所实现的数据变化侦测都是深度侦测，所谓深度侦测就是不但要侦测数据自身的变化，还要侦测数据中所有子数据的变化。举个例子：

```javascript
let arr = [
  {
    name:'NLRX'，
    age:'18'
  }
]
```
数组中包含了一个对象，如果该对象的某个属性发生了变化也应该被侦测到，这就是深度侦测。

这个实现起来比较简单，源码如下：

```javascript
export class Observer {
  value: any;
  dep: Dep;

  constructor (value: any) {
    this.value = value
    this.dep = new Dep()
    def(value, '__ob__', this)
    if (Array.isArray(value)) {
      const augment = hasProto
        ? protoAugment
        : copyAugment
      augment(value, arrayMethods, arrayKeys)
      this.observeArray(value)   // 将数组中的所有元素都转化为可被侦测的响应式
    } else {
      this.walk(value)
    }
  }

  /**
   * Observe a list of Array items.
   */
  observeArray (items: Array<any>) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i])
    }
  }
}

export function observe (value, asRootData){//将每一个元素都转化成可侦测的响应式数据
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  let ob
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else {
    ob = new Observer(value)//新建一个Observer
  }
  return ob
}
```
在上面代码中，对于Array型数据，调用了observeArray()方法，该方法内部会遍历数组中的每一个元素，然后通过调用observe函数将每一个元素都转化成可侦测的响应式数据。

而对应object数据，在上一篇文章中我们已经在**defineReactive**函数中进行了递归操作。


# 数组新增元素的侦测

对于数组中已有的元素我们已经可以将其全部转化成可侦测的响应式数据了，但是如果向数组里新增一个元素的话，我们也需要将新增的这个元素转化成可侦测的响应式数据。

我们只需拿到新增的这个元素，然后调用**observe函数**将其转化即可。我们知道，可以向数组内新增元素的方法有3个，分别是：push、unshift、splice。我们只需对这3中方法分别处理，拿到新增的元素，再将其转化即可。源码如下：

# 不足之处

前文中我们说过，对于数组变化侦测是通过拦截器实现的，也就是说只要是通过数组原型上的方法对数组进行操作就都可以侦测到，但是别忘了，我们在日常开发中，还可以通过数组的下标来操作数据，如下：
```javascript
let arr = [1,2,3]
arr[0] = 5;       // 通过数组下标修改数组中的数据
arr.length = 0    // 通过修改数组长度清空数组
```
而使用上述例子中的操作方式来修改数组是无法侦测到的。 同样，Vue也注意到了这个问题， 为了解决这一问题，Vue增加了两个全局API:Vue.set和Vue.delete，这两个API的实现原理将会在后面学习全局API的时候说到。

# 总结
首先我们分析了对于Array型数据也在getter中进行依赖收集；其次我们发现，当数组数据被访问时我们轻而易举可以知道，
但是被修改时我们却很难知道，为了解决这一问题，我们创建了数组方法拦截器，从而成功的将数组数据变的可观测。接着我们对数组的依赖收集及数据变化如何通知依赖进行了深入分析；
最后我们发现Vue不但对数组自身进行了变化侦测，还对数组中的每一个元素以及新增的元素都进行了变化侦测，我们也分析了其实现原理。
