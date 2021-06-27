// 选择排序
// 思路：每一轮选取未排定的部分中最小的部分交换到未排定部分的最开头，经过若干个步骤，就能排定整个数组。即：先选出最小的，再选出第 2 小的，以此类推。
var sortArray = function(nums) {
    let len = nums.length;
    for(let i = 0; i<len ; i++) {
        let minIndex = i;// 先选一个
        for(let j = i+1; j<len; j++) {
            if(nums[j] < nums[minIndex]) {
                minIndex = j;//有比之前小的，就直接复制给最小的
            }
        }
        let temp = nums[i];//最小的 和最开始的一个数字 交换，每次排好序一个
        nums[i] = nums[minIndex];
        nums[minIndex] = temp;
    }
    return nums;// 返回原来的数组
};

// 快速排序
var sortArray = function(nums) {
    const dfs = function(left, right) {
        if(left >= right) return;
            let mid = nums[left];
            let p = left + 1;
            let q = right;
            while(p <= q) {
                while(p <= q && nums[p] < mid) p++;
                while(p <= q && nums[q] >mid) q--;
                if(p <= q) {// 需要交换的操作
                [nums[p], nums[q]] = [nums[q], nums[p]];
                p++;
                q--;
                }
            }
        [nums[left], nums[q]] = [nums[q], nums[left]];// 将mid 和q的节点交换，再进行递归操作
        
        
        dfs(left, q-1);
        dfs(q+1, right);
    }
    dfs(0, nums.length - 1);
    return nums;
};

// 归并排序
var sortArray = function(nums) {
    const dfs = function(left, right) {
        if(left >= right) return;
        let mid = left + right >> 1;// 取中点
        dfs(left, mid);// 先递归 再归并
        dfs(mid + 1, right);
        // 归并过程
        let temp = [];
        let k = 0;
        let i = left, j =mid + 1;// 从两端的起点开始
        while(i <= mid && j <= right) {// 按大小的排序过程
            temp[k++] = nums[i] < nums[j] ? nums[i++] : nums[j++];
        }
        while(i <= mid) temp[k++] = nums[i++];
        while(j <= right) temp[k++] = nums[j++];

        for(let i = 0; i < k; i++) {// 将temp里面的数据 放到nums里面
            nums[i + left] = temp[i];
        }
    }
    dfs(0, nums.length - 1);
    return nums;
};