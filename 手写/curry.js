  function fn(a, b, c) {
      return a + b + c;
  }
  // 参数定长的情况
  function curry1(fn) {
      var argslen = fn.length;
      var args = Array.prototype.slice.call(arguments, 1);
      return function() {
          var curryargs = Array.prototype.slice.call(arguments);
          var argssum = curryargs.concat(args);
          // 和参数不定长的情况
          if(argssum.length >= argslen) {
              return fn.apply(this, argssum);
          }else {
              return curry1.call(null, fn, ...argssum);
          }
      }
  }

  function fn(a, b, c) {
    return a + b + c;
  }
  var curried = curry1(fn);
  curried(1, 2, 3); // 6
  curried(1, 2)(3); // 6
  curried(1)(2, 3); // 6
  curried(1)(2)(3); // 6
  curried(7)(8)(9); // 24
  console.log(curried(1)(2, 3));
  console.log(curried(7)(8)(9));


  // 参数不定长的情况
  function curry2(fn1) {
      var args = Array.prototype.slice.call(arguments, 1);
    function te() {
          var curryargs = Array.prototype.slice.call(arguments);
          var argssum = curryargs.concat(args);
          return curry2.call(null, fn1, ...argssum);
    }
    // 核心
    te.toString = function() {
        return fn1.apply(null, args);
    }
    return te;

  }

  function test() {
      return [...arguments].reduce((prev, cur)=>{
          return prev + cur;
      }, 0)
  }

  var curris = curry2(test);
  console.log(curris(1)(2)(3)(4));
