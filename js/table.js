//table
function Table(opt){
    this.info = "显示 start ~ end 条，共 num 条记录 ";
    this.url = '';
    this.pageSizes = [10,20,50,100];
    this.$ct = $('.content');
    this.$el = $('<table class="table">');
    this.page = true;
    this.pageTotal = 0;
    this.total = 0;
    this.sendData = {
        page_size: 10,
        cur_page: 1,
        sort_dir: 'asc'
    };
    $.extend(true, this, opt);

    this.init();
};
Table.prototype = (function(){
    var init = function(){
        if(!this.sendData.sort){
            this.sendData.sort = this.col[0].key
        }
        this.render();
        this.addEvent();
    },render = function(fn){
        var that = this;
        var content = [];
        content.push(that.renderFilter());
        $.ajax({
            url: this.url,
            dataType: "json",
            data: that.sendData
        }).done(function(data) {
            that.total = data.total;
            that.pageTotal = Math.ceil(data.total/that.sendData.page_size);
            that.renderTh(data);
            that.renderTd(data.data);
            content.push(that.$el);

            that.page && content.push(that.renderFoot(data));
            that.$ct.html(content);
            fn && fn();
        });
        
    },renderFilter = function() {
        var form = $('<form class="table_filter">'
                        +'<div class="page_size">'
                            +'每页显示'
                            +'<select name="page_size">'
                            +'</select>'
                            +'条'
                        +'</div>'
                        +'<div class="ct_2 filter_key">'
                            +'<select name="filter_key">'
                            +'</select>'
                        +'</div>'
                        +'<div class="ct_2 filter_val">'
                            +'<input type="text" name="filter_val">'
                        +'</div>'
                    +'</form>');
        base.renderOption($('[name="page_size"]',form),this.pageSizes);
        base.renderOption($('[name="filter_key"]',form),$.map(this.col, function(n) {
            if (n.filter) {
                return {
                    key: n.key,
                    val: n.title
                };
            }
        }));
        $('[name="page_size"]',form).find('option[value="'+this.sendData.page_size+'"]').prop("selected",true);
        $('[name="filter_key"]',form).find('option[value="'+this.sendData.filter_key+'"]').prop("selected",true);
        $('[name="filter_val"]',form).val(this.sendData.filter_val);
        return form;
    },renderTh = function(data) {
        var that = this;
        var tr = $("<tr>");
        var ths = $.map(this.col, function(n) {
            var th = $("<th>").html(n.title);
            if (n.sort) {
                if (n.key === that.sendData.sort) {
                    th.addClass("sort_" + that.sendData.sort_dir);
                } else {
                    th.addClass("sort");
                }
            }
            return th[0];
        });
        tr.append(ths);
        this.$el.html($("<thead>").append(tr));
    },renderTd = function(data) {
        var $this = this;
        var trs = $.map(data, function(m) {
            var tr = $("<tr>");
            var tds = $.map($this.col, function(n) {
                var td = $("<td>");
                if (n.render) {
                    n.render(td,m[n.key]);
                } else {
                    td.html(m[n.key]);
                }
                return td[0];
            });
            tr.append(tds);
            return tr;
        });
        this.$el.append($("<tbody>").append(trs));
    },renderFoot = function(data){
        var foot = $("<div>").addClass("table_foot");

        var info = this.renderInfo();
        var buttons = this.renderButton(); 

        foot.append(info,buttons);

        return foot;
    },addEvent = function(){
        var that = this;
        this.$ct.on("click",".sort,.sort_asc,.sort_desc",function(){
            that.sendData.sort = $.grep(that.col,function(item){
                if(item.visible !== false){
                    return item
                }
            })[$(this).index()].key;
            that.sendData.sort_dir = $(this).is('.sort_asc') ? 'desc' : 'asc';
            that.render();
        }).on("change",'[name="page_size"]',function(){
            that.sendData.page_size = $(this).val();
            that.sendData.cur_page = 1;
            that.render();
        }).on("keyup",".cur_page",function(){
            var thisVal = $(this).val();
            var invalid = thisVal == that.sendData.cur_page || isNaN(thisVal) || thisVal < 1 || thisVal > that.pageTotal;
            $('.page_goto',that.$ct).toggleClass("active",invalid);
        }).on("keydown",".cur_page",function(e){
            if(e.keyCode === 13 && !$('.page_goto',that.$ct).is(".active")){
                $('.page_goto',that.$ct).trigger("click");
            }
        }).on("click",'.page_first,.page_last,.page_prev,.page_next,.page_goto',function(){
            if($(this).is('.active')){
                return false;
            }
            if($(this).is(".page_first")){
                that.sendData.cur_page = 1;   
            }else if($(this).is(".page_last")){
                that.sendData.cur_page = that.pageTotal;   
            }else if($(this).is(".page_prev")){
                that.sendData.cur_page -= 1;   
            }else if($(this).is(".page_next")){
                that.sendData.cur_page += 1;   
            }else if($(this).is(".page_goto")){
                that.sendData.cur_page = $('.cur_page',that.$ct).val();   
            }
            that.render();
        }).on("change",'[name="filter_key"]',function(){
            that.sendData.filter_key = $(this).val();
            that.render();
        }).on("keyup",'[name="filter_val"]',function(){
            that.sendData.filter_val = $(this).val();
            that.render(function(){
                $('[name="filter_val"]',that.$ct).focus();
            });
        });
    },renderInfo = function(){
        var start = (this.sendData.cur_page-1)*this.sendData.page_size+1;
        var end = Math.min(this.sendData.cur_page*this.sendData.page_size,this.total);
        var info = this.info.replace("start",start).replace("end",end).replace("num",this.total);
        return $("<div>").addClass("table_info ct_5-2").text(info);
    },renderButton = function(){
        var div = $("<div>").addClass("table_btns ct_5-3");
        var button = $("<button>").attr("type","button").addClass("btn btn_outline");
        var isFirst = this.sendData.cur_page === 1;
        var isLast = this.sendData.cur_page === this.pageTotal;
        var firstButton = button.clone().addClass("page_first").text("首页").toggleClass("active",isFirst);
        var lastButton = button.clone().addClass("page_last").text("末页").toggleClass("active",isLast);
        var prevButton = button.clone().addClass("page_prev").text("上一页").toggleClass("active",isFirst);
        var nextButton = button.clone().addClass("page_next").text("下一页").toggleClass("active",isLast);
        var gotoButton = button.clone().addClass("page_goto active").text("跳至");
        var cur_page = $('<label><input class="cur_page" type="text" value="'+this.sendData.cur_page+'">页</label>');
        div.append([firstButton,prevButton,gotoButton,cur_page,nextButton,lastButton]);

        return div;
    };
    return {
        init: init,
        render: render,
        renderFilter: renderFilter,
        renderTh: renderTh,
        renderTd: renderTd,
        renderFoot: renderFoot,
        addEvent: addEvent,
        renderInfo: renderInfo,
        renderButton: renderButton,
    }
})();