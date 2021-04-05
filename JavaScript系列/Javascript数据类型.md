# 数据类型的判断


![](https://cdn.nlark.com/yuque/0/2021/png/2932826/1617595918208-0ffc4e8c-6f1d-48e4-8c95-e8852bb45e72.png#align=left&display=inline&height=975&margin=%5Bobject%20Object%5D&originHeight=975&originWidth=1699&size=0&status=done&style=none&width=1699)
数据类型的判断方法其实有很多种，比如 typeof 和 instanceof，下面我来重点介绍三种在工作中经常会遇到的数据类型检测方法。


## 第一种判断方法：typeof


这是比较常用的一种，那么我们通过一段代码来快速回顾一下这个方法。
对于**原始类型**来说，除了** null **都可以调用typeof显示正确的类型。
但对于**引用数据类型**，除了**函数**之外，都会显示"object"。
```javascript
typeof 1 // 'number'
typeof '1' // 'string'
typeof undefined // 'undefined'
typeof true // 'boolean'
typeof Symbol() // 'symbol'
typeof null // 'object'这个
//但对于引用数据类型，除了函数之外，都会显示"object"。
typeof [] // 'object'
typeof {} // 'object'
typeof console // 'object'
typeof console.log // 'function'
```


## 第二种判断方法：instanceof


想必 **instanceof** 的方法你也听说过，我们 new 一个对象，那么这个新对象就是它原型链继承上面的对象了，通过 instanceof 我们能判断这个对象是否是之前那个**构造函数**生成的对象，这样就基本可以判断出这个新对象的数据类型。下面通过代码来了解一下。


```javascript
let Car = function() {}
let benz = new Car()
benz instanceof Car // true
let car = new String('Mercedes Benz')
car instanceof String // true

let str = 'Covid-19'
str instanceof String // false
```


接下来手写一个instanceof(**原型链的向上查找**)
**left为待检测，right为类型值**
```javascript
function myInstanceof(left, right) {
  // 这里先用typeof来判断基础数据类型，如果是，直接返回false
  if(typeof left !== 'object' || left === null) return false;
  // getProtypeOf是Object对象自带的API，能够拿到参数的原型对象
  let proto = Object.getPrototypeOf(left);
  while(true) {                  //循环往下寻找，直到找到相同的原型对象
    if(proto === null) return false;
    if(proto === right.prototype) return true;//找到相同原型对象，返回true
    proto = Object.getPrototypeof(proto);//如果没找到继续向上寻找
    }
}
// 验证一下自己实现的myInstanceof是否OK
console.log(myInstanceof(new Number(123), Number));    // true
console.log(myInstanceof(123, Number));                // false
```


在你知道了两种判断数据类型的方法，那么它们之间有什么差异呢？我总结了下面两点：


**instanceof** 可以准确地判断**复杂引用数据类型**，但是不能正确判断基础数据类型；


而 **typeof** 也存在弊端，它虽然可以判断基础数据类型（null 除外），但是引用数据类型中，除了 **function **类型以外，其他的也无法判断。


总之，不管单独用 typeof 还是 instanceof，都不能满足所有场景的需求，而只能通过二者混写的方式来判断。但是这种方式判断出来的其实也只是大多数情况，并且写起来也比较难受，你也可以试着写一下。


## 第三种判断方法：Object.prototype.toString


toString() 是 Object 的原型方法，调用该方法，可以统一返回格式为 “[object Xxx]” 的字符串，其中 Xxx 就是对象的类型。对于 Object 对象，直接调用 toString() 就能返回 [object Object]；而对于**其他对象**，则需要通过 **call** 来调用(这里可以考虑参考**call**的实现)，才能返回正确的类型信息。我们来看一下代码。


```javascript
Object.prototype.toString({})       // "[object Object]"
Object.prototype.toString.call({})  // 同上结果，加上call也ok
Object.prototype.toString.call(1)    // "[object Number]"
Object.prototype.toString.call('1')  // "[object String]"
Object.prototype.toString.call(true)  // "[object Boolean]"
Object.prototype.toString.call(function(){})  // "[object Function]"
Object.prototype.toString.call(null)   //"[object Null]"
Object.prototype.toString.call(undefined) //"[object Undefined]"
Object.prototype.toString.call(/123/g)    //"[object RegExp]"
Object.prototype.toString.call(new Date()) //"[object Date]"
Object.prototype.toString.call([])       //"[object Array]"
Object.prototype.toString.call(document)  //"[object HTMLDocument]"
Object.prototype.toString.call(window)   //"[object Window]"
```


从上面这段代码可以看出，Object.prototype.toString.call() 可以很好地判断引用类型，甚至可以把 document 和 window 都区分开来。


但是在写判断条件的时候一定要注意，使用这个方法最后返回统一字符串格式为 "[object Xxx]" ，而这里字符串里面的 "Xxx" ，第一个首字母要大写（注意：**使用 typeof 返回的是小写**），这里需要多加留意。


那么下面来实现一个**全局通用的数据类型判断方法**，来加深你的理解，代码如下。


```javascript
function getType(obj){
  let type  = typeof obj;//示例:typeof 1的话 就是number，返回一个基础类型数据
  if (type !== "object") {    // 先进行typeof判断，如果是基础数据类型，直接返回
    return type;
  }
  // 对于typeof返回结果是object的，再进行如下的判断，正则返回结果
  return Object.prototype.toString.call(obj).replace(/^\[object (\S+)\]$/, '$1');  // 注意正则中间有个空格
}
/* 代码验证，需要注意大小写，哪些是typeof判断，哪些是toString判断？思考下 */
getType([])     // "Array" typeof []是object，因此toString返回
getType('123')  // "string" typeof 直接返回
getType(window) // "Window" toString返回
getType(null)   // "Null"首字母大写，typeof null是object，需toString来判断
getType(undefined)   // "undefined" typeof 直接返回
getType()            // "undefined" typeof 直接返回
getType(function(){}) // "function" typeof能判断，因此首字母小写
getType(/123/g)      //"RegExp" toString返回
```


# 强制类型转换


强制类型转换方式包括 Number()、parseInt()、parseFloat()、toString()、String()、Boolean()，这几种方法都比较类似，通过字面意思可以很容易理解，都是通过自身的方法来进行数据类型的强制转换。下面我列举一些来详细说明。


# 隐式类型转换


凡是通过逻辑运算符 (&&、 ||、 !)、运算符 (+、-、*、/)、关系操作符 (>、 <、 <= 、>=)、相等运算符 (==) 或者 if/while 条件的操作，如果遇到两个数据类型不一样的情况，都会出现隐式类型转换。这里你需要重点关注一下，因为比较隐蔽，特别容易让人忽视。


下面着重讲解一下日常用得比较多的“”和“+”这两个符号的隐式转换规则。
'' 的隐式类型转换规则


如果类型相同，无须进行类型转换；


如果其中一个操作值是 null 或者 undefined，那么另一个操作符必须为 null 或者 undefined，才会返回 true，否则都返回 false；


如果其中一个是 Symbol 类型，那么返回 false；


两个操作值如果为 string 和 number 类型，那么就会将字符串转换为 number；


如果一个操作值是 boolean，那么转换成 number；


如果一个操作值为 object 且另一方为 string、number 或者 symbol，就会把 object 转为原始类型再进行判断（调用 object 的 valueOf/toString 方法进行转换）。


```javascript
null == undefined       // true  规则2
null == 0               // false 规则2
'' == null              // false 规则2
'' == 0                 // true  规则4 字符串转隐式转换成Number之后再对比
'123' == 123            // true  规则4 字符串转隐式转换成Number之后再对比
0 == false              // true  e规则 布尔型隐式转换成Number之后再对比
1 == true               // true  e规则 布尔型隐式转换成Number之后再对比
var a = {
  value: 0,
  valueOf: function() {
    this.value++;
    return this.value;
  }
};
// 注意这里a又可以等于1、2、3
console.log(a == 1 && a == 2 && a ==3);  //true f规则 Object隐式转换
// 注：但是执行过3遍之后，再重新执行a==3或之前的数字就是false，因为value已经加上去了，这里需要注意一下
```
