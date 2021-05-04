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

### 其中有几个API：
FormData：AJAX操作往往用来传递表单数据。为了方便表单处理，HTML 5新增了一个 FormData 对象，可以用于模拟表单。
Blob：二进制不可变数据

里面包含了 上传数据 和 下载数据  
### 大文件分块传输
```javascript
var blob = ...; // 1

const BYTES_PER_CHUNK = 1024 * 1024; // 2
const SIZE = blob.size;

var start = 0;
var end = BYTES_PER_CHUNK;

while(start < SIZE) { // 3
  var xhr = new XMLHttpRequest();
  xhr.open('POST', '/upload');
  xhr.onload = function() { ... };

  xhr.setRequestHeader('Content-Range', start+'-'+end+'/'+SIZE); // 4
  xhr.send(blob.slice(start, end)); // 5

  start = end;
  end = start + BYTES_PER_CHUNK;
}
```
(1) 一个任意的数据块 (二进制或文本)
(2) 将数据库大小设置为 1MB
(3) 迭代提供的数据，增量为1MB
(4) 设置上传的数据范围 (Content-Range请求头)
(5) 通过 XHR 上传 1MB 数据块

### 监听上传和下载进度
XHR 对象提供了一系列 API，用于监听进度事件，表示请求的当前状态：
每个 XHR 传输都以 loadstart 事件开始，并以 loadend 事件结束，并在这两个事件期间触发一个或多个附加事件来指示传输的状态。因此，为了监控进度，应用程序可以在 XHR 对象上注册一组 JavaScript 事件侦听器：
```javascript
var xhr = new XMLHttpRequest();
xhr.open('GET','/resource');
xhr.timeout = 5000; // 1

xhr.addEventListener('load', function() { ... }); // 2
xhr.addEventListener('error', function() { ... }); // 3

var onProgressHandler = function(event) {
  if(event.lengthComputable) {
    var progress = (event.loaded / event.total) * 100; // 4
    ...
  }
}

xhr.upload.addEventListener('progress', onProgressHandler); // 5
xhr.addEventListener('progress', onProgressHandler); // 6
xhr.send();
```
(1) 设置请求超时时间为 5,000 ms (默认无超时时间)  
(2) 注册成功回调  
(3) 注册异常回调  
(4) 计算已完成的进度  
(5) 注册上传进度事件回调  
(6) 注册下载进度事件回调  

### 使用XHR流式传输数据
### XHR 长轮询
### XMLHttpRequest 库
#### fetch.js
fetch 函数是一个基于 Promise 的机制，用于在浏览器中以编程方式发送 Web 请求。该项目是实现标准 Fetch 规范的一个子集的 polyfill ，足以作为传统 Web 应用程序中 XMLHttpRequest 的代替品。
详细信息，请参考 - Github - fetch 
Fetch API 兼容性，请参考 - Can I use Fetch

### 其他知识点
#### XHR下载图片

#### XHR上传数据
普通文本  
FormData  
Buffer  
#### XHR 上传进度条

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

参考资料：[工作原理与实践](https://time.geekbang.org/column/article/135127）
关于更细节的API：[你不知道的XMLHttpRequest](https://juejin.cn/post/6844903472714743816)
关于 Fetch API：参考 [阮一峰老师教程](https://www.ruanyifeng.com/blog/2020/12/fetch-tutorial.html)
