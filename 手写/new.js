function Obj ( name, age ) {
    this.name = name;
    this.age = age;
    this.game = '这是构造函数里面固定的参数game'
}

Obj.prototype.sayName = function () {
    console.log('这是Obj构造函数的原型方法');
}

// var obj = new Obj('james','18');

// console.log(obj.name);
// console.log(obj.age);
// console.log(obj.game);
// console.log(obj.sayName());

// 模拟new 

function objNew () {
    // var obj = Object.create(null); // 这个不能获取原型对象上面的值
    // Constructor = [].shift.call(arguments);
    // obj.__proto__ = Constructor.prototype;
    // Constructor.apply(obj,arguments);
    // return obj;
    var obj = new Object(),//从Object.prototype上克隆一个对象
    Constructor = Array.prototype.shift.call(arguments);//取得外部传入的构造器
    obj.__proto__ = Constructor.prototype;//将构造函数的prototype给实例
    var res = Constructor.apply(obj, arguments);//借用外部传入的构造器给obj设置属性
    return typeof res === 'object' ? res : obj;//确保构造器总是返回一个对象
}

var obj = objNew(Obj,'james','18');
console.log(obj.name);
console.log(obj.age);
console.log(obj.game);
obj.sayName();
