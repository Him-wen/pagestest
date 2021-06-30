/**
 * @param {number[]} nums
 * @return {boolean}
 */
 // 分割等和子集 可以转化为背包问题
 // 给一个可装载重量为 sum / 2 的背包和 N 个物品，每个物品的重量为 nums[i]。现在让你装物品，是否存
 // 在一种装法，能够恰好将背包装满？
 var canPartition = function(nums) {
    let sum=0
    let n = nums.length
    for(let i=0;i<n;i++){
        sum+=nums[i]
    }
    if(sum%2!==0){
        // 如果能分割 必定是偶数
        return false
    }
    sum=sum/2
    // 定义dp数组
    // dp[i][j] = x 表示，对于前 i 个物品，当前背包的容量为 j 时，若 x 为 true，则说明可以恰好将背包装满，若 x 为 false，则说明不能恰好将背包装满
    // 最后结果是 dp[n][sum] 表示前n个能否把背包容量为sum的恰好装满
    // 前n个就是0...n-1
    // 这里用到dp[n]下标n===>对于数组长度就是n+1
    let dp= new Array(n+1).fill(0).map(() => new Array(sum + 1).fill(false))
    // base case 就是 dp[..][0] = true 和 dp[0][..] = false
    // 背包没有空间的时候，就相当于装满了
    // dp[0][..] = false 而当没有物品可选择的时候，肯定没办法装满背包
    for(let i=0;i<=n;i++){
       dp[i][0]=true
    }
    for(let i=1;i<=n;i++){
        let num=nums[i-1] // 前i个
        // 可以直接从1开始 因为j为0的情况 我们知道base case 减少一些循环
        for(let j=0;j<=sum;j++){
            // 背包容量不足，不能装入第 i 个物品
            if(j-num<0){
              // 这时候看前面i-1个是否把容量为j的背包恰好装满了
              dp[i][j] = dp[i - 1][j];
            } else {
               // 不装入背包或者装入
               // dp[i - 1][j-num]的含义是前i-1个把容量为j-num恰好装满了
               dp[i][j] = dp[i - 1][j] || dp[i - 1][j-num];
            }
        }
    }
    return dp[n][sum]
  };