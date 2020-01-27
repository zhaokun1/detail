// 导航条 左侧滚动事件
// 获得元素
$con = $('.contro .controls');  
// 容器
$contro = $('.contro'); 
// 声明最大值
var max = $con.length - 1;
// 声明信号量
var idx = 0;

// 声明定时器
var timer = setInterval(cycle, 3000);

// 封装处理事件
function cycle() {
    // 更改信号量
    idx++;
    // 移动
   /*  $contro.animate({top: -50 * idx}, 500,function() {
         // 判断是否到达猫腻图
         if (idx === max + 1) {
            // 瞬移到原图
            $contro.css('top', 0);
            // 改变信号量
            idx = 0;
        }
    });   */
    if (idx > max) {
        // 瞬移到原图
        $contro.css('top', 0);
        // 改变信号量
        idx = 1;
    }
    $contro.animate({top: -50 *idx},1000); 
}

