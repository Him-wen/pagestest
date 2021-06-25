
function myinstanceof(left, right) {//实现instanceof
    if(typeof left !== 'object' || left === null) {
        return false;
    }
    let proto = Object.getPrototypeOf(left);
    while(true) {
        if(proto === null)return false;
        if(proto === right.prototype) return true;
        proto = Object.getPrototypeOf(proto);
    }
}

function getType(obj) {// 全局通用的数据类型判断方法
    if(typeof obj !=='object') {
        return typeof obj;
    }
    return Object.prototype.toString.call(obj).replace(/^\[object (\S+)\]$/,'$1');
}

console.log(getType([]));


//测试typeof
// console.log(typeof 1);
// console.log(typeof '1');
// console.log(typeof true);
// console.log(typeof undefined);
// console.log(typeof null);
// console.log(typeof Symbol());
// console.log(typeof null);
// console.log(typeof console.log);

//测试instanceof
let A = function() {};
let benz = new A();
console.log(myinstanceof(benz, A));
console.log(myinstanceof(new Number(123), Number));

