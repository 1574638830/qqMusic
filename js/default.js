// 匿名方法的调用 是初始化jquery对象的惯用方法  调用函数时，是在函数后面写上括号和实参的
// 只要创建了一个新函数，就会根据一组特定的规则为该函数创建一个prototype 原型属性，默认情况下prototype属性会默认获得一个constructor(构造函数)属性，
(function(window){
    // 创造一个函数  // 每一个函数内部 prototype(原型函数) 等同于 对象内部__proto__
    function lyrictext(){
        // 返回构造的新函数
        return new lyrictext.prototype.init();
    }
    // 函数创建
    lyrictext.prototype = {
        // constructor(构造函数)属性 指向
        // constructor 是一种用于创建和初始化class创建的对象的特殊方法。
        constructor:lyrictext,
        // init函数 接受属性的值
        init:function(){
        }
    }
    // 主函数的核心函数下init核心函数 赋值 主函数 核心函数
    lyrictext.prototype.init.prototype = lyrictext.prototype;
    // 内部变量赋值给为 外部变量 调用
    window.lyrictext = lyrictext;
})(window)