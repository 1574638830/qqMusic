// 匿名方法的调用 是初始化jquery对象的惯用方法  调用函数时，是在函数后面写上括号和实参的
// 只要创建了一个新函数，就会根据一组特定的规则为该函数创建一个prototype 原型属性，默认情况下prototype属性会默认获得一个constructor(构造函数)属性，
(function(window){
    // 创造一个函数  // 每一个函数内部 prototype(原型函数) 等同于 对象内部__proto__
    function Progress($progress_bar,$progress_line,$progress_circle){
        // 返回构造的新函数
        return new Progress.prototype.init($progress_bar,$progress_line,$progress_circle);
    }
    // 函数创建
    Progress.prototype = {
        // constructor(构造函数)属性 指向
        constructor:Progress,
        // init函数 init核心函数
        init:function($progress_bar,$progress_line,$progress_circle){
            this.$progress_bar = $progress_bar;
            this.$progress_line = $progress_line;
            this.$progress_circle = $progress_circle;
            // console.log(this.$progress_line);
        }, 
        // 定义一个属性
        initPlay:false,
        // 进度条背景点击事件
        progressClick:function(Callback){
            // 赋值 当前上面this 当前的元素 上面获取的三个元素
            var $this = this;
            // 点击事件
            this.$progress_bar.click(function(event){
                // firefox下window.event为null, IE下event为null
                var event = event || window.event; 
                // 获取元素距离屏幕左边的尺寸 值为固定的初始位置
                var $normaleft = $(this).offset().left;
                // 获取元素内部距离屏幕左侧 非固定值
                var barleft = event.pageX;
                // 总和
                var line_width = barleft - $normaleft;
                // 判断 当前进度条避免超出
                var line_maxwidth = $this.$progress_bar.width() - $this.$progress_circle.width();
                // 判断点击的值不大于
                if(line_width >= line_maxwidth){
                    // 大于则最大宽度 等于 当前的值
                    line_width = line_maxwidth;
                }
                // 背景颜色宽度增长
                $this.$progress_line.css("width",line_width + "px");
                // 小圆点事件
                $this.$progress_circle.css("left",line_width + "px")
                // 点击比例
                var value = line_width / $(this).width();
                // 回调函数
                Callback(value);
            })
        },
        // 加on是在点击事件的时候自动触发。
        // 不加on需要手动注册click事件，比如$("#btn1").click=function(){}
        // event代表事件的状态，例如触发event对象的元素、鼠标的位置及状态、按下的键等等
        // 圆点滑动事件 
        progressMove:function(Callback){
            // 赋值 当前上面this 
            var $this = this;
            // 获取元素距离屏幕左边的尺寸 值为固定的
            var $normalLeft = $this.$progress_bar.offset().left;
            // 获取背景宽度
            var $barWidth = $this.$progress_bar.width();
            // 小圆点宽度
            var $circleWidth = $this.$progress_circle.width();
            // event 事件 获取到 离屏幕左侧 非固定值
            var Movebarleft;
            // 定义一个属性值
            var nomove;
            // 鼠标按下事件
            this.$progress_circle.mousedown(function(){
                // 点击当前值变为真
                $this.initPlay = true;
                // 提高用户体验 增加页面触摸事件
                $(document).mousemove(function(event){
                    // firefox下window.event为null, IE下event为null
                    var event = event || window.event;
                    // 获取元素内部距离屏幕左侧 非固定值
                    Movebarleft = event.pageX;
                    // console.log(Movebarleft);
                    // 元素的总值减去元素左边距离
                    var sum = Movebarleft - $normalLeft;
                    // 因左边sum的求和最小为0  barleft - normaleft 等于0 
                    // 判断 当前进度条避免超出
                    var $progress_width = $barWidth - $circleWidth;
                    // 判断 
                    if(sum < 0){
                        // 小于0 则 等于0 
                        sum = 0;
                    }else if(sum >= $progress_width){
                        // 大于背景最大宽度 则等于
                        sum = $progress_width;
                    }
                    // 进行判断
                    // 背景颜色宽度增长
                    $this.$progress_line.css("width",sum + "px");
                    // 小圆点事件
                    $this.$progress_circle.css("left",sum + "px"); 
                    // 当前移动完为1
                    $this.nomove = 1;
                })
            });
            // 鼠标抬起事件
            $(document).mouseup(function(event){
                // 当前鼠标离开 移出按下事件 mouseup 如需添加只运行一次的事件然后移除
                $(document).off("mousemove");
                // // 重新赋值
                $this.initPlay = false;
                // // 元素的总值减去元素左边距
                if($this.nomove == 1){
                    // 传参
                    var value = (Movebarleft - $normalLeft) / $this.$progress_bar.width();
                    //  回调函数
                    Callback(value); 
                }
                // 每次点击 + 1  需要点击元素进行赋值处理
                $this.nomove += 1;
            })
        },
        // 进度条同步播放效果
        progressAaima:function(progress){
            // 检测判断 当前为true 不执行 为false则继续执行
            if(this.initPlay == true) return;
            // console.log(this.initPlay);
            // 前景部分 宽度增加
            this.$progress_line.css({width : progress+"%"})
            // 小圆点部分
            this.$progress_circle.css({left : progress+"%"})
        }
    }
    // 主函数的核心函数下init核心函数 赋值 主函数 核心函数
    Progress.prototype.init.prototype = Progress.prototype;
    // 内部变量赋值给为 外部变量 调用
    window.Progress = Progress;
})(window)