/* 
 * addEventListener:监听Dom元素的事件 
 * 
 * target：监听对象 
 * type：监听函数类型，如click,mouseover 
 * func：监听函数 
 */
function addEventHandle(target, type, func) {
    if (target.addEvenListener) {
        target.addEvenListener(type, func);
    } else if (target.attachEvent) {
        target.attachEvent("on" + type, func); //IE不支持事件捕获
    } else {
        target["on" + type] = func; //事实上这种情况不会存在
    }
}

var bindEventBtn = document.getElementById("Btn");
bindEventBtn.addEventListener("click", Wopen); /*button事件监听*/

function Wopen() {
    window.onload;
    console.log(checked1.value, checked2.value, checked3.value, checked4.value, checked5.value);
    if (checked1.value === "1" && checked2.value === "1" && checked3.value === "1" && checked4.value === "1" && checked5.value === "1") {
        var mywin;
        mywin = window.open('file:///G:/git/task9/check_T.html', '_blank', 'width=600,height=300,top=100px,left=200px');
    } else {
        var mywin;
        mywin = window.open('file:///G:/git/task9/check_F.html', '_blank', 'width=600,height=300,top=100px,left=200px')
    }

}

checked1 = new Object();
checked2 = new Object();
checked3 = new Object();
checked4 = new Object();
checked5 = new Object();
checked1.value = "0";
checked2.value = "0";
checked3.value = "0";
checked4.value = "0";
checked5.value = "0";
//输入名称
function formatCheckName() {
    //使用value属性读取设置文本框的值
    var textbox = document.getElementById("name").value;
    //将汉字计算成两个字节的函数  正则表达式  最好不要改变原有的方法
    function lenB(textbox) {
        return textbox.replace(/[^\x00-\xff]/g, 'aa').length;
    }

    var realLength = lenB(textbox);
    //格式验证
    var mychar = document.getElementById("check-name");
    if (realLength === 0) {
        document.getElementById("name").style.borderColor = "red";
        mychar.innerHTML = "名称不能为空!";
        mychar.style.color = "red";
        checked1.value = "0";
    } else if (realLength > 16 || realLength < 4) {
        document.getElementById("name").style.borderColor = "red";
        mychar.innerHTML = "格式错误"; //重新获取value值
        mychar.style.color = "red";
        checked1.value = "0";
    } else {
        document.getElementById("name").style.borderColor = "green";
        mychar.innerHTML = "格式正确";
        mychar.style.color = "green";
        checked1.value = "1";
    }
};

//输入密码
function formatCheckPsw() {
    //使用value属性读取设置文本框的值
    var textbox = document.getElementById("psw").value;
    //将汉字计算成两个字节的函数  正则表达式  最好不要改变原有的方法
    function lenB(textbox) {
        return textbox.replace(/[^\x00-\xff]/g, 'aa').length;
    }

    var realLength = lenB(textbox);
    //格式验证
    var mychar = document.getElementById("check-psw");
    if (realLength === 0) {
        document.getElementById("psw").style.borderColor = "red";
        mychar.innerHTML = "密码不能为空!";
        mychar.style.color = "red";
        checked2.value = "0";
    } else if (realLength > 16 || realLength < 4) {
        document.getElementById("psw").style.borderColor = "red";
        mychar.innerHTML = "密码格式错误"; //重新获取value值
        mychar.style.color = "red";
        checked2.value = "0";
    } else {
        document.getElementById("psw").style.borderColor = "green";
        mychar.innerHTML = "密码可用";
        mychar.style.color = "green";
        checked2.value = "1";
    }
};

