// 匿名方法的调用 是初始化jquery对象的惯用方法  调用函数时，是在函数后面写上括号和实参的
// 只要创建了一个新函数，就会根据一组特定的规则为该函数创建一个prototype 原型属性，默认情况下prototype属性会默认获得一个constructor(构造函数)属性，
(function(window){
    // 创造一个函数  // 每一个函数内部 prototype(原型函数) 等同于 对象内部__proto__
    function lyrictext(path){
        // 返回构造的新函数
        return new lyrictext.prototype.init(path);
    }
    // 函数创建
    lyrictext.prototype = {
        // constructor(构造函数)属性 指向
        // constructor 是一种用于创建和初始化class创建的对象的特殊方法。
        constructor:lyrictext,
        // init函数 接受属性的值
        init:function(path){
            this.path = path;
        },
        times:[],
        lyrics:[],
        index:-1,
        // 加载歌词函数
        loadText:function(Callback){
            // 赋值 
            var $this = this;
            $.ajax({
                // 链接json文件
                url:$this.path,
                // 定义数据类型
                dataType:"text",
                // 加载成功执行
                success:function(data){      
                    // console.log(data);
                    // 每个属性都是一个方法
                    $this.playLyric(data);
                    Callback();
                    // console.log(this.times);
                },
                // 加载错误执行
                error:function(event){
                    console.log(event);
                },
            })
        },
        playLyric:function(data){
            var $this = this;
            // 一定要清空上一首歌曲的歌词和时间 避免累加
            $this.times = [];
            $this.lyrics = [];
            // typeof() 类型信息当作字符串返回，包括有大家常有变量类型。
            // console.log(typeof(data));
            // split() 方法用于把一个字符串  分割成字符串数组。
            var arrat = data.split('\n');
            // 创建一个正则表达式 http://www.w3school.com.cn/jsref/jsref_obj_regexp.asp js文件匹配
            var regular = /\[(\d*:\d*\.\d*)\]/;
            // 变量取出每一行的歌词
            $.each(arrat,function(index,ele){
                // 
                var lyricmusic = ele.split("]")[1];
                // console.log(lyricmusic.length)
                // 判断 长度等于1 return
                if(lyricmusic.length == 1) return true;
                // 追加元素
                $this.lyrics.push(lyricmusic)
                // exec() 方法用于检索字符串中的正则表达式的匹配。 匹配结果
                // 获取时间
                var res = regular.exec(ele);
                // 判断 等于null实 跳出 重新循环 第二次
                if(res == null) return true;
                // 赋值
                var resnum = res[1]; // 00:00.01
                //  取出值中  分出 分钟 与 秒 切割
                var res2 = resnum.split(":");
                // 取出分钟数  parseInt() 函数可解析一个字符串，并返回一个整数。
                var min = parseInt(res2[0] * 60);
                // console.log(min + '----0')
                // parseFloat() 函数可解析一个字符串，并返回一个浮点数。
                var sec = parseFloat(res2[1]);
                // console.log(sec + '----1')
                // toFixed() 方法可把 Number 四舍五入为指定小数位数的数字
                var time = parseFloat(Number(min + sec).toFixed(2));
                // push() 方法可向数组的末尾添加一个或多个元素，并返回新的长度。
                // console.log(time) 
                $this.times.push(time);
                // 获取歌词
            })
        },
        currentTime:function(audioTime){
            // console.log(audioTime);
            // console.log(this.times[0]);
            // 判断 如果当前的实时播放的值大于传来的值 则删除第一个元素标签
            if(audioTime >= this.times[0]){
                // 内部定义的序号++ 返回外面序号值  内部值增加 +1 
                this.index++;
                // -1 0 1 2 3 4 5 6  对应 -1 + 1 变为0 默认第一句
                // shift() 方法用于把数组的第一个元素从其中删除，并返回第一个元素的值。
                this.times.shift();
                // [0.92,4.75,6.4,23.59,26.16,29.33,34.27,36.9];
                // ["告白气球 - 周杰伦","词：方文山","曲：周杰伦","塞纳河畔 左岸的咖啡","我手一杯 品尝你的美","留下唇印的嘴","花店玫瑰 名字写错谁","告白气球 风吹到对街"]
                // this.index = num;
            }
            // console.log(this.index);
            return this.index;
        }
    }
    // 主函数的核心函数下init核心函数 赋值 主函数 核心函数
    lyrictext.prototype.init.prototype = lyrictext.prototype;
    // 内部变量赋值给为 外部变量 调用
    window.lyrictext = lyrictext;
})(window)