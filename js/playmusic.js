// 匿名方法的调用 是初始化jquery对象的惯用方法  调用函数时，是在函数后面写上括号和实参的
// 只要创建了一个新函数，就会根据一组特定的规则为该函数创建一个prototype 原型属性，默认情况下prototype属性会默认获得一个constructor(构造函数)属性，
(function(window){
    // 创造一个函数  // 每一个函数内部 prototype(原型函数) 等同于 对象内部__proto__
    function Player($audio){
        // 返回构造的新函数
        return new Player.prototype.init($audio);
        // console.log($audio);
    }
    // 函数创建
    Player.prototype = {
        // constructor(构造函数)属性 指向
        constructor:Player,
        // 传来的变量
        musicdata:[],
        // init函数
        init:function($audio){
            // 获取的是jq对象 非dom
            this.$audio = $audio;
            // 获取的dom对象
            this.audio = $audio.get(0);
        },
        // 定义变量是否为同一首音乐 当前的索引值
        currentIndex:-1,
        // 播放音乐函数
        Playmusic:function(index,music){
            // 判断是否为同一首音乐
            if(this.currentIndex == index){
                // 是同一首 paused 判断是否暂停
                // paly()方法和pause()方法  是HTML5里新增的 audio和video里的方法 使用的是jquery选择器所以返回的是jquery对象而非dom对象，而jquery对象是没有play()方法的，你要么将jquery对象转换成dom对象（$('selector）[0]），要么使用源生选择器document.get
                // paused 属性返回音频/视频是否已暂停
                if(this.audio.paused){
                    // 当前dom对象播放 play 与 pause为html5自带的属性方法 播放
                    this.audio.play();
                }else{
                    // 暂停
                    this.audio.pause();
                }
            }else{
                // console.log(index + '!!!!!');
                // 更换audio标签 获取当前的jq中audio标签
                this.$audio.attr("src",music.link_url);
                // 重新播放调用 方法用于在更改来源或其他设置后对音频/视频元素进行更新 避免出现nun load()
                this.audio.load();
                // console.log(this.$audio.attr());
                this.audio.play();
                // 当前的点击播放索引值 赋值 当前的index参数 赋值当前的定义变量值
                this.currentIndex = index;
                // console.log(this.currentIndex + '..')
            }
        },
        // 上一首函数
        premusic:function(){
            // 当前索引元素值 - 1 
            // 对字符串中各个字符的索引是从0开始的，但是如果要计算字符串的长度，那么是从1开始的
            var pre = this.currentIndex - 1;
            // 小于0 则执行 当前传进来的json文件长度-1 
            if(pre < 0){
                pre = this.musicdata.length - 1;
            }
            return pre;
        },
        // 下一首函数
        nextmusic:function(){
            var next = this.currentIndex + 1;
            // 如果大于当前json文件长度 
            if(next >= this.musicdata.length){
                next = 0;   
            }
            return next;
        },
        // 删除音乐函数
        delemusic:function(index){
            // 获取当前数组的值  splice() 方法用于添加或删除数组中的元素。  
            // splice参数（index,howmany,item1,.....,itemX)  index 必需。规定从何处添加/删除元素。howmany 删除多少 
            // console.log(index + '@@@@@')
            this.musicdata.splice(index,1);
            // console.log(index);
            // console.log(this.currentIndex + ']]]]]]');
            // 判断当前删除的是否是正在播放音乐的前面的音乐
            if(index < this.currentIndex){
                // 当前定义的值未变 索引从0开始 会默认重新排序 下一首累加 当前需要减一 重新刷新值
                // console.log(this.currentIndex + '--1');
                this.currentIndex = this.currentIndex - 1;
            }
        },
        // 当前音乐播放传时间
        musicUpadatTime:function(Callback){
            var $this = this;
            // 当前音乐播放 ontimeupdate事件来报告当前的播放进度
            this.$audio.on("timeupdate",function(){
                // duration 属性返回当前音频的长度，以秒计 获取区当前音乐长度
                // console.log($this.audio.currentTime);
                var audioLength = $this.audio.duration
                // console.log(audioLength)
                // currentTime 属性设置或返回音频/视频播放的当前位置（以秒计）
                var audioTime = $this.audio.currentTime;
                // 调用函数 进行函数内部计算 接受一个返回值
                var timeAudio = $this.musicTextTime(audioLength,audioTime);
                // 回调函数 调用时传参
                Callback(audioTime,audioLength,timeAudio);
            })            
        },
        // 音乐时间计算播放 上方函数进行调用
        musicTextTime:function(audioLength,audioTime){
            // 开始时间
            // 开始时间 除以60 整数
            var startTime = parseInt(audioTime / 60);
            // 开始时间 取余数
            var startMinute = parseInt(audioTime % 60);
            // 判断小于10则加0
            if(startMinute < 10){
                startMinute = "0" + startMinute;
            }
            if(startTime < 10){
                startTime = "0" + startTime;
            }
            // 结束时间
            // 总时长 除以60 整数 parseInt丢弃小数部分,保留整数部分
            var endTime = parseInt(audioLength / 60);
            // 总时长 取余数
            var endMinute = parseInt(audioLength % 60);
            // 判断小于10则加0
            if(endTime < 10){
                endTime = "0" + endTime;
            }
            if(endMinute < 10){
                endMinute = "0" + endMinute;
            }
            // 总和 
            var timeNum = startTime + ":" + startMinute+ " / " + endTime + ":" + endMinute;
            // 返回值
            return timeNum;            
        },
        // 进度条拖拽与点击值
        progreDrag:function(value){
            // 判断
            if(isNaN(value)) return;
            // 长度乘以当前传来的值 duration  总长度乘以除背景值 进行赋值
            this.audio.currentTime = this.audio.duration * value;
        },
        // 调整音量函数
        volumeMusic:function(value){
            // 判断
            if(isNaN(value)) return;
            // 判断 取值范围只能0-1之间
            if(value < 0){
                value = 0;
            }else if(value > 1){
                value = 1;
            }
            // 取值范围 0-1
            this.audio.volume = value;
        }
    }
    // 主函数的核心函数下init核心函数 赋值 主函数 核心函数
    Player.prototype.init.prototype = Player.prototype;
    // 内部变量赋值给为 外部变量 调用 返回值
    window.Player = Player;
})(window)