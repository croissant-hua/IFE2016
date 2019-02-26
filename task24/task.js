var buttons = document.getElementsByTagName("button");
var timer = null;
var lock = false;
var tt = document.getElementById("search");
var found = false;

window.onload = function() {

    //点击节点，显示被选中节点的样式
    var selectedDiv; //记录选中的节点
    var dd = document.getElementById("container").getElementsByTagName("div");
    let len = dd.length;
    for (let i = 0; i < len; i++) {
        dd[i].onclick = function(e) { //想在这里用箭头函数，但是箭头函数没有this，无法使用
            clearResult(); //清除原来已选中的，以及被包含在选中div中的子div
            this.style.backgroundColor = "#cd00cd";
            e.stopPropagation(); //阻止事件冒泡
            selectedDiv = this;
        };
    }

    //点击删除按钮，删除选中节点及其所有子节点
    document.getElementById("delete-btn").onclick = function() {
        if (selectedDiv === undefined) {
            alert("请选中要删除的节点");
        } else {
            var parent = selectedDiv.parentNode; //被选中节点的父节点
            parent.removeChild(selectedDiv);
        }
    };

    //点击添加按钮，在选中节点添加一个子节点
    document.getElementById("insert-btn").onclick = function() {

        var insertTxt = document.getElementById("insest-txt").value;

        if (insertTxt === "") {
            alert("请输入新增节点的内容！");
        } else if (selectedDiv === undefined) {
            alert("请选中要操作的节点");
        } else {
            var newNode = document.createElement("div");
            newNode.innerHTML = insertTxt; //把添加内容赋给节点
            newNode.style.borderColor = "#2b00ff";
            selectedDiv.appendChild(newNode); //添加新节点到选定节点中

            //更新点击事件
            dd = document.getElementById("container").getElementsByTagName("div");
            let len = dd.length;
            for (let i = 0; i < len; i++) {
                dd[i].onclick = function(e) { //想在这里用箭头函数，但是箭头函数没有this，无法使用
                    clearResult(); //清除原来已选中的，以及被包含在选中div中的子div
                    this.style.backgroundColor = "#cd00cd";
                    e.stopPropagation(); //阻止事件冒泡
                    selectedDiv = this;
                }
            }
        }
    };
}

function clearResult() {
    var allDiv = document.getElementsByTagName("div");
    for (let i = 0; i < allDiv.length; i++) {
        allDiv[i].style.backgroundColor = "#fff";
    }
    clearInterval(timer);
}

//深度优先搜索 先顺着firstElementChild 查询到底层
function DFSOrder(node, List) {
    let temp = null;
    (function DFS(node, List) {
        let p = null;
        if (node) {
            List.push(node);
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
//广度优先搜索  队列先进先出思想
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
        // case 0:
        //     break;
        // case 1:
        //     break;
        case 2:
            DFSOrder(treeNode, List);
            break;
        case 3:
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