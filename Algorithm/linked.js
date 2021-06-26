// 返回倒数第 k 个节点
var kthToLast = function(head, k) {
    if(!head || k === 0)return null;
    var fast = head;
    var slow = head;
    for(let i = 0; i< k-1; i++){
        if(fast.next)fast = fast.next;
    }
    while(fast.next !== null){
        fast = fast.next;
        slow = slow.next;
    }
    return slow.val;
};

// 删除排序链表中的重复元素
var deleteDuplicates = function(head) {
    if(!head)return null;
    var p = head;
    while(p && p.next) {
        if(p.val === p.next.val) {
            p.next = p.next.next;
        }else {
            p = p.next;
        }
    }
    return head;
};

// 合并两个有序链表
var mergeTwoLists = function(l1, l2) {
    if(!l1) return l2;
    else if(!l2) return l1;
    else if(l1.val < l2.val) {
        l1.next = mergeTwoLists(l1.next, l2);
        return l1;
    }else {
        l2.next = mergeTwoLists(l1, l2.next);
        return l2;
    }
};
var mergeTwoLists = function(l1, l2) {// 迭代
    let dummy = new ListNode(-1);
    let p = dummy;
    while(l1 && l2) {
        if(l1.val <= l2.val) {
            p.next = l1;
            l1 = l1.next;
        }else {
            p.next = l2;
            l2 = l2.next;
        }
        p = p.next;
    }
    if(!l1) {
        p.next = l2;
    } else {
        p.next = l1;
    }
    return dummy.next;
};

//环形链表
var hasCycle = function(head) {
    if(!head) return false;
    let p = head;
    let q = head;
    while(p && p.next) {
        p = p.next.next;
        q = q.next;
        if(p === q) {
            return true;
        }
    }
    return false;
};

//环形链表II
var detectCycle = function(head) {
    if(!head) return null;
    let fast = head;
    let slow = head;
    while(fast && fast.next) {
        fast = fast.next.next;
        slow = slow.next;
        if(fast === slow) {//到这一步和环形链表I是一致的
            var pre = head;//在前面步骤结束后（快慢指针相遇），从头放一个指针，和慢指针一起移动，相遇后就是入环点
            while(pre!==slow) {
                pre = pre.next;
                slow = slow.next;
            }
            return pre;
        }
    }
    return null;
};

// 相交链表
// 两个链表同时向下移动，如果为空了，则移到另一个链表上，如果相遇，则就是相交节点这是因为相交后链表后的元素都是一样的，所以我们要把尾部对齐，a+b和b+a后长度就是一致的，这样就能从尾部对齐元素了。而最多指针也只是会走a+b的长度，之后两者都是空从而退出了循环。
var getIntersectionNode = function(headA, headB) {
    let a = headA;
    let b = headB;
    while(a != b) {
        if(a) {
            a = a.next;
        }else{
            a = headB;
        }
        if(b) {
            b = b.next;
        }else {
            b = headA;
        }
    }
    return a;
};

//反转链表（迭代和递归两种）
var reverseList = function(head) {
    if(!head) return null;
    let cur = head;//当前节点
    let ne = head.next;//当前节点的下一个节点
    head.next = null;//将头节点指向null
    while(ne) {//不为空进行循环
        let temp = ne.next;
        ne.next = cur;//翻转节点
        cur = ne;//向后移动一位
        ne = temp;
    }
    return cur;
};

// 回文链表
var isPalindrome = function(head) {
    if(!head) return true;
    // 获取中间的节点
    let fast = head;
    let slow = head;
    while(fast && fast.next) {
        fast = fast.next.next;
        slow = slow.next;
    }
    let left = head;
    // 获取翻转后的链表
    let right = reserves(slow);
    // 比较是否相同
    while(right) {
        if(right.val != left.val) {
            return false;
        }
        right = right.next;
        left = left.next;
    }
    return true;
};
    // 翻转链表函数
var reserves = function(head) {
    let pre = null;
    let cur = head;
    while(cur) {
        let ne = cur.next;
        cur.next = pre;
        pre = cur;
        cur = ne;
    }
    return pre;
}

// 反转链表II
var reverseBetween = function(head, left, right) {
    if(!head)return null;
    const vim = new ListNode(-1);
    vim.next = head;// 虚拟节点 便于返回
    let leftnode = vim;// 从虚拟节点开始算
    for(let i =0; i < left-1; i++) {// 走left-1步
        leftnode = leftnode.next;// 到达待翻转节点的前一个节点
    }
    let rightnode = leftnode;// 从待翻转节点开始
    for(let i =0; i < right-left+1; i++) {
        rightnode = rightnode.next;// 到达待翻转节点的最后一个节点
    }
    // 将待翻转链表给切出来
    let leftx = leftnode.next;// 待翻转链表的开始
    let rightx = rightnode.next;// 待翻转节点的下一个 先记录一下

    leftnode.next = null;// 当为1的时候
    rightnode.next = null;// 当为4的时候

    reserves(leftx);

    leftnode.next = rightnode;// 将断开的链接接上
    leftx.next = rightx;
    return vim.next;
};

var reserves = function(head) {// 反转链表函数
    let pre = null;
    let cur = head;
    while(cur) {
        let ne = cur.next;
        cur.next = pre;
        pre = cur;
        cur = ne;
    }
    return pre;
}

