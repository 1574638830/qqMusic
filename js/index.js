$(function(){
    // 获取audio音频标签
    var $audio = $("audio");
    var play = new Player($audio);
    var Scroll;
    var ScrollVolume;
    var lyric;
    var $father;
    // 1、获取歌曲json文件 读取内容
    loadermusic();
    function loadermusic(){
        $.ajax({
            // 链接json文件
            url:"source/musiclist.json",
            // 定义数据类型
            dataType:"JSON",
            // 加载成功执行
            success:function(data){
                // 传值
                play.musicdata = data;
                console.log(data);
                // 3.1 遍历数据 $.each 特点的值
                // 两个参数，第一个参数表示遍历的数组的下标，第二个参数表示下标对应的值
                $.each(data,function(index,ele){
                    // 定义变量 创建数据函数 像内部传值 index 序号  ele为对象资源
                    var $item = createMusic(index,ele);
                    // 获取到list的元素
                    var $musiclist = $(".content_list");
                    // 返回的值进行追加
                    $musiclist.append($item);
                });
                // 初始化 默认传值为0 下方函数  json文件的值部分
                initMusicplay(data[0]);
                // 初始化歌词同步部分 默认传值为0 下方函数
                initMusiclyric(data[0]);     
                // 传title的值 over
                htmlTitle(data[0])
            },
            // 加载错误执行
            error:function(event){
                console.log(event);
            }
        })
    };
    // 1.1 切换事件函数 歌词 背景 音乐
    function initMusicplay(music){
        // console.log(music)
        var $musicSong_pic = $(".song_info img"); /* 中间歌曲图片 */
        var $musicSong_name = $(".song_name a");/* 中间歌曲名字 */
        var $musicSong_singer = $(".song_singer a"); /* 中间歌曲歌手 */
        var $musicSongsong_special = $(".song_special a"); /* 中间歌曲专辑 */
        var $progress_top_music = $(".music"); /* 底部歌曲名称 */
        var $progress_top_one = $(".one");/* 底部歌曲歌手 */
        var $progress_top_span = $(".progress_top span");
        var $body_img = $(".body_img");
        var $title = $("title");
        // 下面进行赋值操作
        $musicSong_pic.attr("src",music.cover);
        $musicSong_name.text(music.name);
        $musicSong_singer.text(music.singer);
        $musicSongsong_special.text(music.album);
        $progress_top_music.text(music.name);
        $progress_top_one.text(music.singer);
        $progress_top_span.text('');
        $body_img.css("background","url("+music.cover+")");
        $title.text("正在播放 "+music.name);
    }
    // 1.2 歌词同步部分
    function initMusiclyric(music){
        // 创建函数
        lyric = new lyrictext(music.link_lrc);
        // 获取到歌词的元素标签
        var $word = $(".song_word ul");
        // $words.text('');
        // 点击后清空元素下的所有值
        // html()   --->    获取指定标签中的内容（能将标签一起获取）
        // text()    --->    获取纯文本内容（不能获取标签）
        $word.html('');
        lyric.loadText(function(){
            // 创建歌词列表  循环遍历除 lyric函数中的lyrics数组值
            $.each(lyric.lyrics,function(index,ele){
                // 创建li标签
                var $uls = $("<li>"+ele+"</li>");
                // 追加到ul标签中 
                $word.append($uls);
            })
        })
        // console.log(lyric);
    }
    // 1.3 歌词title 鼠标显示
    function htmlTitle(music){
        // 取值 参数
        var thisname = music.name;
        var thissinger = music.singer;
        var thisalbum = music.album;
        // 获取html 元素
        var htmlmusic =  $(".music");
        var htmlone = $(".one");
        var htmlsong_name = $(".song_name a");
        var htmlsong_singer = $(".song_singer a");
        var htmlsong_special = $(".song_special a");
        // 添加title标签
        htmlmusic.attr("title",thisname);
        htmlone.attr("title",thissinger);
        htmlsong_name.attr("title",thisname);
        htmlsong_singer.attr("title",thissinger);
        htmlsong_special.attr("title",thisalbum);
    }
    // 2 音乐动画监听
    Animationevents();
    function Animationevents(){
        //jquery中的on()为新添加的动态元素绑定事件  非动态事件可以使用默认方法  找到不变元素  事件 查找的外级元素
        // 1、 ul列表中子图标显引 
        $(".content_list").on('mouseover','.content_list_list',function(){
            // 鼠标指向 find查找后代元素 显示
            $(this).find(".list_music_img").stop().fadeIn(10);
            // 显示删除标签 
            $(this).find(".list_time a").stop().fadeIn(1);
            // 淡出文字
            $(this).find(".list_time span").stop().fadeOut(5);
        })
        // 鼠标；离开事件
        $(".content_list").on('mouseout','.content_list_list',function(){
            // 鼠标离开
            $(this).find(".list_music_img").stop().fadeOut(10);
            // 删除图标淡出
            $(this).find(".list_time a").stop().fadeOut(1);
            // 文字显示
            $(this).find(".list_time span").stop().fadeIn(5);
        })
        // 2 单选框单击事件
        $(".content_list").on('click','.list_textbox',function(){
        // 增加css样式 toggleclass 该方法检查每个元素中指定的类。如果不存在则添加类，如果已设置则删除之。这就是所谓的切换效果。
            $(this).toggleClass("list_checkbox");
        })
        //  3 子菜单播放切换
        $(".content_list").on('click','.list_play',function(){
            // 3.0 增加css样式 toggleclass 该方法检查每个元素中指定的类。如果不存在则添加类，如果已设置则删除之。这就是所谓的切换效果。
            // 获取底部子菜单 暂停按钮
            var $foot_suspend = $(".foot_suspend");
            // 提取出父级元素
            $father = $(this).parents(".content_list_list");
            // console.log($father.get(0).index);
            console.log($father)
            // 获取到当前的点击的 get0 ul  序号
            // console.log($father.get(0).index,$father.get(0).music);
            $(this).toggleClass("list_play2");
            // 3.1 点击子菜单时 找到父亲元素 其他兄弟 元素则删除class 
            $(this).parents(".content_list_list").siblings().find(".list_play").removeClass("list_play2");
            // 3.2 实现子菜单与底部按钮同步 查找元素进行判断 当前是否为播放状态
            //  当前按钮 attr 找到class为 list_play2元素的值  indexof方法 没有则为-1
            if($(this).attr("class").indexOf("list_play2") != -1){
                // 当前子菜单为播放状态 增加class
                $foot_suspend.addClass("foot_suspend2");
                // 增加整行高量 ul css
                $father.find("li").css("color","#fff");
                // 当前点击找到父元素其他兄弟元素的li标签 改变颜色
                $father.siblings().find("li").css("color","rgba(225,225,225,0.8)");
                // 当前点击找到父元素里序号该元素隐藏
                $father.find(".list_number").css("display","none");
                // 当前点击找到父元素里图标该元素显示
                $father.find(".play_gif").css("display","block");
                // 当前点击找到父元素里兄弟列表序号该元素显示
                $father.siblings().find(".list_number").css("display","block");
                // 当前点击找到父元素里兄弟列表图标该元素隐藏
                $father.siblings().find(".play_gif").css("display","none");
            }else{
                // 当前子菜单为暂停状态 删除class
                $foot_suspend.removeClass("foot_suspend2");
                // 删除高亮 
                $father.find("li").css("color","rgba(225,225,225,0.8)");
                // 隐藏动画图标
                $father.find(".play_gif").css("display","none");
                // 显示序号列表
                $father.find(".list_number").css("display","block");
            };
            // arr = $father.get(0).index;
            // console.log($custom);
            // 播放函数 传参  get0 获取到的为dom元素
            // console.log($father.get(0))
            // console.log($father.get(0))
            // if($father.get(0).index == $custom){
                // 传值函数 切换歌词信息
                initMusiclyric($father.get(0).music);
                // 调用函数 传值更改页面内容
                initMusicplay($father.get(0).music);
                // 传值内容
                htmlTitle($father.get(0).music);
            // } 

            play.Playmusic($father.get(0).index,$father.get(0).music);

        })
        //  音乐删除按钮
        $(".content_list").on("click",".list_delete",function(){
            // 找到父元素
            var $relist = $(this).parents(".content_list_list");
            // console.log($relist.get(0).index + '----0')
            // console.log(play.currentIndex + '----1');
            // 进行判断当前音乐被删除
            if($relist.get(0).index == play.currentIndex){
                // console.log($relist.get(0).index + '----2')
                // console.log(play.currentIndex + '----3')
                $(".foot_below").trigger("click");
            }
            // remove() 方法移除被选元素，包括所有文本和子节点。
            $relist.remove();
            // 传值
            play.delemusic($relist.get(0).index);
            // 重新排序 循环列表里的值
            $(".content_list_list").each(function(index,ele){
                // 新的index 赋值到 ele.index
                ele.index = index;
                // 进行修改 返回的字符长度值
                $(ele).find(".list_number").text(index+1);
                // 对字符串中各个字符的索引是从0开始的，但是如果要计算字符串的长度，那么是从1开始的。
            })
        })
        // 调用播放歌曲js文件函数 后面function为回调函数
        play.musicUpadatTime(function(audioTime,audioLength,timeAudio){
            // 获取到time时间的值 进行赋值
            $(".progress_top span").text(timeAudio);
            // 计算进度条的值 当前的播放时间 除以 总长度 
            var progress = (audioTime / audioLength) * 100;
            // 精度条函数 赋值
            Scroll.progressAaima(progress);
            // console.log(progress)
            // console.log(audioTime);
            // 歌词函数调用
            lyricindex = lyric.currentTime(audioTime);
            // var ggg = lyricindex + 3;
            // console.log(lyricindex);
            // 获去当前的li元素序号
            var $item = $(".uls li").eq(lyricindex);
            // 当前元素增加classt样式
            $item.addClass("word_grenn");
            // 当前元素兄弟元素删除样式
            $item.siblings().removeClass("word_grenn");
            // console.log(lyricindex + '/////////');

            //  当前 值 小于等于二 则不执行后面内容 大于则执行
            if(lyricindex <= 2) return true;

            // if(number <= 2) return;
            // console.log(lyricindex);
            $(".uls").css({
                marginTop:(-lyricindex + 2) * 30,
            })
            // console.log(-lyricindex + 2);

        })
        // 当前事件音乐播放完成 进行点击下一首音乐
        play.$audio.on("ended",function(){
            // 调用函数
            foot_below();
        });
        // 音量点击
        $(".foot_vol").click(function(){
            // 切换样式
            $(this).toggleClass("foot_vol1");
            // 判断 当前为音量禁止
            if($(this).attr("class").indexOf("foot_vol1") != -1){
                // 赋值处理
                play.volumeMusic(0);
            }else{
                // 传参数
                play.volumeMusic(1);
            }
        });
    }
    // 3 初始化进度条
    initprogress();
    function initprogress(){
        var $progress_bar = $(".progress_bar"); /* 背景 */
        var $progress_line = $(".progress_line"); /* 前景 */
        var $progress_circle = $(".progress_circle"); /* 圆点 */
        Scroll = new Progress($progress_bar,$progress_line,$progress_circle);
        Scroll.progressClick(function(value){
            // 传值到播放音乐  进度条赋值
            play.progreDrag(value);
        });
        Scroll.progressMove(function(value){
            play.progreDrag(value);
        });
    
        var $volume_bar = $(".volume_bar"); /* 背景 */
        var $volume_line = $(".volume_line"); /* 前景 */
        var $volume_circle = $(".volume_circle"); /* 圆点 */
        ScrollVolume = new Progress($volume_bar,$volume_line,$volume_circle);
        ScrollVolume.progressClick(function(value){
            play.volumeMusic(value);
        });
        ScrollVolume.progressMove(function(value){
            play.volumeMusic(value);
        });
    }
    // 3 歌词资源创建函数
    function createMusic(index,music){
        // html新建
        var $list = $('<ul class="content_list_list">'+
        '<li class="list_textbox">'+
            '<i></i>'+
        '</li>'+
        '<li class="list_music" title="'+music.name+'">'+ music.name+
            '<span class="list_number">'+(index + 1)+'</span>'+
            '<i class="play_gif"></i>'+
            '<div class="list_music_img">'+
                '<a href="javascript:;" title="播放" class="list_play"></a>'+
                '<a href="javascript:;" title="添加"></a>'+
                '<a href="javascript:;" title="下载"></a>'+
                '<a href="javascript:;" title="分享"></a>'+
            '</div>'+
        '</li>'+
       '<li class="list_singer" title="'+music.singer+'">'+music.singer+'</li>'+
        '<li class="list_time">'+
            '<span>'+music.time+'</span>'+
            '<a href="javascript:;" title="删除" class="list_delete"></a>'+
        '</li>'+
    '</ul>');
        // 存储  把当前的index值与music的值存储到ul标签
        $list.get(0).index = index;
        $list.get(0).music = music;
        //  返回值
        return $list;
    }
    // 4 尾部样式切换 开始暂停
    footer();
    function footer(){
        // 循环模式样式
        $(".foot_refresh").click(function(){
            $(this).toggleClass("foot_refresh1"),("foot_refresh2");
        });    
        // 收藏样式
        $(".foot_like").click(function(){
            $(this).toggleClass("foot_like1");
        });       
        // 模式切换样式
        $(".foot_model").click(function(){
            $(this).toggleClass("foot_model1");
        });    
        // 音量按钮样式
        // $(".foot_vol").click(function(){
        //     $(this).toggleClass("foot_vol1");
        // });
    }
    // 5 底部点击事件
    music();
    function music(){
        // 监听底部播放暂停按钮
        $(".foot_suspend").click(function(){
            foot_play();
        })
        // 监听上一首播放按钮
        $(".foot_up").click(function(){
            foot_up();
        })
        // 监听下一首播放按钮
        $(".foot_below").click(function(){
            foot_below();
        })
    }
    // 6.1 底部播放暂停事件函数
    function foot_play(){
        // 如果当前索引的值 等于 currentIndex 未播放 默认第一首
        if(play.currentIndex == -1){ 
            // 默认播放第一首 查找到当前所有列表 eq第一个 查找内部list_play trigger()规定被选元素要触发的事件 添加click   来回点击切换 图标样式
            $(".content_list_list").eq(0).find(".list_play").trigger("click");
        }else{
            // 已经播放
            $(".content_list_list").eq(play.currentIndex).find(".list_play").trigger("click");
        }
        // console.log(play.currentIndex);
    }
    // 6.2 监听上一首播放按钮
    function foot_up(){
        $(".content_list_list").eq(play.premusic()).find(".list_play").trigger("click");
    }
    // 6.3 监听下一首播放按钮
    function foot_below(){
        $(".content_list_list").eq(play.nextmusic()).find(".list_play").trigger("click");
    }
    // 7、键盘事件
    $(document).keydown(function(event){
        // 浏览器通用样式
        var e = event || window.event || arguments.callee.caller.arguments[0];
        // keydown()
        // keydown事件会在键盘按下时触发,可以在绑定的函数中欧能够返回false来防止触发浏览器的默认事件. 
        // keyup()
        // keyup事件会在按键释放时触发,也就是你按下键盘起来后的事件. 
        // keypress()
        // keypress事件会在敲击按键时触发,我们可以理解为按下并抬起同一个按键. 
        // 空格暂停播放　  
        if(e.keyCode == 32){
            // 调用定义函数
            foot_play();
        }
        // alt + 方向键左
        if(e.altKey && e.which == 37){
            // 调用定义函数
            foot_up();
        }
        // alt + 方向键右
        if(e.altKey && e.which == 39){
            // 调用定义函数
            foot_below();
        }
        // console.log(e)
    })
});