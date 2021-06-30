// 实现resolve方法
Promise.resolves = function(param) {
    if(param instanceof Promise) return param;
    return new Promise((resolve,reject)=>{
        if(param && param.then && param.then =='function') {
            param.then(resolve,reject);
        } else {
            resolve(param);
        }
    })
}
// 实现reject方法
Promise.rejects = function(reason) {
    return new Promise((resolve,reject)=>{
        reject(reason);
    });
}

let p = new Promise((resolve, reject) => {
    resolve(2);
})

let p2 = Promise.rejects(2);

console.log(p);
console.log(p2);