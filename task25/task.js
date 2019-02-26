//===================封装TreeNode=================================================

function TreeNode(obj) { //用构造函数 进行 封装  ES中没有类
    this.parent = obj.parent;
    this.childs = obj.childs || [];
    this.data = obj.data || [];
    this.selfElement = obj.selfElement; //访问对应的DOM结点
    this.selfElement.TreeNode = this; //对应的DOM结点 访问回来
}

TreeNode.prototype = { //原型  （重写默认的prototype）
    constructor: TreeNode, //指针   设置指向适当的值
    // 减少代码间不必要的依赖耦合关系
    //解耦样式操作，四个参数表示箭头、可见性、改为高亮、改为普通
    render(arrow, visibility, toHighlight, deHighlight) {
        if (arguments.length < 3) { //输入参数
            toHighlight = false;
            deHighlight = false;
        }

        if (arrow) { //设置箭头方向
            if (this.isLeaf()) { //为叶结点，设为空箭头
                this.selfElement.getElementsByClassName("arrow")[0].className = "arrow empty-arrow";
            } else if (this.isFold()) { //折叠状态，设置右箭头
                this.selfElement.getElementsByClassName("arrow")[0].className = "arrow right-arrow";
            } else { //打开状态，设置向下箭头
                this.selfElement.getElementsByClassName("arrow")[0].className = "arrow down-arrow";
            }
        }
        if (visibility) { //设置可见性
            if (this.selfElement.className.indexOf("nodebody-visible") == -1) {
                //不可见，改为可见    用visible 替换 hiddle
                this.selfElement.className = this.selfElement.className.replace("hidden", "visible");
            } else { //可见，改为不可见 用hidden 替换 visible
                this.selfElement.className = this.selfElement.className.replace("visible", "hidden");
            }
        }
        if (toHighlight) { //设置特殊格式
            this.selfElement.getElementsByClassName("node-title")[0].className = "node-title node-title-Highlight";
        }
        if (deHighlight) { //取消特殊格式
            this.selfElement.getElementsByClassName("node-title")[0].className = "node-title";
        }
    },
    //删除结点   要在DOM结点上进行删除
    deleteNode() {
        // 当前this为树结点
        var deletenode = this.selfElement; //根据传过来的树结点 找到 对应的DOM结点
        var parentNode = deletenode.parentNode;
        parentNode.removeChild(deletenode); //移除对应的DOM结点
        let len = this.parent.childs.length; //树中 父结点删除子节点
        for (let i = 0; i < len; i++) {
            if (this.parent.childs[i] === this) {
                this.parent.childs.splice(i, 1);
                break;
            }
        }
        //调整父结点的箭头样式
        this.parent.render(true, false);
    },
    //添加结点
    addNode(text) {
        if (text === null) {
            return this;
        } else if (text.trim() === "") {
            alert("节点内容不能为空！");
            return this;
        }
        //设置样式
        //先增加子节点，再渲染自身样式
        //若当前结点折叠，将其展开   将要添加的结点放到准确的位置
        if (!this.isLeaf() && this.isFold()) {
            this.toggleFold();
        }
        //创建元素
        var newNode = document.createElement("div");
        var newHeader = document.createElement("lable");
        var newArrow = document.createElement("div");
        var newTitle = document.createElement("span");
        var newAdd = document.createElement("img");
        var newDelete = document.createElement("img");
        //添加样式
        newNode.setAttribute('class', 'nodebody-visible');
        newHeader.setAttribute('class', 'node-header');
        newArrow.setAttribute('class', 'arrow empty-arrow');
        newTitle.setAttribute('class', 'node-title');
        newTitle.innerHTML = text;
        newAdd.setAttribute('class', 'addIcon');
        newAdd.src = "image/add.png";
        newDelete.setAttribute('class', 'deleteIcon');
        newDelete.src = "image/delete.png";
        //添加分支
        newHeader.appendChild(newArrow);
        newHeader.appendChild(newTitle);
        newHeader.appendChild(newAdd);
        newHeader.appendChild(newDelete);
        newNode.appendChild(newHeader);
        this.selfElement.appendChild(newNode); //将新创建的结点加入DOM
        //创建对应的TreeNode对象并添加到子节点队列
        this.childs.push(new TreeNode({ parent: this, childs: [], data: text, selfElement: newNode }));
        //渲染自身样式
        this.render(true, false);
        return this; //返回自身，以便链式操作
    },
    //展开、收拢结点
    toggleFold() {
        if (this.isLeaf()) return this;
        //改变所有子节点的可见状态
        let len = this.childs.length;
        for (let i = 0; i < len; i++) {
            this.childs[i].render(false, true);
        }
        //渲染本节点的箭头
        this.render(true, false);
        return this; //返回自身，以便链式操作
    },
    //判断是否为叶结点
    isLeaf() {
        return this.childs.length == 0; //返回布尔值
    },
    //判断结点是否处于折叠状态
    isFold() {
        if (this.isLeaf()) return false; //叶结点，返回false
        //从div开始是第一个孩子，lable包含在div下，与div连接在一起
        if (this.childs[0].selfElement.className === "nodebody-visible") return false;
        return true;
    }
};

