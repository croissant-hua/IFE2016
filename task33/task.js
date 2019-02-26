// // 添加指令块   追加样式（添加一个新的class）不覆盖原来的样式
// var dom1 = document.getElementsByClassName("grid-56")[0].classList.add("blk");

// 定义方向对象字面量
var direction = {
    UP: 0,
    DOWN: 180,
    LEF: 270,
    RIG: 90
}

// 定义类
class Role {
    // 定义构造函数   ----不要有拼写错误
    constructor(element) {
        this.direction = direction.UP;
        this.x = 6;
        this.y = 7;
        this.element = element;
        this.element.moveTo(this.x, this.y);
    }

    // 定义原型上的方法(指令操作)
    instGo() {
        switch (this.direction) {
            case direction.UP:
                this.y -= 1;
                if (this.y < 0) this.y = 0;
                break;
            case direction.DOWN:
                this.y += 1;
                if (this.y > 9) this.y = 9;
                break;
            case direction.RIG:
                this.x += 1;
                if (this.x > 9) this.x = 9;
                break;
            case direction.LEF:
                this.x -= 1;
                if (this.x < 0) this.x = 0;
                break;
            default:
                console.log("unknown direction:" + this.direction);
        }
        this.element.moveTo(this.x, this.y);
    }

    instTUNLEF() {
        this.direction -= 90;
        //保证与direction对应在0~360范围内
        this.direction = (this.direction % 360 + 360) % 360;
        this.element.transform(this.direction);
    }

    instTUNRIG() {
        this.direction += 90;
        this.direction = (this.direction % 360 + 360) % 360;
        this.element.transform(this.direction);
    }

    instTUNBAC() {
        this.direction += 180;
        this.direction = (this.direction % 360 + 360) % 360;
        this.element.transform(this.direction);
    }
}


window.onload = function() {

    // 定义颜色格子
    var roledom = document.getElementById("colorblk");

    roledom.moveTo = function(x, y) { //相对父元素位置移动
        this.style.top = (y * 50) + 'px';
        this.style.left = (x * 50) + 'px';
    }

    roledom.transform = function(deg) { //旋转方向
        this.style.transform = "rotate(" + deg + "deg)";
    }

    var role = new Role(roledom);


    var btn = document.getElementById("run");
    btn.onclick = function() {
        // 点击之后 获取text内容
        var text = document.getElementById("command").value;

        if (text.trim() === "GO") {
            role.instGo();
        } else if (text.trim() === "TUN LEF") {
            role.instTUNLEF();
        } else if (text.trim() === "TUN RIG") {
            role.instTUNRIG();
        } else if (text.trim() === "TUN BAC") {
            role.instTUNBAC();
        }
    };
}