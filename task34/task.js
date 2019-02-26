// 先制作平面，再制作单个div，调用制作指令模块，制作小指令块car
var direction = {
    UP: 0,
    RIG: 90,
    DOWN: 180,
    LEF: 270
};


(function() {
    // 制作表格控制台
    var controller = (function() {
        //制作平面
        function mkStage(stage) {
            //传入参数为DOM节点
            var i, j;
            // 创建一个新的空白的文档片段(存在于内存中，将子元素插入到文档片段时不会引起页面回流)
            var fragment = document.createDocumentFragment();
            for (i = 0; i < 10; i++) {
                for (j = 0; j < 10; j++) {
                    fragment.appendChild(createDiv()); //调用制作单个div
                }
            }
            // 把制作的文档片段加入stage平面中
            stage.appendChild(fragment);
            //调用初始化指令模块
            return mkAction(stage);
        }
        // 制作单个div
        function createDiv() {
            var oDiv = document.createElement("div");
            oDiv.className = "stage-block";
            return oDiv;
        }
        // 制作小指令块car
        function createCar(ox, oy, deg) {
            // document.createElement()不需要等文档加载就可以直接执行
            //oCar是一个DOM元素，可以直接调用style属性
            var oCar = document.createElement("div");
            oCar.className = "car-action";
            oCar.style.left = ox * 50 + 'px';
            oCar.style.top = oy * 50 + 'px';
            oCar.style.transform = "rotate(" + deg + "deg)";
            return oCar;
        }
        // 初始化指令块
        function mkAction(stage) {
            var ox = Math.floor(Math.random() * 10 + 0);
            var oy = Math.floor(Math.random() * 10 + 0);
            var deg = direction.UP;
            var elementB = createCar(ox, oy, deg);
            stage.appendChild(elementB);
            return { //把信息传递给pos对象，pos对象拥有这些属性
                x: ox,
                y: oy,
                direction: deg,
                element: elementB //连接DOM元素(必需)：DOM属性
                    //elementB=oCar，是DOM元素，把oCar赋值给element
            }
        }

        return (function() {
            //通过mkStage方法创建新对象pos，pos.element = oCar为DOM元素可以调用style
            var pos = mkStage(document.getElementById("stage"));
            //转换方向和移动
            function move(num) {
                switch (num) {
                    case '0':
                        if (pos.direction === 0 && pos.y !== 0) pos.y--;
                        else if (pos.direction === 90 && pos.x < 9) pos.x++;
                        else if (pos.direction === 180 && pos.y < 9) pos.y++;
                        else if (pos.direction === 270 && pos.x !== 0) pos.x--;
                        break;
                    case '1':
                        if (pos.x !== 0) pos.x--;
                        break;
                    case '2':
                        if (pos.y !== 0) pos.y--;
                        break;
                    case '3':
                        if (pos.x < 9) pos.x++;
                        break;
                    case '4':
                        if (pos.y < 9) pos.y++;
                        break;
                }

                //style属性是DOM属性，只能通过DOM属性调用，pos.element = oCar，对oCar进行设置
                pos.element.style.left = (pos.x * 50) + 'px';
                pos.element.style.top = (pos.y * 50) + 'px';
            }

            function transDirection(direc) {
                switch (direc) {
                    case 'lef':
                        pos.direction -= 90;
                        break;
                    case 'rig':
                        pos.direction += 90;
                        break;
                    case 'bac':
                        pos.direction += 180;
                        break;
                    case 'L':
                        pos.direction = direction.LEF;
                        break;
                    case 'T':
                        pos.direction = direction.UP;
                        break;
                    case 'R':
                        pos.direction = direction.RIG;
                        break;
                    case 'B':
                        pos.direction = direction.DOWN;
                        break;
                    default:
                        break;
                }
                pos.direction = (pos.direction % 360 + 360) % 360;
                console.log(pos.x, pos.y, pos.direction, "00000");
                pos.element.style.transform = "rotate(" + pos.direction + "deg)";
            }
            return {
                move: move,
                transDirection: transDirection
            }
        }())
    }());

    //使用对象关联风格委托实现
    var Role = {
        'GO' () {
            controller.move('0');
        },
        'TUN LEF' () {
            controller.transDirection('lef');
        },
        'TUN RIG' () {
            controller.transDirection('rig');
        },
        'TUN BAC' () {
            controller.transDirection('bac');
        },
        'TRA LEF' () {
            controller.move('1');
        },

        'TRA TOP' () {
            controller.move('2');
        },

        'TRA RIG' () {
            controller.move('3');
        },

        'TRA BOT' () {
            controller.move('4');
        },

        'MOV LEF' () {
            controller.move('1');
            controller.transDirection('L');
        },

        'MOV TOP' () {
            controller.move('2');
            controller.transDirection('T');
        },

        'MOV RIG' () {
            controller.move('3');
            controller.transDirection('R');
        },

        'MOV BOT' () {
            controller.move('4');
            controller.transDirection('B');
        }
    }

    //关联对象
    var role = Object.create(Role);
    //点击事件
    var txt = document.getElementById("command");
    var btn = document.getElementById("run");
    btn.addEventListener("click", function() {
        var stxt = txt.value;
        stxt = stxt.replace(/^\s+|\s+$/g, '').toUpperCase();
        Role[stxt] && Role[stxt]();
    });

    //测试按钮
    document.getElementById("btn-t1").addEventListener("click", function() {
        Role.GO();
    });
    document.getElementById("btn-t2").addEventListener("click", function() {
        Role["TUN LEF"]();
    });
    document.getElementById("btn-t3").addEventListener("click", function() {
        Role["TUN RIG"]();
    });
    document.getElementById("btn-t4").addEventListener("click", function() {
        Role["TUN BAC"]();
    });
    document.getElementById("btn-t5").addEventListener("click", function() {
        Role["TRA LEF"]();
    });
    document.getElementById("btn-t6").addEventListener("click", function() {
        Role["TRA TOP"]();
    });
    document.getElementById("btn-t7").addEventListener("click", function() {
        Role["TRA RIG"]();
    });
    document.getElementById("btn-t8").addEventListener("click", function() {
        Role["TRA BOT"]();
    });
    document.getElementById("btn-t9").addEventListener("click", function() {
        Role["MOV LEF"]();
    });
    document.getElementById("btn-t10").addEventListener("click", function() {
        Role["MOV TOP"]();
    });
    document.getElementById("btn-t11").addEventListener("click", function() {
        Role["MOV RIG"]();
    });
    document.getElementById("btn-t12").addEventListener("click", function() {
        Role["MOV BOT"]();
    });
}());