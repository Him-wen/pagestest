// 组合 给定两个整数 n 和 k，返回 1 ... n 中所有可能的 k 个数的组合。
var combine = function(n, k) {
    let res = [];
    let link = [];
    if(n<=0 || k<=0) {
        return res;
    }

    const dfs = function(startIndex) {
        if(link.length === k) {
            res.push([...link]);
            return;
        }
        for(let i = startIndex; i <= n; i++) {
            link.push(i);
            dfs(i+1);
            link.pop();
        }
    }
    dfs(1);
    return res;
};

// 组合总和
var combinationSum = function(candidates, target) {
    let res = [];
    let link = [];
    
    const dfs = function(target, start) {
        if(target === 0) {
            res.push([...link])
          return;
        }
        if(target < 0)return;
        for(let i=start;i<candidates.length;i++) {// start是为了 没有重复的组合
            link.push(candidates[i]);
            dfs(target-candidates[i],i);
            link.pop();
        } 
    }
    dfs(target,0);
    return res;
};

//组合总和III找出所有相加之和为 n 的 k 个数的组合。组合中只允许含有 1 - 9 的正整数，并且每种组合中不存在重复的数字。
var combinationSum3 = function(k, n) {
    let res = [];
    let link = [];
    let sum = 0;
    if(k<=0 || n<=0)return res;

    const dfs = function(startIndex) {
        if(link.length === k) {
            if(sum === n) res.push([...link]);// 总和相等才收集到集合里面
            return;
        }
        for(let i=startIndex; i<=9; i++) {// 循环次数是9次
            link.push(i);
            sum += i;
            dfs(i+1);
            sum -= i;
            link.pop();
        }
    }
    dfs(1);
    return res;
};

// 电话号码的字母组合：和之前的区别是：这个是不同集合的组合
var letterCombinations = function(digits) {
    let res= [];
    let str = [];
    let map = { '2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl', '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz' };// 映射关系
    if(!digits.length)return res;

    const dfs = function(index) {
        if(index === digits.length) {
            res.push(str.join(''));// 将数组变成字符串
            return;
        }

        let dic = map[digits[index]];// 获取index为1 的第一位数字 比如2，对应的abc
        for(let i=0; i<dic.length; i++) {
            str.push(dic[i]);// str = [a,b,c]
            dfs(index+1);
            str.pop();
        }
    }
    dfs(0);
    return res;
};