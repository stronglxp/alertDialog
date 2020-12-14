
/**
 * 消息提示组件
 *
 * 1.调用
 * 对象型参数：$.message({}, type); // type取值1、2、3，1表示单行提示，2表示带title的提示，3表示带button的提示
 *
 * 2.参数详解
 * title: // 标题
 * message:' 操作成功',    //提示信息
 * time:'3000',           //显示时间（默认：3s）
 * type:'success',        //显示类型，包括5种：success.error,info,warning,question
 * showClose:false,       //显示关闭按钮（默认：否）
 * autoClose:true,        //是否自动关闭（默认：是）
 * onClose:点击取消按钮或者自动关闭时，调用的函数
 * onConfirm:点击确认按钮时，调用的函数
 * 
 */

$.extend({
    message: function(options, type = 1) {
        var defaults={
            title: '已成功!',
            message:' 操作成功',
            time:'3000',
            type:'success',
            showClose:false,
            autoClose:true,
            onClose:function(){},
            onConfirm: function(){}
        };

        if(typeof options === 'string'){
            defaults.message=options;
        }
        if(typeof options === 'object'){
            defaults=$.extend({},defaults,options);
        }
        //message模版
        var templateClose=defaults.showClose?'<a class="c-message--close">×</a>':'';

        var template;
        switch(type) {
            // 带title的弹框
            case 2:
                template='<div class="c-message messageFadeInDown">'+
                    '<div class="c-message--main">' +
                    '<i class=" c-message--icon c-message--'+defaults.type+'"></i>'+
                    templateClose+
                    '<div class="c-message--title">'+defaults.title+'</div>'+
                    '<div class="c-message--body">'+defaults.message+'</div>'+
                    '</div>'+
                    '</div>';
                break;
            // 带按钮的弹框
            case 3:
                template='<div class="c-message messageFadeInDown">'+
                    '<div class="c-message--main">' +
                    '<i class=" c-message--icon c-message--'+defaults.type+'"></i>'+
                    templateClose+
                    '<div class="c-message--title">'+defaults.title+'</div>'+
                    '<div class="c-message--body">'+defaults.message+'</div>'+
                    '<div class="c-message--button"><button class="btn btn-primary c-message--confirm">确定</button>'+
                    '<button class="btn btn-default c-message--cancel">取消</button></div>'+
                    '</div>'+
                    '</div>';
                break;
            default:
                // 不带title的弹框
                template='<div class="c-message messageFadeInDown">'+
                    '<div class="c-message--main">' +
                    '<i class=" c-message--icon c-message--'+defaults.type+'"></i>'+
                    templateClose+
                    '<div class="c-message--tip">'+defaults.message+'</div>'+
                    '</div>'+
                    '</div>';
                break;
        }

        var _this=this;
        var $body=$('body');
        var $message=$(template);
        var timer;
        var closeFn,removeFn,confirmFn;
        //关闭
        closeFn=function(){
            $message.addClass('messageFadeOutUp');
            $message.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',function(){
                removeFn();
            })
        };
        
        // 确认
        confirmFn = function() {
            $message.addClass('messageFadeOutUp');
            $message.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',function(){
                $message.remove();
                defaults.onConfirm(defaults);
            }) 
        }
        
        //移除
        removeFn=function(){
            $message.remove();
            defaults.onClose(defaults);
            clearTimeout(timer);
        };
        //移除所有
        $('.c-message').remove();
        $body.append($message);
        //居中
        $message.css({
            'margin-left':'-'+$message.width()/2+'px'
        })
        
        if (type == 3) {
          var h = window.innerHeight
                      || document.documentElement.clientHeight
                      || document.body.clientHeight;
          var text = $('.c-message').height();
          $message.css({
              'top': (h - text) / 3 + 'px'
          })
        }
        //去除动画类
        $message.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',function(){
            $message.removeClass('messageFadeInDown');
        });
        //点击关闭
        $body.on('click','.c-message--close, .c-message--cancel',function(e){
            closeFn();
        });

        // 点击确认
        $body.on('click','.c-message--confirm',function(e){
            confirmFn();
        });

        //自动关闭
        if(defaults.autoClose){
            timer=setTimeout(function(){
                closeFn();
            },defaults.time)
        }
    }
});