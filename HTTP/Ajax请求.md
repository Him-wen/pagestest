> ## 前言
> AJAX即“Asynchronous Javascript And XML”，是指一种创建交互式网页应用的网页开发技术。AJAX 是一种用于创建快速动态网页的技术。它可以令开发者只向服务器获取数据（而不是图片，HTML文档等资源），互联网资源的传输变得前所未有的轻量级和纯粹，这激发了广大开发者的创造力，使各式各样功能强大的网络站点，和互联网应用如雨后春笋一般冒出，不断带给人惊喜。
>   
> ![](https://camo.githubusercontent.com/fd74d02df0f110bf2bd3cf9c68f3060f8a6ead791e7210d22f5b04ab0813b489/68747470733a2f2f757365722d676f6c642d63646e2e786974752e696f2f323031382f31322f32342f313637653035626464666438646365393f773d3135353026683d36363826663d706e6726733d323635303335)
> 
> ## 一、什么是Ajax
> Ajax是一种异步请求数据的web开发技术，对于改善用户的体验和页面性能很有帮助。简单地说，在不需要重新刷新页面的情况下，Ajax 通过异步请求加载后台数据，并在网页上呈现出来。常见运用场景有表单验证是否登入成功、百度搜索下拉框提示和快递单号查询等等。**Ajax的目的是提高用户体验，较少网络数据的传输量**。同时，由于AJAX请求获取的是数据而不是HTML文档，因此它也节省了网络带宽，让互联网用户的网络冲浪体验变得更加顺畅。
> 
> ## 二、Ajax原理是什么
> 在解释Ajax原理之前，我们不妨先举个“领导想找小李汇报一下工作”例子，领导想找小李问点事，就委托秘书去叫小李，自己就接着做其他事情，直到秘书告诉他小李已经到了，最后小李跟领导汇报工作。
> 
> ![](https://camo.githubusercontent.com/d4cd1e9f8f10ed4d78e91843fab900b570f0ac853078343924582eb0ba05f3a1/68747470733a2f2f757365722d676f6c642d63646e2e786974752e696f2f323031382f31322f31382f313637626430313932343061343537623f773d35343826683d32343626663d706e6726733d3635373039)
> 
> Ajax请求数据流程与“领导想找小李汇报一下工作”类似。其中最核心的依赖是浏览器提供的XMLHttpRequest对象，它扮演的角色相当于秘书，使得浏览器可以发出HTTP请求与接收HTTP响应。浏览器接着做其他事情，等收到XHR返回来的数据再渲染页面。
> 
> ![](https://camo.githubusercontent.com/0de31ac502334c585edb2caf4e6af2385e51d1abc11cf96055465baaa6b1b7b6/68747470733a2f2f757365722d676f6c642d63646e2e786974752e696f2f323031382f31322f31382f313637626430323338353563306266373f773d35363326683d32343026663d706e6726733d3733383234)
> 
> 理解了Ajax的工作原理后，接下来我们探讨下如何使用Ajax。
> 
> ## 三、Ajax的使用
> 使用Ajax请求一个 JSON 数据一般是这样：
```javascript
var xhr = new XMLHttpRequest();
xhr.open('GET', url/file,true);
xhr.onreadystatechange = function() {
   if(xhr.readyState==4){
        if(xhr.status==200){
            var data=xhr.responseText;
             console.log(data);
   }
};
xhr.onerror = function() {
  console.log("Oh, error");
};
xhr.send();
```
> fetch请求JSON数据:
```javascript
fetch(url).then(response => response.json())//解析为可读数据
  .then(data => console.log(data))//执行结果是 resolve就调用then方法
  .catch(err => console.log("Oh, error", err))//执行结果是 reject就调用catch方法
```
> 参考XMLHttpRequest这篇文章

