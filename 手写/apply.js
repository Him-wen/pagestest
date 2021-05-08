Function.prototype.apply2 = function(context,arr) {
    context = context ||window;
    context.fn = this;// 将bar函数放到context对象的fn零食属性上面的
    var result;
    if(!arr){// 如果数组为空，那就是正常调用
        result = context.fn();
    }else {// 如果数组不为空，就将每个参数执行，与call类似
        var args = [];
        for( var i = 0;i<arr.length;i++){
            args.push('arr[' + i + ']');
        }
        result = eval('context.fn(' + args + ')');
    }
    delete context.fn;//删除函数
    return result;
}
// 测试代码
function bar (name,age) {
    console.log(name);
    console.log(age);
    console.log(this.value);
}
var foo = {
    value:2,
}
bar.apply2(foo,['名字aaa','123333']);
