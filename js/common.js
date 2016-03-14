$(function(){
    $('.sidebar').toggleClass('another_form',localStorage.getItem('another_form') === "true" && $(window).width() > 768);
    //another form menu
    $('.toggle_another_form').on('click', function() {
        $('.sidebar').toggleClass('another_form');
        localStorage.setItem('another_form',$('.sidebar').is(".another_form"));
        $(window).resize();
    });

    //buttons
    $("body").on("click",".buttons .btn",function(){
        $(this).next("ul").show();
    }).on("click",".buttons ul li",function(e){
        var text = $(this).text();
        var ul = $(this).closest("ul");
        ul.prev(".btn").text(text);
        $(this).closest("ul").hide();
        e.preventDefault();
    });

    // toTop
    var scrollTimeout = 0;
    var toggleToTopBtn = function(){
        var topVal = $(window).scrollTop();
        $("#to_top").toggleClass("show",topVal > 300);
    };
    toggleToTopBtn();
    $(window).scroll(function(){
        scrollTimeout && clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(toggleToTopBtn,100);
    });
    $("body").on("click","#to_top",function(){
        $('body,html').animate({ scrollTop: 0 }, 500);
    });

    // single control show-hidden
    $('body').on("change",":radio,[data-show]:checkbox,select",function(e){
        var type = $(this).attr("type");
        var check = $(this).is("select") ? "selected" : "checked";
        var name = $(this).attr("name");

        if(type === "checkbox"){
            var show = $(this).attr("data-show");
            $(show).toggleClass("hidden",!$(this).prop(check));
            $(":input",$(show).filter(".hidden")).prop("disabled",true);
            $(":input",$(show).not(".hidden")).prop("disabled",false).first().focus();
        }else{
            var $controls = type === "radio" ? $('[name="'+name+'"][data-show]') : $('option[data-show]',this);
            $controls.each(function(){
                var show = $(this).attr("data-show");
                $(show).toggleClass("hidden",!$(this).prop(check));
                $(":input",$(show).filter(".hidden")).prop("disabled",true);
                $(":input",$(show).not(".hidden")).prop("disabled",false).first().focus();
            });
        }
    });

    // 给所有表单页长字段模拟title
    $('body').on("mouseenter",".field>.nowrap",function(){
        if($(this).data("titled")){
            return;
        }
        $(this).toTitle($(this).closest(".field"));
        $(this).data("titled",true);
    });
    $('body').on("mouseenter","[data-title]",function(){
        if($(this).data("titled")){
            return;
        }
        $(this).toTitle($(this),{dir: null});
        $(this).data("titled",true);
    });

    // 模拟title
    $.fn.toTitle = function(container,other){
        var paramObj = {
            $ct: container,
            content: $(this).attr("data-title") || $.trim($(this).text()),
            timeout: 1200,
            dir: 'bottom',
            type: 'hover',
            css: {
                padding: "5px",
                "box-shadow": "none",
            },
            noClose: true
        };
        if($.type(other) === "object"){
            $.extend(true, paramObj, other);
        }else if($.type(other) === "number"){
            paramObj.timeout = +other;
        }else if($.type(other) === "string"){
            paramObj.theme = other;
        }
        new Tip(paramObj);
    };

    // 小提示
    $.fn.operTip = function(content,other){
        var paramObj = {
            $ct: $(this),
            timeout: 2000,
            noClose: true,
            content: content,
            css: {
                padding: "5px",
                "box-shadow": "none",
            }
        };
        if($.type(other) === "object"){
            $.extend(true, paramObj, other);
        }else if($.type(other) === "number"){
            paramObj.timeout = +other;
        }else if($.type(other) === "string"){
            paramObj.theme = other;
        }
        new Tip(paramObj);
    };

    // 验证
    $.fn.validate = function(condition,tip){
        $(this).toggleClass("invalid",!condition);
        $(this).parent().operTip(tip,{isShow: !condition,dir:'top',theme: 'danger',timeout: 3000,css:{'white-space':'nowrap'}});
    };

    // 日期控件
    $.fn.datepicker = function(opt){
        var option = {
            $ct: $(this).parent(),
            $toInput: $(this),
            isShow: false
        };
        $.extend(true, option, opt);
        new Datepicker(option);
    };

    $("body").on("keyup","[data-validate]",function(){
        var condition,tip,type = $(this).attr('data-validate');
        var val = $(this).val();
        switch(type){
            case 'num': tip = "请输入数字！",condition = base.isNum(val); break;
            case 'int': tip = "请输入整数！",condition = base.isInt(val); break;
            case 'posInt': tip = "请输入不小于0的整数！",condition = base.isPosInt(val); break;
            default: tip = "您的输入有误！",condition = base.isNum(val);
        };

        $(this).validate(condition,tip);
    });
});