let a = new Promise((resolve,reject)=>{
    resolve('这是a传过来的值');
})
let b = new Promise((resolve,reject)=>{
    resolve('这是b传过来的值');
})
let c = new Promise((resolve,reject)=>{
    resolve('这是上面传过来的值');
})

Promise.alls = function(promises) {// 方法返回一个Promise
    return new Promise((resolve,reject) =>{
        let result = [];// 结果数组
        let len =promises.length;
        if(len == 0){// 边界情况判断
            resolve(result);
            return;
        }

        const handleData = (data,index) => {
            result[index] = data;
            if(index == len - 1)resolve(result);
        }

        for(let i=0;i<len;i++) {
            Promise.resolve(promises[i]).then((data)=>{
                handleData(data,i);
            }).catch((err)=>{
                reject(err);
            })
        }
    })
}

Promise.races = function(promises){
    return new Promise((resolve,reject)=>{
        let len = promises.length;
        if(len === 0){
            return;
        }
        for(let i=0; i<len; i++){
            Promise.resolve(promises[i]).then((res)=>{
                resolve(res);
                return;// 和all相比多了 一个返回
            }).catch((error)=>{
                reject(res);
                return;
            })
        }

    })
}


Promise.races([a,b]).then((res)=>{
    console.log(res);
}).catch((err)=>{
    console.log(err);
})

Promise.alls([a,b,c]).then((res)=>{
    console.log(res);
}).catch((err)=>{
    console.log(err);
})
