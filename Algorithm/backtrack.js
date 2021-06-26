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