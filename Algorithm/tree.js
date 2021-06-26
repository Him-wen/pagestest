// 前序遍历
// 迭代 中左右
var preorderTraversal = function(root) {
    if(!root) return [];
    let res = [];
    let stk = [];
    stk.push(root);
    while(stk.length) {
        let p = stk.pop();
        res.push(p.val);
        if(p.right) {
            stk.push(p.right);// 将当前的插入节点的左右节点添加起来，注意不是整棵树
        }
        if(p.left) {
            stk.push(p.left);
        }
    }
    return res;
};

//中序遍历
//递归
var inorderTraversal = function(root) {
    let res = [];
    let dfs = function(root) {
        if(!root) return [];
        dfs(root.left);
        res.push(root.val);
        dfs(root.right);
    }
    dfs(root);
    return res;
};
//迭代
var inorderTraversal = function(root) {
    let res = [];
    let stk = [];
    let p = root;
    while(p || stk.length) {
        while(p) {//1
            stk.push(p);
            p=p.left;// p从当前的节点 转到左节点，如果左节点不为空，就一直到stk里面
        }
        p = stk.pop();// 取出最上面的节点，加入到res中
        res.push(p.val);
        p = p.right;// 当p的右节点 为空的话 就跳过 1 步骤，执行 p=stk.pop(),然后再继续操作
    }
    return res;
};

// 后序遍历 头节点最先弹出去
var postorderTraversal = function(root) {
    if(!root) return [];
    let res = [];
    let stk = [];
    stk.push(root);
    while(stk.length) {// 中右左 翻转变成 左右中
        let p = stk.pop();
        res.push(p.val);
        if(p.left) {
            stk.push(p.left);
        }
        if(p.right) {
            stk.push(p.right);
        }
    }
    return res.reverse();
};

// 层序遍历
var levelOrder = function(root) {
    if(!root) return [];
    let res = [];
    let qu = [];
    qu.push(root);
    while(qu.length) {
        let len = qu.length;
        let link = [];
        for(let i = 0; i<len; i++) {// 循环每一层个数
            let p = qu.shift();
            link.push(p.val);
            if(p.left)qu.push(p.left);
            if(p.right)qu.push(p.right);
        }
        res.push([...link]);// 将每一层加入到res
    }
    return res;
};
