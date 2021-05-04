[参考](https://segmentfault.com/a/1190000020714686)
> HTTP 0.9 1.0 1.1 每个版本新增的特性
> 
> # HTTP/0.9
> * 单行指令， 请求报文由 GET 加上 URL 构成
> * 只有 GET 方法
> * 响应报文只包含数据
> * 没有 HTTP 头部
> * 只能传输 HTML ，无法传输其他类型的文件
> * 没有响应状态码或错误代码，发生错误时，只能发送一个描述问题的 HTML 文件
> 
> # HTTP/1.0
> * 协议版本信息随每个请求发送，如 `GET /index.html HTTP/1.0`
> * 新增了 HTTP 响应状态码
> * 引入 HTTP 头的概念，协议变得灵活，更具扩展性
> * 由于引入了 HTTP 头，可以使用 `Content-Type` 字段，用来传输其他类型的文件
> * 长连接需要设置 keep-alive
> 
> # HTTP/1.1
> * 连接可以复用，减少 TCP 建立连接次数
> * 增加管线化技术
> * 支持响应分块
> * 增加 cache-control ，etag 跟 if-none-match ，对缓存进行优化
> * 引入内容协商机制，包括语言，编码，类型等，并允许客户端和服务器之间约定以最合适的内容进行交换
> * Host 头能够使不同域名配置在同一个IP地址的服务器上
> 
> # 参考
> * [HTTP的发展](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Basics_of_HTTP/Evolution_of_HTTP)
> * [第 117 题：介绍下 http1.0、1.1、2.0 协议的区别？](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/232)
