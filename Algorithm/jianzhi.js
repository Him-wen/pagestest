// 剑指offer
// 二维数组的查找
function Find(target, array) {
    // write code here
  // 从左下角开始算，大于目标的话 往上，小于的话往右
  let x = array.length - 1;
  let y = 0;
  while(x>=0 && y<=array[0].length) {
    if(array[x][y] === target) {
      return true;
    }else if(array[x][y] > target) {
      x--;
    } else {
      y++;
    }
  }
  return false;
}