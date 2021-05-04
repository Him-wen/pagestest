# 1.回调函数
### 同步回调
将一个函数作为参数传递给另外一个函数，那作为参数的这个函数就是回调函数。简化的代码如下所示：
```javascript
let callback = function(){
    console.log('这是一个回调函数')
}
function main(cb) {
    console.log('main开始')
    cb()// 回调函数
    console.log('main结束')
}

main(callback)
```

```javascript

```


我们将一个匿名函数赋值给变量 callback，同时将 callback 作为参数传递给了 main() 函数，这时在函数 main() 中 callback 就是回调函数。上面的回调方法有个特点，就是回调函数 callback 是在主函数 main 返回之前执行的，我们把这个回调过程称为 **同步回调**。

### 异步回调
```javascript

let callback = function(){
    console.log('i am do homework')
}
function main(cb) {
    console.log('start do work')
    setTimeout(cb,1000)// 模拟异步回调   
    console.log('end do work')
}
main(callback)
```
我们使用了 setTimeout 函数让 callback 在 doWork 函数执行结束后，又延时了 1 秒再执行，这次 callback 并没有在主函数 doWork 内部被调用，我们把这种回调函数在主函数外部执行的过程称为 **异步回调**。

**异步回调** 是指回调函数在主函数之外执行，  
一般有两种方式：  
第一种是把异步函数做成一个任务，添加到信息队列尾部；  
第二种是把异步函数添加到微任务队列中，这样就可以在当前任务的末尾处执行微任务了。

# 2.XMLHttpRequest是什么？
XMLHttpRequest 是一个 JavaScript 对象，它最初由微软设计,随后被 Mozilla、Apple 和 Google采纳. 如今,该对象已经被 W3C组织标准化. 通过它,你可以很容易的取回一个URL上的资源数据. 尽管名字里有XML, 但 XMLHttpRequest 可以取回所有类型的数据资源，并不局限于XML。 而且除了HTTP ,它还支持file 和 ftp 协议。

XMLHttpRequest 语法  
`var req = new XMLHttpRequest();`  
XMLHttpRequest 使用  
```javascript
var xhr = new XMLHttpRequest(); // 创建xhr对象
xhr.open( method, url );
xhr.onreadystatechange = function () { ... };
xhr.setRequestHeader( ..., ... );
xhr.send( optionalEncodedData );
```
关于更细节的API：[你不知道的XMLHttpRequest](https://juejin.cn/post/6844903472714743816)



# 3.XMLHttpRequest 运作机制

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/db0ab192107b42b992ace5d8ead67749~tplv-k3u1fbpfcp-watermark.image)

分析从发起请求到接收数据的完整流程。
首先看一段请求代码：
```javascript
function GetWebData(URL){
    /**
     * 1:新建XMLHttpRequest请求对象
     当执行到let xhr = new XMLHttpRequest()后，JavaScript
     会创建一个 XMLHttpRequest 对象 xhr，用来执行实际的网络请求操作。
     */
    let xhr = new XMLHttpRequest()
    /**
     * 2:注册相关事件回调处理函数 
     因为网络请求比较耗时，所以要注册回调函数，这样后台任务执行完成之后就会通过调用回调函数来
     告诉其执行结果。
     XMLHttpRequest 的回调函数主要有下面几种：
     ontimeout：用来监控超时请
     求，如果后台请求超时了，该函数会被调用；
     onerror：用来监控出错信息，如果后台请求出错
     了，该函数会被调用；
     onreadystatechange：用来监控后台请求过程中的状态，比如可以监控到 
     HTTP 头加载完成的消息、HTTP 响应体消息以及数据加载完成的消息等。
     */
    xhr.onreadystatechange = function () {
        switch(xhr.readyState){
          case 0: //请求未初始化
            console.log("请求未初始化")
            break;
          case 1://OPENED
            console.log("OPENED")
            break;
          case 2://HEADERS_RECEIVED
            console.log("HEADERS_RECEIVED")
            break;
          case 3://LOADING  
            console.log("LOADING")
            break;
          case 4://DONE
            if(this.status == 200||this.status == 304){
                console.log(this.responseText);
                }
            console.log("DONE")
            break;
        }
    }
    xhr.ontimeout = function(e) { console.log('ontimeout') }
    xhr.onerror = function(e) { console.log('onerror') }
    /**
     * 3:打开请求 配置基础的请求信息了，首先要通过 open 接口配置一些基础的请求信息，包括请求的地址、请求方法（是 get 还是 post）和请求方式（同步还是异步请求）。
     */
    xhr.open('Get', URL, true);//创建一个Get请求,采用异步
    /**
     * 4:配置参数 xhr 内部属性类配置一些其他可选的请求信息
     */
    xhr.timeout = 3000 //设置xhr请求的超时时间
    xhr.responseType = "text" //设置响应返回的数据格式
    xhr.setRequestHeader("X_TEST","time.geekbang")
    /**
     * 5:发送请求
     */
    xhr.send();
}
```
一切准备就绪之后，就可以调用xhr.send来发起网络请求了。你可以对照上面那张请求流程图，可以看到：渲染进程会将请求发送给网络进程，然后网络进程负责资源的下载，等网络进程接收到数据之后，就会利用 IPC 来通知渲染进程；渲染进程接收到消息之后，会将 xhr 的回调函数封装成任务并添加到消息队列中，等主线程循环系统执行到该任务的时候，就会根据相关的状态来调用对应的回调函数。如果网络请求出错了，就会执行 xhr.onerror；如果超时了，就会执行 xhr.ontimeout；如果是正常的数据接收，就会执行 onreadystatechange 来反馈相应的状态。

总结：  
首先我们介绍了回调函数和系统调用栈；  
接下来我们站在循环系统的视角，分析了 XMLHttpRequest 是怎么工作的；   
关于浏览器跨域，看另外一篇文章；