//==============================以上是封装TreeNode代码==================================


//=================================事件绑定区=========================================
//创建根节点对应的TreeNode对象
var root = new TreeNode({
    parent: null,
    childs: [],
    data: "目录",
    selfElement: document.getElementsByClassName("nodebody-visible")[0]
});

//为root绑定事件代理，处理所有结点的点击事件 
//addEvent给一个标签添加多个事件，并且之前的不会被覆盖掉  onclick会覆盖之前的
//addEventListener 给对象添加事件，不能给元素添加
addEvent(root.selfElement, "click", function(e) {
    //事件源，捕获当前事件作用的对象 srcElement在IE下支持 e.target在Firefox下支持
    var target = e.target || e.srcElement;
    var domNode = target;
    while (domNode.className.indexOf("nodebody") == -1) { //判断某个元素是否有指定的class名，若要检索的字符串没有出现，返回-1
        domNode = domNode.parentNode; //找到类名含有nodebody的DOM结点
    }
    selectedNode = domNode.TreeNode; //获得DOM对象对应的TreeNode对象   这样就可以调用原型中的方法
    //如果点击在结点文字或者箭头上
    if (target.className.indexOf("node-title") != -1 || target.className.indexOf("arrow") != -1) {
        selectedNode.toggleFold(); //触发折叠、收拢操作
    } else if (target.className === "addIcon") {
        selectedNode.addNode(prompt("请输入要添加的文件名称：")); //添加操作
    } else if (target.className === "deleteIcon") {
        selectedNode.deleteNode(); //删除操作
    }
});

// alert() 弹出个提示框 （确定） 
// confirm() 弹出个确认框 （确定，取消） 
// prompt() 弹出个输入框 让你输入东西

//给root绑定广度优先搜索函数，无需访问DOM。返回一个搜索结果队列
root.search = function(titletxt) {
    let List = [];
    let queue = []; //暂存数组
    let current = this;
    queue.push(current);
    while (queue.length > 0) {
        current = queue.shift();
        //还原当前结点颜色
        current.render(false, false, false, true);
        if (current.data === titletxt) List.push(current);
        //将当前结点的所有子孩子结点加入“待访问”队列
        for (let i = 0; i < current.childs.length; i++) {
            queue.push(current.childs[i]);
        }
    }
    return List;
};


//搜索并显示结果
addEvent(document.getElementById("search"), "click", function() {
    let txt = document.getElementById("search-txt").value.trim(); //清除空格后的值
    if (txt === "") {
        alert("请输入要查询的内容！")
        return;
    }
    //搜索
    let List = root.search(txt);
    let len = List.length;
    if (len === 0) {
        document.getElementById("show-result").innerHTML = "未找到要查询的内容！";
    } else {
        document.getElementById("show-result").innerHTML = "查询到" + len + "个符合条件的结点！";
        //将查询到的结点 展开 并设置为 特殊样式
        var pathNode;
        for (let i = 0; i < len; i++) {
            pathNode = List[i];
            pathNode.render(false, false, true, false);
            while (pathNode.parent !== null) { //若是折叠状态，打开
                if (pathNode.selfElement.className === "nodebody-hidden") pathNode.parent.toggleFold();
                pathNode = pathNode.parent;
            }
        }
    }
});

//清除搜索结果
addEvent(document.getElementById("clear"), "click", function() {
    document.getElementById("search-txt").value = "";
    root.search(null); //取消特殊样式
    document.getElementById("show-result").innerHTML = "";
});

//==============================以上是事件绑定区==============================

//==============================Demo展示区===================================
//动态生成Demo树
root.addNode("前端技术").addNode("IT公司").addNode("进阶");
root.childs[0].addNode("HTML").addNode("CSS").addNode("Javascript").addNode("Node.js").toggleFold();
root.childs[0].childs[0].addNode("HTML5").toggleFold();
root.childs[0].childs[1].addNode("CSS3").toggleFold();
root.childs[1].addNode("百度").addNode("腾讯").addNode("阿里").toggleFold();
root.childs[1].childs[2].addNode("蚂蚁金服").toggleFold();
root.childs[2].addNode("Vue.js").toggleFold();

//===========================================================================

//跨浏览器兼容

function addEvent(element, type, handler) {
    if (element.addEventListener) {
        element.addEventListener(type, handler);
    } else if (element.attachEvent) {
        element.attachEvent("on" + type, handler);
    } else {
        element["on" + type] = handler;
    }
}