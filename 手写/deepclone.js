
var obj = {
  name:'基本数据类型',
  arr:[1,[2,[1,1]],4],
}

// var obj1 = obj;
// obj1.name = '赋值修改的基本数据类型';
// obj1.arr[1] = [3,4];
// console.log(obj);
// console.log(obj1);// 基本数据类型和对象类型都被修改了


// 浅拷贝
function shollowclone(source){
  var target = {};
  for(let i in source){
    if(source.hasOwnProperty(i)){
      target[i] = source[i];
    }
  }
  return target;
}

// var obj2 = shollowclone(obj);
// obj2.name = '浅拷贝修改的基本数据类型';
// obj2.arr[1] = [5,6];
// console.log(obj);
// console.log(obj2);

// 深拷贝：递归方法实现深度克隆原理：遍历对象、数组直到里边都是基本数据类型，然后再去复制，就是深度拷贝。
const setobjdeep = {
  field1: 1,
  field2: undefined,
  field3: {
      name: 'child'
  },
  field4: [2, 4, 8]
};
setobjdeep.setobjdeep = setobjdeep;

// function deepclone(source, weakmap = new WeakMap()) {
  // if(source === null) return source;// 如果是null或者undefined我就不进行拷贝操作
  // if(source instanceof Date) return new Date(source);
  // if(source instanceof RegExp) return new RegExp(source);
  // // 可能是对象或者普通的值  如果是函数的话是不需要深拷贝
  // if(typeof source !== 'object') return source;
  // // 是对象的话就要进行深拷贝
  // var target = new source.constructor();// var target = {};写法
  // // 找到的是所属类原型上的constructor,而原型上的 constructor指向的是当前类本身
  // for(var key in source) {
  //   if(source.hasOwnProperty(key)) {// 判断key是不是source上面的属性
  //     target[key] = deepclone(source[key]);// 实现一个递归拷贝
  //   }
  // }
// }
function deepclone(source, weakmap = new WeakMap()) {
  if(typeof source === 'object') {
    let target = Array.isArray(source) ? {}:[];
    if(weakmap.get(source)){
      return weakmap.get(source);// 解决循环引用
    }else{
      weakmap.set(source,target);
    }
    for(let key in source) {
      if(source.hasOwnProperty(key)) {// 判断key是不是source上面的属性
        target[key] = deepclone(source[key],weakmap);// 实现一个递归拷贝
      }
    }
    return target;
  } else {// 不是对象的执行
  return source;
  }
}

var setobjdeep01 = deepclone(setobjdeep);
setobjdeep01.field3.name = '深拷贝修改的值'
console.log(setobjdeep);
console.log(setobjdeep01);

// var obj3 = deepclone(obj);
// obj3.name = '深拷贝修改的基本数据类型';
// obj3.arr[1] = [7,[3,4]];
// console.log(obj);
// console.log(obj3);

// 浅拷贝实现方式
var obj = {
  name:'基本数据类型',
  arr:{
    sex:'man',
    age:'18'
  },
}
// 执行方法选一个
// assign方式
// var obj01 = Object.assign({},obj);
// ...扩展运算符方式
var obj01 = {...obj};

obj01.name = '通过浅拷贝修改';
obj01.arr.sex = '修改的man';
// console.log(obj);
// console.log(obj01);



// Array.property.concat 与 Array.property.slice
var objarr = [{
  name:'基本数据类型',
  arr:{
    sex:'man',
    age:'18'
  },
},2,3];

// 执行方法选一个
//Array.property.concat
// var objarr01 = objarr.concat();
//Array.property.slice
// var objarr01 = objarr.slice();

// objarr01[0].name = '这个被修改了';
// objarr01[1] = 12;
// console.log(objarr);
// console.log(objarr01);

// 深拷贝实现方式
// 利用JSON.stringify将对象转成JSON字符串，再用JSON.parse把字符串解析成对象，一去一来，新的对象产生了，而且对象会开辟新的栈，实现深拷贝
// 这种方法虽然可以实现数组或对象深拷贝,但不能处理函数和正则，因为这两者基于JSON.stringify和JSON.parse处理后，得到的正则就不再是正则（变为空对象），得到的函数就不再是函数（变为null）了。
var deepobj = [1,2,{
  name:'深拷贝'
},function(){}]

// var deepobj01 = JSON.parse(JSON.stringify(deepobj));
// deepobj01[2].name = '修改后的对象数据'
// console.log(deepobj);
// console.log(deepobj01);

// 手写
