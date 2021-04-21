[vuejs部分相关的源码](https://github.com/vuejs/vue/blob/dev/src/core/index.js)

目录
[变化侦测](https://github.com/Him-wen/itblogs/blob/main/Vue/Vue%E5%8E%9F%E7%90%86-%E6%95%B0%E6%8D%AE%E5%93%8D%E5%BA%94%E5%BC%8F%E4%B8%8E%E4%BE%9D%E8%B5%96%E6%94%B6%E9%9B%86Object.md#%E8%AE%A9object%E6%95%B0%E6%8D%AE%E5%8F%98%E7%9A%84%E5%8F%AF%E8%A7%82%E6%B5%8B)  
[依赖收集](https://github.com/Him-wen/itblogs/blob/main/Vue/Vue%E5%8E%9F%E7%90%86-%E6%95%B0%E6%8D%AE%E5%93%8D%E5%BA%94%E5%BC%8F%E4%B8%8E%E4%BE%9D%E8%B5%96%E6%94%B6%E9%9B%86Object.md#%E4%BE%9D%E8%B5%96%E6%94%B6%E9%9B%86)  
[何时收集依赖](https://github.com/Him-wen/itblogs/blob/main/Vue/Vue%E5%8E%9F%E7%90%86-%E6%95%B0%E6%8D%AE%E5%93%8D%E5%BA%94%E5%BC%8F%E4%B8%8E%E4%BE%9D%E8%B5%96%E6%94%B6%E9%9B%86Object.md#%E4%BD%95%E6%97%B6%E6%94%B6%E9%9B%86%E4%BE%9D%E8%B5%96%E9%80%9A%E7%9F%A5%E4%BE%9D%E8%B5%96%E6%9B%B4%E6%96%B0-gettersetter)  
[依赖到底是谁](https://github.com/Him-wen/itblogs/blob/main/Vue/Vue%E5%8E%9F%E7%90%86-%E6%95%B0%E6%8D%AE%E5%93%8D%E5%BA%94%E5%BC%8F%E4%B8%8E%E4%BE%9D%E8%B5%96%E6%94%B6%E9%9B%86Object.md#%E4%BE%9D%E8%B5%96%E5%88%B0%E5%BA%95%E6%98%AF%E8%B0%81a)  
[简单总结一下](https://github.com/Him-wen/itblogs/blob/main/Vue/Vue%E5%8E%9F%E7%90%86-%E6%95%B0%E6%8D%AE%E5%93%8D%E5%BA%94%E5%BC%8F%E4%B8%8E%E4%BE%9D%E8%B5%96%E6%94%B6%E9%9B%86Object.md#%E7%AE%80%E5%8D%95%E6%80%BB%E7%BB%93%E4%B8%80%E4%B8%8B)  
[]()  
[]()  


# 变化侦测  
UI = render(state)
上述公式中：状态state是输入，页面UI输出，状态输入一旦变化了，页面输出也随之而变化。我们把这种特性称之为数据驱动视图。

OK，有了基本概念以后，我们再把上述公式拆成三部分：state、render()以及UI。我们知道state和UI都是用户定的，而不变的是这个render()。所以Vue就扮演了render()这个角色，当Vue发现state变化之后，经过一系列加工，最终将变化反应在UI上。

那么第一个问题来了，Vue怎么知道state变化了呢？
**数据每次的读和写**可以参考MDN：[Object.defineProperty](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)

# 让object数据变的可观测
 
 要将数据变的‘可观测’，我们就要借助前言中提到的**Object.defineProperty**方法了，在本文中，我们就使用这个方法使数据变得“可观测”。

## 定义observer类
 我们定义了observer类，它用来将一个正常的object转换成可观测的object。

并且给value新增一个**__ob__属性**，值为该value的Observer实例(**this**)。这个操作相当于为value打上标记，表示它已经被转化成响应式了，避免重复操作

然后判断数据的类型，只有object类型的数据才会调用**walk**将每一个属性转换成getter/setter的形式来侦测变化。 最后，在defineReactive中当传入的属性值还是一个object时使用new observer（val）来递归子属性，这样我们就可以把obj中的所有属性（包括子属性）都转换成getter/seter的形式来侦测变化。 也就是说，只要我们将一个object传到observer中，那么这个object就会变成可观测的、响应式的object。
```javascript
/**
 * Observer类会通过递归的方式把一个对象的所有属性都转化成可观测对象
 */
 export class Observer {//用来将一个正常的object转换成可观测的object
    constructor (value) {
      this.value = value
      // 给value新增一个__ob__属性，值为该value的Observer实例
      // 相当于为value打上标记，表示它已经被转化成响应式了，避免重复操作
      defineProperty(value,'__ob__',this)
      if (Array.isArray(value)) {
        // 当value为数组时的逻辑
        // ...
      } else {
        this.walk(value)//只有object类型的数据才会调用walk
      }
    }
  
    walk (obj: Object) {
      const keys = Object.keys(obj)//获取obj对象的键值[1,2,3]
      for (let i = 0; i < keys.length; i++) {//遍历每一个对象。将其转化为响应式
        defineReactive(obj, keys[i])//调用下面的方法 keys[i]为对象的属性，相当于就是key
      }
    }
  }
  /**
   * 使一个对象转化成可观测对象
   * @param { Object } obj 对象
   * @param { String } key 对象的key
   * @param { Any } val 对象的某个key的值
   */
  function defineReactive (obj,key,val) {
    // 如果只传了obj和key，那么val = obj[key]
    if (arguments.length === 2) {
      val = obj[key]
    }
    if(typeof val === 'object'){
        new Observer(val)//当传入的属性值还是一个object时使用new observer（val）来递归子属性，这样我们就可以把obj中的所有属性（包括子属性）都转换成getter/seter的形式来侦测变化
    }
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get(){
        console.log(`${key}属性被读取了`);
        dep.depend()    // 该属性被读的时候 在getter中收集依赖 表示用到了这个数据(dep主角) 就把自己添加进去
        return val;
      },
      set(newVal){
        if(val === newVal){
            return
        }
        console.log(`${key}属性被修改了`);
        dep.notify()   // 该属性被写的时候 在setter中通知依赖更新 表示修改了这个数据(dep主角) 就通知其他人
        val = newVal;
      }
    })
  }
  ```
  只要我们将一个**bject**传到observer中，那么这个object就会变成**可观测的、响应式的object**。
  
observer类位于源码的src/core/observer/index.js中。

那么现在，我们就可以这样定义car:
```javascript
let a = new Observer({
  'b':'hello world',
  'c':'vue'
})
```
这样，car的两个属性都变得可观测了。

# 依赖收集
**首先记住一句话：当数据发生变化时 视图里谁用到了这个数据就更新谁呗。**
成分
**Watcher = 使用者= A**
**这个数据 = obj**
**Dep = 相当于这个数据的数组集合**
# 什么是依赖？ 
  “A”**用到**了这个数据 === “A”就是**依赖**了这个数据
  "谁用到了这个数据" 称为 "谁依赖了这个数据" 
# 什么是依赖收集
  当一个数据(XXX)变化时：视图里谁用到了这个数据(XXX)就更新谁，我们换个**优雅说法**：我们把"谁用到了这个数据"称为"谁依赖了这个数据",我们给每个数据(XXX)都建一个依赖数组 **[XXX的依赖数组]** (因为一个数据(XXX)可能被多处使用)，谁依赖了这个数据(XXX)(即谁用到了这个数据(XXX))我们就把谁放入这个依赖数组中，那么当这个数据(XXX)发生变化的时候，我们就去它对应的 **[XXX的依赖数组]** 中，把每个**依赖**都通知一遍，告诉他们："你们 依赖 的这个数据(XXX)变啦，你们该更新啦！"。这个过程就是依赖收集。

 # 何时收集依赖？通知依赖更新 getter/setter
当A获取了这个数据的时候，触发getter属性，那么我们就可以在getter中收集这个依赖A。
同样，当这个数据变化时会触发setter属性，那么我们就可以在setter中通知依赖更新。

当这个数据发生变化的时候，我们就去它对应的 *[XXX的依赖数组]** 中，把每个依赖(例如A)都通知一遍，告诉他们："你们依赖的 **这个数据(XXX)** 变啦，你们该更新啦！"


# 以及收集的依赖存放到何处？（Dep）
 我们给 每个数据(XXX)都建一个依赖数组**Dep**，谁(A)依赖了这个数据(XXX)我们就把谁(A)放入这个依赖数组中。
 单单用一个数组来存放依赖的话，功能好像有点欠缺并且代码过于耦合。=>**修改为依赖管理器Dep**
 我们应该将依赖数组的功能扩展一下，更好的做法是我们应该为每一个数据都建立一个依赖管理器Dep(实例 是相当于数据而言 )，如果小明用到了这个数据(XXX)，就加入到Dep(PS：后面又加了一层Watcher)

 把这个数据所有的依赖都管理起来

## Dep类

  ```javascript
  // 源码位置：src/core/observer/dep.js
// dep示例就相当于一个依赖数组 不过功能更多 
export default class Dep {
    constructor () {
      this.subs = [] //先初始化了一个subs数组
    }
  
    addSub (sub) {// 定义了几个实例方法用来对依赖进行添加，删除，通知等操作。
      this.subs.push(sub)
    }
    // 删除一个依赖
    removeSub (sub) {
      remove(this.subs, sub)
    }
    // 添加一个依赖
    depend () {
      if (window.target) {
        this.addSub(window.target)
      }
    }
    // 通知所有依赖更新
    notify () {
      const subs = this.subs.slice()
      for (let i = 0, l = subs.length; i < l; i++) {
        subs[i].update()
      }
    }
  }
  
  /**
   * Remove an item from an array
   */
  export function remove (arr, item) {
    if (arr.length) {
      const index = arr.indexOf(item)
      if (index > -1) {
        return arr.splice(index, 1)
      }
    }
  }
  ```

有了依赖管理器后，我们就可以在getter中收集依赖，在setter中通知依赖更新了，代码如下：
和之前的**defineReactive**对比 有三处注释的地方不一样。
```javascript
function defineReactive (obj,key,val) {
  if (arguments.length === 2) {
    val = obj[key]
  }
  if(typeof val === 'object'){
    new Observer(val)
  }
  const dep = new Dep()  //实例化一个依赖管理器，生成一个依赖管理数组dep
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get(){
      dep.depend()    // 在getter中收集依赖
      return val;
    },
    set(newVal){
      if(val === newVal){
          return
      }
      val = newVal;
      dep.notify()   // 在setter中通知依赖更新
    }
  })
}
```
 # 依赖到底是谁（A）
 相对于变化的这个数据(XXX)对象来说，如果A用到了(这个数据(XXX))，A就是依赖，就为A创建一个 **Watcher实例**（管理器）**划重点**针对的是依赖A
 在之后数据变化setter时，我们不直接去通知依赖更新(之前是直接setter里面通知的)，而是通知A 依赖对应的**Watcher实例**，由**Watcher实例**去通知 A 真正的视图。
 Watcher 就是 “谁” 相当于是 使用者A 当这个数据Dep 变化的时候 不直接通知更新(getter setter里面)，而是由**Watcher实例**代劳通知依赖更新

```javascript
Watcher相关代码见源码
```

  // 只要我们将一个object传到observer中，那么这个object就会变成可观测的、响应式的object。
  # 简单总结一下：
简单总结一下就是：Watcher先把自己( A )设置到全局唯一的指定位置（window.target），然后读取数据。**因为读取了数据**，所以会触发这个数据的**getter**。接着，在getter中就会从全局唯一的那个位置读取**当前正在读取数据**的Watcher，并把这个watcher收集到**这个数据**的Dep数组中去。收集好之后，当数据发生变化(getter)时，会向Dep中的每个Watcher发送通知。通过这样的方式，Watcher可以主动去订阅任意一个数据的变化。
![image](https://user-images.githubusercontent.com/24501320/115498201-baa7f000-a29f-11eb-8342-a962624325aa.png)


# 不足：
虽然我们通过 **Object.defineProperty** 方法实现了对object数据的可观测，但是这个方法仅仅只能观测到object**数据的取值及设置值**，当我们向object数据里**添加**一对新的key/value或**删除**一对已有的key/value时，它是无法观测到的，导致当我们对object数据添加或删除值时，无法通知依赖，无法驱动视图进行响应式更新。

当然，Vue也注意到了这一点，为了解决这一问题，Vue增加了**两个全局API**:Vue.set和Vue.delete

# 总结
其整个流程大致如下：

首先，我们通过Object.defineProperty方法实现了对object数据的可观测，并且封装了Observer类，让我们能够方便的把object数据中的所有属性（包括子属性）都转换成getter/seter的形式来侦测变化。
接着，我们学习了什么是依赖收集？并且知道了在getter中收集依赖，在setter中通知依赖更新，以及封装了依赖管理器Dep，用于存储收集到的依赖。
最后，我们为每一个依赖都创建了一个Watcher实例，当数据发生变化时，通知Watcher实例，由Watcher实例去做真实的更新操作。

**Data**通过observer转换成了getter/setter的形式来追踪变化。
当外界通过Watcher读取数据时，会触发getter从而将Watcher添加到依赖中。
当数据发生了变化时，会触发setter，从而向Dep中的依赖（即Watcher）发送通知。
Watcher接收到通知后，会向外界发送通知，变化通知到外界后可能会触发视图更新，也有可能触发用户的某个回调函数等。

仅学习笔记之用
