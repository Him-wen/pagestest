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

