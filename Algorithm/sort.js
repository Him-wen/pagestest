// 选择排序
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