var buttons = document.getElementsByTagName("button");
var timer = null;
var lock = false;
var tt = document.getElementById("search");
var found = false;

//深度优先搜索
function DFSOrder(node, List) {
    let temp = null;
    (function DFS(node, List) {
        let p = null;
        if (node) {
            List.push(node);
            console.log(node);
            console.log("111");
            DFS(node.firstElementChild, List); //firstElementChild要选取 元素的节点才可以
            if (node.firstElementChild) {
                temp = node.firstElementChild.nextElementSibling;
                while (temp) {
                    p = temp;
                    DFS(temp, List);
                    temp = p.nextElementSibling;
                }
            }
        }
    })(node, List);
    searchText(List);
}
//广度优先搜索
function BFSOrder(node, List) {
    (function BFS(node, List) {
        let queue = [];
        let p = null;
        if (node) {
            queue.push(node);
        }
        while (queue.length > 0) {
            p = queue.shift(); //左侧弹出，用队列先进先出的思想 完成兄弟节点子孩子的遍历
            List.push(p);
            if (p.firstElementChild) { //选取div元素的节点
                queue.push(p.firstElementChild);
                p = p.firstElementChild; //搜索下一级，若缺少则会搜索同级兄弟节点，其他框架就会被搜索
                while (p.nextElementSibling) {
                    queue.push(p.nextElementSibling);
                    p = p.nextElementSibling;
                }
            }
        }
    })(node, List);
    searchText(List);
}
//正则表达式  以一个或多个空格为开始或结尾，替换所有空格为空
function trim(str) {
    return str.replace(/^\s+|\s+$/g, "");
}

//查找
function searchText(List) {
    if (tt.value !== "") {
        searchShow(List);
    } else {
        show(List);
    }
}

//查询结果展示  用出队的方式判断
var findNode = [];
var f = 0;

function searchShow(List) { //写的比较冗余，需要改进
    if (List.length === 0 && !found) {
        alert("没有找到！")
    }
    head = List.shift(); //出队
    if (head) {
        text = head.firstChild.nodeValue; //div中的 值   第一个div对应Supper
        if (trim(text) !== tt.value) {
            head.style.backgroundColor = "pink";
            timer = setTimeout(function() {
                head.style.backgroundColor = "#fff"; //1秒后节点的蓝色变为白色
                searchShow(List);
            }, 800);
        } else {
            head.style.backgroundColor = "blue";
            findNode.push(head);
            p = findNode.shift();
            found = true;
            timer = setTimeout(function() {
                head.style.backgroundColor = "#fff";
                p.style.backgroundColor = "blue"; //找到查找内容后继续向后查找是否还存在要查找的内容
                searchShow(List);
            }, 800);
        }
    }
}

//遍历块展示   通过数组展示结果
function show(List) {
    var i = 0;
    var len = List.length;
    List[i++].style.backgroundColor = "pink";
    lock = true;
    timer = setInterval(function() {
        if (i < len) {
            List[i - 1].style.backgroundColor = "white";
            List[i++].style.backgroundColor = "pink";
        } else {
            List[i - 1].style.backgroundColor = "white";
            lock = false;
            clearInterval(timer); //取消setInterval()设置的timeout暂停
        }
    }, 500);

}
//遍历选择
function order(orderIndex) {
    var treeNode = document.getElementById("root");
    var List = [];
    switch (orderIndex) {
        case 0:
            DFSOrder(treeNode, List);
            break;
        case 1:
            BFSOrder(treeNode, List);
            break;
    }
    // show(List);
}

function init() {
    for (var i = 0; i < buttons.length; i++) {
        (function(i) {
            buttons[i].onclick = function() {
                if (lock === true) {
                    alert("正在遍历中！");
                } else {
                    order(i);
                }
            };
        }(i));
    }
}
init();