//密码确认
function formatCheckRepsw() {
    //使用value属性读取设置文本框的值
    var textbox_psw = document.getElementById("psw").value;
    var textbox_repsw = document.getElementById("repsw").value;

    //格式验证
    var mychar_repsw = document.getElementById("check-repsw");
    if (textbox_repsw === "") {
        document.getElementById("repsw").style.borderColor = "red";
        mychar_repsw.innerHTML = "不能为空!";
        mychar_repsw.style.color = "red";
        checked3.value = "0";
    } else if (textbox_repsw === textbox_psw) {
        document.getElementById("repsw").style.borderColor = "green";
        mychar_repsw.innerHTML = "密码一致";
        mychar_repsw.style.color = "green";
        checked3.value = "1";
    } else {
        document.getElementById("repsw").style.borderColor = "red";
        mychar_repsw.innerHTML = "密码不一致"; //重新获取value值
        mychar_repsw.style.color = "red";
        checked3.value = "0";
    }
};

//验证邮箱格式
function isEmail() {
    var textbox_Email = document.getElementById("Email").value;
    var mychar_email = document.getElementById("check-email")
    var myReg = /^[-_A-Za-z0-9]+@([-_A-Za-z0-9]+\.)+[A-Za-z0-9]{2,3}$/;
    if (myReg.test(textbox_Email)) {
        document.getElementById("Email").style.borderColor = "green";
        mychar_email.innerHTML = "邮箱格式正确";
        mychar_email.style.color = "green";
        checked4.value = "1";
    } else {
        document.getElementById("Email").style.borderColor = "red";
        mychar_email.innerHTML = "邮箱格式错误"; //重新获取value值
        mychar_email.style.color = "red";
        checked4.value = "0";
    }
};

//手机验证
function isTel() {
    var textbox_Tel = document.getElementById("Tel").value;
    var mychar_tel = document.getElementById("check-tel")
    var myReg = /^((13[0-9])|(15[1-3,5-9])|(17[7])|(18[0-9]))\d{8}$/;
    if (myReg.test(textbox_Tel)) {
        document.getElementById("Email").style.borderColor = "green";
        mychar_tel.innerHTML = "手机格式正确";
        mychar_tel.style.color = "green";
        checked5.value = "1";
    } else {
        document.getElementById("Tel").style.borderColor = "red";
        mychar_tel.innerHTML = "手机格式错误"; //重新获取value值
        mychar_tel.style.color = "red";
        checked5.value = "0";
    }
};

window.onload = function() {
    var input_name = document.getElementById("name");
    var mychar_name = document.getElementById("check-name")
    input_name.onfocus = function() {
        mychar_name.innerHTML = "必填，长度为4~16个字符"; //重新获取value值
        mychar_name.style.color = "gray";
    }
    input_name.onblur = function() {

        formatCheckName();
    }

    var input_psw = document.getElementById("psw");
    var mychar_psw = document.getElementById("check-psw")
    input_psw.onfocus = function() {
        mychar_psw.innerHTML = "必填，长度为4~16个字符"; //重新获取value值
        mychar_psw.style.color = "gray";
    }
    input_psw.onblur = function() {
        formatCheckPsw();
    }

    var input_repsw = document.getElementById("repsw");
    var mychar_repsw = document.getElementById("check-repsw")
    input_repsw.onfocus = function() {
        mychar_repsw.innerHTML = "再次输入相同密码"; //重新获取value值
        mychar_repsw.style.color = "gray";
    }
    input_repsw.onblur = function() {
        formatCheckRepsw();
    }

    var input_Email = document.getElementById("Email");
    var mychar_email = document.getElementById("check-email")
    input_Email.onfocus = function() {
        mychar_email.innerHTML = "必填"; //重新获取value值
        mychar_email.style.color = "gray";
    }
    input_Email.onblur = function() {
        isEmail();
    }

    var input_Tel = document.getElementById("Tel");
    var mychar_tel = document.getElementById("check-tel")
    input_Tel.onfocus = function() {
        mychar_tel.innerHTML = "必填"; //重新获取value值
        mychar_tel.style.color = "gray";
    }
    input_Tel.onblur = function() {
        isTel();
    }
}