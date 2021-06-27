//括号栈的匹配
var isValid = function(s) {
    if(s % 2) return false;
    let res = [];
    let len = s.length;
    for(const item of s) {
        switch(item){
            case "{":
            case "(":
            case "[":
              res.push(item);
              break;
            case "}":
              if(res.pop() != "{")return false;
              break;
            case ")":
              if(res.pop() != "(") return false;
              break;
            case "]":
              if(res.pop() != "[") return false;
              break;
        }
    }
    return !res.length;
};

// 1047. 删除字符串中的所有相邻重复项
var removeDuplicates = function(s) {
    let stk = [];
    for(const item of s) {
        if(!stk || stk[stk.length - 1] != item) {// 和当前栈的顶部 没有相同的元素 或者栈为空
            stk.push(item);//压入
        }else {//其他的一些情况
            stk.pop();//弹出
        }
    }
    return stk.join('')//将数组转为字符串
};

//150. 逆波兰表达式求值
var evalRPN = function(tokens) {
    let stk = [];
    for(let i =0; i<tokens.length; i++) {
        if(tokens[i]=== '+' || tokens[i]=== '-' || tokens[i]=== '*' || tokens[i]=== '/') {
            let num2 = stk.pop();// 注意这里的顺序先取num2，再取num1
            let num1 = stk.pop();
            if(tokens[i]=== '+') stk.push(num1 + num2);
            if(tokens[i]=== '-') stk.push(num1 - num2);
            if(tokens[i]=== '*') stk.push(num1 * num2);
            if(tokens[i]=== '/') stk.push(num1 / num2 > 0 ? Math.floor(num1 / num2) : Math.ceil(num1 / num2));
        }else {
            stk.push(parseInt(tokens[i]));// 不是以上的几个符号
        }
    }
    return stk.pop();
};

// 239.滑动窗口最大值
var maxSlidingWindow = function(nums, k) {
    let res = [];// 存取对应的结果
    let qu = [];// 存取的是下标
    for(let i =0; i<nums.length; i++) {
        // 若队列不为空，且当前元素大于等于队尾所存下标的元素，则弹出队尾
        while(qu.length && nums[i]>=qu[qu.length - 1]) {//保证最大的值都是在qu[0]
            qu.pop();
        }
        qu.push(i);
        while(qu[0] <= i - k) {// 判断当前最大值（即队首元素）是否在窗口中，若不在便将其出队(i - k 等于最先的值的位置)
            qu.shift();
        }
        if(i >= k - 1) {// 超过了三个窗口值的话，就收集最大的qu[0]
            res.push(nums[qu[0]]);
        }
    }
    return res;
};