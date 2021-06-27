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