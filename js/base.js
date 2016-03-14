(function(){
    // 向传入dom光标所在处插入值
    function insertVal(dom,myValue) {
        if(document.selection){
            dom.focus();
            document.selection.createRange().text = myValue;
            dom.focus();
        }else if(dom.selectionStart || dom.selectionStart == '0'){
            var startPos = dom.selectionStart;
            var endPos = dom.selectionEnd;
            var scrollTop = dom.scrollTop;
            dom.value = dom.value.substring(0, startPos) + myValue + dom.value.substring(endPos, dom.value.length);
            dom.focus();
            dom.selectionStart = startPos + myValue.length;
            dom.selectionEnd = startPos + myValue.length;
            dom.scrollTop = scrollTop;
        }else{
            dom.value += myValue;
            dom.focus();
        }
    }

    // 向指定select框渲染option,第二个参数可以有3种形式
    function renderOption($el,opts){
        var optArr = [];
        if($.type(opts) === "object"){
            for(var i in opts){
                optArr.push($('<option value="'+i+'">'+opts[i]+'</option>'));
            }
        }else if($.type(opts) === "array"){
            if($.type(opts[0]) !== "object"){
                $.each(opts,function(i){
                    optArr.push($('<option value="'+opts[i]+'">'+opts[i]+'</option>'));
                });
            }else{
                $.each(opts,function(i){
                    optArr.push($('<option value="'+opts[i].key+'">'+opts[i].val+'</option>'));
                });
            }
        }
        $el.append(optArr);
    }

    // 对传入字符串进行倒序
    function reverseStr(string){
        return String(string).split('').reverse().join('');
    };
    // 对传入数字进行千分位格式化
    function numFormat(num){
        if(!num) return 0;
        var numArr = String(num).split(".");
        var numInt = reverseStr(reverseStr(numArr[0]).replace(/\d{3}/g, '$&,')).replace(/^,/, '');
        var numDeci = numArr.length === 2 ? '.'+String(numArr[1]).replace(/\d{3}/g, '$&,').replace(/,$/, '') : '';
        return numInt + numDeci;
    };
    // 对传入数字去除千分位
    function numClear(string){
        if(!string) return 0;
        return String(string).split(',').join('');
    };
    // 数字整数化，如果是NaN，返回0
    function numToInt(number){
        number = parseInt(number);
        return isNaN(number) ? 0 : number;
    };
    // 数字小数化，如果是NaN，返回0
    function numToFixed(number,num){
        number = parseFloat(number);
        isNaN(number) && (number = 0);
        return number.toFixed(num || 2);
    };

    /**
     * 将一个string 进行左右补全
     * @param str
     * @param pad  补全的字符
     * @param length  补全的长度
     * @param leftmode  是否左边补全
     * @returns
    */
    function toPad(str, pad, length, leftmode){
        var temp = '';

        str = String(str);

        pad = String(pad);

        length = length - str.length;

        while(length-- > 0){
            temp += pad;
        }

        return leftmode == true ? (temp + str) : (str + temp);
    };
    // 返回当前时间戳
    function now(format){
        return format ? date(format) : (new Date).getTime();
    };

    //返回和php一样的时间格式
    //如Date.date('Y-m-d H:i:s'); 2012-09-10 11:10:00
    //y 4位年
    //m 2位月
    //n 不加0的月
    //d 2位 当前多少日
    //j 不加0的日
    //D 星期几
    //H 12小时制的hours
    //h 24小时制的hours
    //i 2位分
    //s 2位秒
    //a am或者pm
    //A AM或者PM
    //t 当前月有多少天
    function date(str, time){
        if( !str ) return ;

        var date = new Date, temp = [];

        time && date.setTime(time);

        for(var i = 0, j = str.length; i < j; i++){
            var value = str.charAt(i);
            switch(value){
                case 'y': value = date.getFullYear(); break;
                case 'm': value = toPad(date.getMonth() + 1, 0, 2, true); break;
                case 'n': value = date.getMonth() + 1; break;   
                case 'd': value = toPad(date.getDate(), 0, 2, true); break;
                case 'j': value = date.getDate(); break;
                case 'D': value = date.getDay(); break;
                case 'H': value = toPad(date.getHours() % 12, 0, 2, true); break;
                case 'h': value = toPad(date.getHours(), 0, 2, true); break;
                case 'i': value = toPad(date.getMinutes(), 0, 2, true); break;
                case 's': value = toPad(date.getSeconds(), 0, 2, true); break;
                case 'a': value = date.getHours() - 12 < 0 ? 'am' : 'pm'; break;
                case 'A': value = date.getHours() - 12 < 0 ? 'AM' : 'PM'; break;
                case 't': value = (new Date(date.getFullYear(), date.getMonth() + 1, 0)).getDate(); break;
                default: ;
            };
            temp.push(value);
        }
        return temp.join('');
    };
    // 日期计算
    function calDate(type,num,time){
        var times = time || now();
        $.type(times) === "date" && (times = times.getTime());
        var seconds;
        switch(type){
            case 'y': seconds = num*365*24*60*60*1000; break;
            case 'm': seconds = num*date("t",times)*24*60*60*1000; break;
            case 'd': seconds = num*24*60*60*1000; break;
            case 'h': seconds = num*60*60*1000; break;
            case 'i': seconds = num*60*1000; break;
            case 's': seconds = num*1000; break;
            default: ;
        };
        return new Date(times+seconds);
    }
    function isNum(num){
        return !isNaN(num);
    }
    function isInt(num){
        return !isNaN(num) && !~String(num).indexOf(".");
    }
    function isPosInt(num){
        return !isNaN(num) && !~String(num).indexOf(".") && num >= 0;
    }
    window.base = {
        host: 'http://192.168.1.102:8080',
        insertVal: insertVal,
        renderOption: renderOption,
        reverseStr: reverseStr,
        numFormat: numFormat,
        numToInt: numToInt,
        toPad: toPad,
        now: now,
        date: date,
        calDate: calDate,
        numClear: numClear,
        numToFixed: numToFixed,
        isNum: isNum,
        isInt: isInt,
        isPosInt: isPosInt
    };
})();