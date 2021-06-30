
//bind() 方法会创建一个新函数。当这个新函数被调用时，bind() 的第一个参数将作为它运行时的 this，之后的一序列参数将会在传递的实参前传入作为它的参数。(来自于 MDN )
Function.prototype.bind2 = function (context) {
    var self = this;// 这个this就是调用bind2函数的函数(bar)，函数里面返回函数，很容易出现函数this的丢失
    var args = Array.prototype.slice.call(arguments,1);//arguments是对象不是数组 获取bind2函数从第二个参数到最后一个参数
    // var fnzz = function () {};
    var fnzz = function () {// 这是一个构造函数
        // this instanceof fn为true的情况，使用new时this的绑定规则：this指向不是bar，而是一个new的实例，这就是发生了构造函数，所以选this，反之不是new构造函数，就用context这个foo即可按原来的操作
        var bindagrs = Array.prototype.slice.call(arguments);// // 这个时候的arguments是指bind返回的函数传入的参数
        return self.apply(this instanceof fnzz ? this : context, args.concat(bindagrs));// 一个绑定函数也能使用new操作符创建对象：这种行为就像把原函数当成构造器。提供的 this 值被忽略，同时调用时的参数被提供给模拟函数。
    }// self就是调用bind2函数的函数(bar)
    //利用原型链把他们串联起来，把bar的原型对象赋值给fn的原型对象
    fnzz.prototype = self.prototype;// 修改返回函数的原型为 绑定函数的原型，实例就可以继承绑定函数中的原型的值
    // fn.prototype = new fnzz ();
    return fnzz; //返回的这个函数 就是测试里面的对象bingFoo
}

var foo = {
    value:3
}
function bar (name,age) {
    this.habit = 'shopping';
    console.log(this.value);// 这个属性打印为undefined是正常的，因为new 的话 实例属性不再指向foo，而是obj，
    console.log(name);
    console.log(age);
}
bar.prototype.friend = 'kevin';

// 测试
var bindFoo = bar.bind2(foo,'daisy');
// bindFoo('18');// 不使用new，this效果依旧
// 使用new this失效undefined
var obj = new bindFoo('18');

console.log(obj.habit);
console.log(obj.friend);
