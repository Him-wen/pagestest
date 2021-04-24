# 阅读路径

路径：E:\github\vue\src\core\instance\index.js
主要是定义了Vue构造函数执行_init方法

1.作为参数传给 initMixin(Vue)

initMixin(Vue)路径：E:\github\vue\src\core\instance\init.js

1.定义原型方法_init。进行一系列的**初始化阶段**，
Vue 初始化主要就干了几件事情，合并配置，初始化生命周期，初始化事件中心，初始化渲染，初始化 data、props、computed、watcher 等等。
Vue 的初始化逻辑写的非常清楚，把不同的功能逻辑拆成一些单独的函数执行，让主线逻辑一目了然

2.具体做的事情可以看源码相关的备注
....
调用 beforeCreate 钩子函数
数据响应式，处理 props、methods、data、computed、watch 等选项(**细节**[1])
调用 created 钩子函数
....
如果发现配置项上有 el 选项，则自动调用 $mount 方法，也就是说有了 el 选项，就不需要再手动调用 $mount 方法，反之，没提供 el 选项则必须调用 $mount[Vue生命周期流程图]

接下来则进入**挂载阶段**:在/src/platform/web/entry-runtime-with-compiler.js文件中
生命周期函数分别有beforeMount和mounted钩子函数

1.compiler 版本的 $mount 实现
缓存了原型上的 $mount 方法
Vue.prototype.$mount = function(){}//重新定义该方法

具体：
首先，它对 el 做了限制，Vue 不能挂载在 body、html 这样的根节点上。接下来的是很关键的逻辑 —— 如果没有定义 render 方法，则会把 el 或者 template 字符串转换成 render 方法。这里我们要牢记，在 Vue 2.0 版本中，所有 Vue 的组件的渲染最终都需要 render 方法，无论我们是用单文件 .vue 方式开发组件，还是写了 el 或者 template 属性，最终都会转换成 render 方法，那么这个过程是 Vue 的一个“在线编译”的过程，它是调用 compileToFunctions 方法实现的，编译过程我们之后会介绍。最后，调用原先原型上的 $mount 方法挂载(如下)。

1.原先原型上的 $mount 方法在 E:\github\vue\src\platforms\web\runtime\index.js 中定义，之所以这么设计完全是为了复用，因为它是可以被 runtime only 版本的 Vue 直接使用的。

2.原型上的 $mount 方法实际上会去调用 **mountComponent** 方法，具体定义在 E:\github\vue\src\core\instance\lifecycle.js 

主要做了几件事：
mountComponent 核心就是先实例化一个渲染Watcher，在它的**回调函数**中会调用 updateComponent 方法，在此方法中调用 vm._render 方法先生成虚拟 Node，最终调用 vm._update 更新 DOM。(**最核心的 2 个方法：vm._render 和 vm._update** **细节[2]**)

总结：第一在该阶段中所做的主要工作是创建Vue实例并用其**替换el选项**对应的DOM元素，第二同时还要开启对模板中数据（状态）的监控，当数据（状态）发生变化时通知其依赖进行视图更新。(**Watcher实例**)

我们将挂载阶段所做的工作分成两部分进行了分析，第一部分是**将模板渲染到视图**上，第二部分是**开启对模板中数据（状态）的监控**。两部分工作都完成以后挂载阶段才算真正的完成了。

## 细节[2]

Vue 的 **_render** 方法是实例的一个私有方法，它用来把实例渲染成一个虚拟 Node。它的定义在 src/core/instance/render.js 文件中：定义在 renderMixin 方法中，再E:\github\vue\src\core\instance\index.js中 即传入renderMixin(Vue),定义 Vue.prototype._render 原型方法。

内部执行createElement方法，定义文件夹在：E:\github\vue\src\core\vdom\create-element.js 创建Vnode
我们大致了解了 createElement 创建 VNode 的过程，每个 VNode 有 children，children 每个元素也是一个 VNode，这样就形成了一个 VNode Tree，它很好的描述了我们的 DOM Tree。

接下来就是要把这个 VNode 渲染成一个真实的 DOM 并渲染出来，这个过程是通过 vm._update 完成的

Vue 的 **_update** 方法是实例的一个私有方法，它用来把这个 VNode 渲染成一个真实的 DOM 并渲染出来。它的定义在 E:\github\vue\src\core\instance\lifecycle.js 和挂载阶段的函数mountComponent 是在一个文件夹中

它被调用的时机有 2 个，一个是首次渲染，一个是数据更新的时候，_update 的核心就是调用 vm.__patch__ 方法，这个方法实际上在不同的平台，比如 web 和 weex 上的定义是不一样的

 vm.__patch__ 方法，这个方法实际上在不同的平台，比如 web 和 weex 上的定义是不一样的，因此在 web 平台中它的定义在 src/platforms/web/runtime/index.js 中：在浏览器环境就直接到patch.js里面
