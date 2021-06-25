function MyPromise(excuctor){
    let self = this;
    self.value = null;
    self.error = null;
    self.status = 'pending';
    self.onFulfilledCallback = [];//用数组代替单个Promise
    self.onRejectedCallback = [];
    const resolve = (value)=>{// value 值是案例中的 resolve(x) 里面得 x
        if(self.status !== 'pending')return;
        setTimeout(()=>{
            self.value = value;
            self.status = 'fulfilled';
            self.onFulfilledCallback.forEach((callback)=>{
                callback(self.value);
            })
        // self.onFulfilled(self.value);//resolve时执行成功回调
        }) 
    }
    const reject = (error)=>{
        if(self.status !== 'pending')return;
        setTimeout(()=>{
        self.error = error;
        self.status = 'rejected';
        self.onRejectedCallback.forEach((callback)=>{
            callback(self.error);
        })
        // self.onRejected(self.error);//reject时执行成功回调
        }) 
    }
    excuctor(resolve,reject);
}

MyPromise.prototype.then = function(onFulfilled,onRejected){
    let bridgePromise;
    let self = this;
    function resolvePromise (bridgePromise,x,onFulfilled,onRejected) {
        if(x instanceof MyPromise){
            if(x.status === 'pending'){
                x.then(y=>{
                    resolvePromise(bridgePromise,y,onFulfilled,onRejected);
                },error=>{
                    reject(error);
                })
            } else{
                x.then(resolve,reject);
            }
        } else {// 如果不是返回的Promise，就直接resolve
            resolve(x);
        }
    }
    if(this.status === 'pending'){
        return bridgePromise =new MyPromise((resolve,reject)=>{
            self.onFulfilledCallback.push((value)=>{
                try {
                let x = onFulfilled(value);//第一个Promise返回的结果
                resolve(x);// 修改
                } catch(e) {
                reject(e);
                }
            })
            self.onRejectedCallback.push((error)=>{
                try {
                    let x = onRejected(error);
                    resolve(x);
                } catch(e) {
                    reject(e);
                }
            })
        })

    }else if(this.status === 'fulfilled'){
        //如果状态是fulfilled，直接执行成功回调，并将成功值传入
        return bridgePromise =new MyPromise((resolve,reject)=>{
            setTimeout(()=>{
               try {
            let x = onFulfilled(value);//第一个Promise返回的结果
            resolve(x);
            } catch(e) {
            reject(e);
            } 
            })
            
        })
    }else if(this.status === 'rejected'){
        //如果状态是rejected，直接执行失败回调，并将失败原因传入
        return bridgePromise =new MyPromise((resolve,reject)=>{
            setTimeout(()=>{
              try {
                let x = onRejected(error);
                resolve(x);
            } catch(e) {
                reject(e);
            }  
            })
            
        })
    }
}

MyPromise.prototype.catch = function(onRejected) {
    return this.then(null,onRejected);// 调用的错误提示：TypeError: onRejected is not a function
}

var a = new MyPromise((resolve,reject)=>{
    resolve(2)
})

a.then(x=>{
    console.log('第一次展示' + x);
    return new MyPromise((resolve,reject)=>{
        resolve(4);
    }); 
},err=>{
    console.log('失败回调的函数' + err);
}).then(x=>{
    console.log(x);
})
