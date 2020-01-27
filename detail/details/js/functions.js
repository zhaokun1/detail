/* 
    page:用于获得元素到页面之间的距离
    dom: 要获得的指定元素
    返回值: 一个对象，两个属性，left为到页面左边的距离，top为到页面上面的距离
*/
function page(dom) {
    var obj = {
        top: 0,
        left: 0
    };
    // 判断父元素是不是body
    if (dom.offsetParent == document.body) {
        obj.top = dom.offsetTop;
        obj.left = dom.offsetLeft;
    } else {
        // 区分浏览器
        if (window.navigator.userAgent.indexOf('MSIE 8.0') != -1) {
            // 子元素到页面的距离 = 子元素到父元素的距离  + 父元素到页面的距离
            // 找到了，IE8浏览器 不需要加上父元素的border
            obj.top = dom.offsetTop + page(dom.offsetParent)['top'];
            obj.left = dom.offsetLeft + page(dom.offsetParent)['left'];
            
        } else {
            // 子元素到页面的距离 = 子元素到父元素的距离 + 父元素的边框 + 父元素到页面的距离
            // 没找到，高级浏览器 需要加上父元素的border
            obj.top = dom.offsetTop + dom.offsetParent.clientTop + page(dom.offsetParent)['top'];
            obj.left = dom.offsetLeft + dom.offsetParent.clientLeft + page(dom.offsetParent)['left'];   
        }
    }

    return obj;
    
}

/*
    绑定事件
*/ 
function bindEvent(dom, type, fn) {
    // 判断为那种浏览器
    if (dom.addEventListener) {
        // 高级浏览器
        // 区分滚轴事件
        if (window.navigator.userAgent.indexOf('Firefox') != -1 && type == 'mousewheel') {
            // 浏览器为火狐，且事件为滚轴事件 mousewheel，将值更改为DOMMouseScroll
            type = 'DOMMouseScroll';
        }
        dom.addEventListener(type, fn);
    } else if (dom.attachEvent) {
        // IE浏览器
        dom.attachEvent('on' + type, fn);
    } else {
        // 低版本浏览器
        dom['on' + type] = fn;
    }
}

/* 
    移除事件 removeEvent(dom, type, fn)
*/
function removeEvent(dom, type, fn) {
    // 判断为那种浏览器
    if (dom.removeEventListener) {
        // 高级浏览器
        dom.removeEventListener(type, fn);
    } else if (dom.detachEvent) {
        // IE浏览器
        dom.detachEvent('on' + type, fn);
    } else {
        // 低版本浏览器
        dom['on' + type] = null;
    }    
}

/* 
    判断滚轴方向
    参数： 对象 e 表示事件对象
    返回值：bool值
        true：向上
        false: 向下
*/
function getDirection(e) {
    // 火狐浏览器判断e.detail, 非火狐判断e.wheelDelta
    // 方向的判断
    if (e.wheelDelta) {
        return e.wheelDelta > 0 ? true: false;
    } else {
        return e.detail > 0 ? false: true;
    }
}
/* 
    自定义animate函数
    dom:参加动画的元素对象
    obj：动画的样式--json对象
    time:过渡时间
    fn:动画执行结束的回调函数
*/
function animate(dom, obj, time, fn) {
    /* 
        实现动画：将目标值分成小段时间完成
    */
    // 设置步距时间
    var stepTime = 10;
    // 求得总次数
    var total = time / stepTime;
    // 设置信号量
    var idx = 0;
    // 声明两个对象
    var startObj = {};
    var stepObj = {};
    // 样式的差值进行等分，分成total份
    for (var i in obj) {
        // 目标的样式值为 obj[i];
        startObj[i] = parseFloat(getComputedStyle(dom)[i]);
        stepObj[i] = (parseFloat(obj[i]) - startObj[i]) / total;

    }
    // 设置周期执行函数
    var timer = setInterval(function() {
        // 改变信号量
        idx++;
        // 每stepTime改变一次css样式
        for (var i in startObj) {
            dom.style[i] = startObj[i] + stepObj[i] * idx + 'px';
        }


        // 判断边界
        if (idx === total) {
            // 判断fn是否存在，如果存在则执行
            fn && fn();
            // 清除定时器
            clearInterval(timer);
        }
    }, stepTime);
}
