[vuejs部分相关的源码](https://github.com/vuejs/vue/blob/dev/src/core/index.js)

# 让object数据变的可观测
 
 要将数据变的‘可观测’，我们就要借助前言中提到的**Object.defineProperty**方法了，在本文中，我们就使用这个方法使数据变得“可观测”。

## 定义observer类
 我们定义了observer类，它用来将一个正常的object转换成可观测的object。

并且给value新增一个**__ob__属性**，值为该value的Observer实例(**this**)。这个操作相当于为value打上标记，表示它已经被转化成响应式了，避免重复操作

然后判断数据的类型，只有object类型的数据才会调用**walk**将每一个属性转换成getter/setter的形式来侦测变化。 最后，在defineReactive中当传入的属性值还是一个object时使用new observer（val）来递归子属性，这样我们就可以把obj中的所有属性（包括子属性）都转换成getter/seter的形式来侦测变化。 也就是说，只要我们将一个object传到observer中，那么这个object就会变成可观测的、响应式的object。
```
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
      for (let i = 0; i < keys.length; i++) {
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
        new Observer(val)//当对象里面还是对象的话就递归处理
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

# 依赖收集
成分
**Watcher = 使用者= A**
**这个数据 = obj**
**Dep = 相当于这个数据的数组集合**
# 什么是依赖？ 
  “A”用到了这个数据  “A”就是依赖
  "谁用到了这个数据" 称为 "谁依赖了这个数据" 

 # 何时收集依赖？通知依赖更新 getter/setter
当A获取了这个数据的时候，触发getter属性，那么我们就可以在getter中收集这个依赖A。

当这个数据发生变化的时候，我们就去它对应的依赖数组中，把每个依赖都通知一遍，告诉他们："你们依赖的数据变啦，你们该更新啦！"


 # 依赖到底是谁
 相对于变化的这个数据obj对象来说，如果A用到了obj对象(这个数据)，A就是依赖，就为A创建一个Watcher实例（管理器）
 在之后数据变化setter时，我们不直接去通知依赖更新(之前是直接setter里面通知的)，而是通知A 依赖对应的Watch实例，由Watcher实例去通知A真正的视图。
 Watcher 就是 “谁” 相当于是 使用者A 当这个数据Dep 变化的时候 不直接通知更新，而是由Watcher代劳通知依赖更新

```
Watcher相关代码见源码
```


# 以及收集的依赖存放到何处？那么我们收集的依赖到底是谁？
 我们给 每个数据(主角)都建一个依赖数组Dep，谁(A)依赖了这个数据我们就把谁(A)放入这个依赖数组中。
 单单用一个数组来存放依赖的话，功能好像有点欠缺并且代码过于耦合。=>修改为依赖管理器Dep
 我们应该将依赖数组的功能扩展一下，更好的做法是我们应该为每一个数据都建立一个依赖管理器Dep(实例 是相当于数据而言 )，如果小明用到了这个数据:obj对象，就加入到Dep(PS：后面又加了一层Watcher)

 把这个数据所有的依赖都管理起来

## Dep类

  ```
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


  // 只要我们将一个object传到observer中，那么这个object就会变成可观测的、响应式的object。
  # 简单总结一下：
简单总结一下就是：Watcher先把自己( A )设置到全局唯一的指定位置（window.target），然后读取数据。**因为读取了数据**，所以会触发这个数据的**getter**。接着，在getter中就会从全局唯一的那个位置读取**当前正在读取数据**的Watcher，并把这个watcher收集到**这个数据**的Dep数组中去。收集好之后，当数据发生变化(getter)时，会向Dep中的每个Watcher发送通知。通过这样的方式，Watcher可以主动去订阅任意一个数据的变化。

# 不足：
虽然我们通过Object.defineProperty方法实现了对object数据的可观测，但是这个方法仅仅只能观测到object**数据的取值及设置值**，当我们向object数据里**添加**一对新的key/value或**删除**一对已有的key/value时，它是无法观测到的，导致当我们对object数据添加或删除值时，无法通知依赖，无法驱动视图进行响应式更新。

当然，Vue也注意到了这一点，为了解决这一问题，Vue增加了**两个全局API**:Vue.set和Vue.delete

# 总结
其整个流程大致如下：

**Data**通过observer转换成了getter/setter的形式来追踪变化。
当外界通过Watcher读取数据时，会触发getter从而将Watcher添加到依赖中。
当数据发生了变化时，会触发setter，从而向Dep中的依赖（即Watcher）发送通知。
Watcher接收到通知后，会向外界发送通知，变化通知到外界后可能会触发视图更新，也有可能触发用户的某个回调函数等。
