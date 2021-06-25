function debounce(fn, delay) {
    var timer = null;
    return function() {
        if(timer) clearTimeout(timer);
        var self = this;
        var args = Array.prototype.slice.call(arguments);
        timer = setTimeout(()=>{
            fn.call(self, ...args);
        }, delay);
    }
}

function throttle(fn,delay) {//1
    let timer = true;
    return function() {
        var self = this;
        var args = Array.prototype.slice.call(arguments);
        if(!timer) return;// 为false的话  就直接退出 在函数开头判断标志是否为 true，不为 true 则中断函数
        timer = false;//如果是false不执行
        setTimeout(() => {
        fn.apply(self, ...args)
        timer = true;
        }, delay);
    }
  }
