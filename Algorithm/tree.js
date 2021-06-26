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
