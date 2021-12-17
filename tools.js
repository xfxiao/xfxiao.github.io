/*
    这里是Boss企业端快速筛选外挂插件
    作者：五竹
    时间：2021年6月17日
*/
(function ($) {
    var boxClass = 'wuzhu_tools_box', version = 'V1.0',
        mrd = (min, max) => Math.floor(min + Math.random() * (max - min + 1)),
        pid = () => project._id.$oid,
        iframe = document.getElementsByTagName('iframe')[0],
        doc = document, wind = window;
    if (iframe) {
        wind = iframe.contentWindow;
        doc = wind.document;
        $ = wind.$;
    }

    var clear = () => {
        var box = doc.getElementsByClassName(boxClass);
        box.length > 0 && Array.from(box).forEach(item => item.remove());
    }

    var render = () => {
        //渲染组件前先清除之前的
        clear();

        //创建组件容器 
        var div = doc.createElement('div');
        div.className = boxClass;

        //加载css 
        div.innerHTML =
            `<style>
        .wuzhu_tools_box{
            width: 400px;
            padding: 20px 0;
            border: 1px solid;
            position: fixed;
            right: 10px;
            background: black;
            bottom: 10px;
            opacity: 0.9;
            box-shadow: 10px 10px 5px #888888;
            border-radius: 15px;
            color: white;
            z-index:10000;
        }
        .wuzhu_tools_box h2{
            text-align: center;
            margin-top: -10px;
        }
        .wuzhu_tools_box .lk{
            display: inline;
            color: #19c3e6;
            font-size: 14px;
            margin-left: 20px;
        }
        .wuzhu_tools_box h2 a{
            color: white;
            font-size: 18px;
            position: absolute;
            right: 20px;
            top: 10px;
        }
        .tools_bar_body>div{
            line-height: 20px;
            margin-top: 10px;
        }
        .tools_bar_body input[type="radio"]{
            vertical-align: middle;
            margin: 0;
        }

        .tools_bar_body label{
            margin: 0 15px 0 5px;
        }

        .tools_bar_body input[type="button"]{
            width: 100px;
            padding: 3px 8px;
            background-color: #0080ff;
            border: 0;
            color: white;
            border-radius: 3px;
            cursor: pointer;
        }
        .tools_bar_body input[type="button"]:hover{
            background-color: #53a4f4;
        }
        .tools_bar_body input[type="button"]:focus{
            outline:0;
        }
        .tools_bar_body .tip{
            text-align: left;
            margin: 5px 20px 0 117px;
            background-color: #61612b94;
            padding-left: 5px;
        }
        .tools_bar_body .tip.big{
            margin: 3px;
            text-align: center;
            padding: 10px;
            font-size: 16px;
        }
        .tools_bar_body .tip a{
            display: inline;
            color: #19c3e6;
        }
        .tools_bar_body .left{
            width: 114px;
            display: inline-block;
            text-align: right;
        }
        .tools_bar_body .input{
            width:90px;
            height:18px;
        }
        .tools_bar_body .center{
            text-align:center;
        }
        

        </style>`

            +

            //加载组件标题区域
            `<a class="lk" href="mailto:wuzhu@caibeike.com" target="blank">@wuzhu</a><h2>Attack Boss ${version}<a href="JavaScript:void(0)">X</a></h2>`

            +
            //加载选择题功能区
            `<div class="tools_bar_body">
                <div><span class="left">排除：</span>
                <input type="checkbox" id="tools_ck_without" checked /><label for="tools_ck_without">在职-不考虑</label>
                <input type="checkbox" id="tools_ck_greeted" checked /><label for="tools_ck_greeted">已沟通</label>
                </div>
                <div><span class="left">年龄：</span>
                    <input type="text" class="input" id="tools_txt_minAge" value="不限" /> - <input type="text" class="input" id="tools_txt_maxAge" value="不限" />
                </div>
                <div><span class="left">工作年限：</span>
                    <input type="text" class="input" id="tools_txt_minWorkYears" value="不限" /> - <input type="text" class="input" id="tools_txt_maxWorkYears" value="不限" />
                </div>
                <div><span class="left">稳定性 ></span>
                    <input type="text" class="input " id="tools_txt_stability" value="1" />
                    <div class="tip">稳定率 = 工作年限/工作次数，如稳定率为1.2，表示平均1.2年换一份工作</div>
                </div>
                <div><span class="left">公司范围：</span>
                    <input type="text" class="input" id="tools_txt_companies" value="不限" style="width: 197px;" />
                    <div class="tip">多家公司用'|'分隔，支持模糊检索和正则</div>
                </div>
                <div><span class="left"></span>
                    <input type="checkbox" id="auto_turn" checked /><label for="auto_turn">自动翻页</label>
                </div>
                <div class="center">
                    <input type="button" value="查找并标记" id="search" style="margin-right:10px" />
                    <input type="button" value="一键沟通" id="greet" /><span style="margin-left:10px">间隔<input id="it" type="text" class="input" style="width:55px;margin: 0 5px;" id="greet_Interval" value="1000" />ms</span>
                </div>
                <div><div class="tip big">工具来源和使用教程请点击-><a href="https://www.baidu.com" target="blank">工具地址</a></div></div>
            </div>`;

        doc.getElementsByTagName('body')[0].appendChild(div);
        //闪烁动画
        // @keyframes fade {
        //     from {
        //         opacity: 1.0;
        //     }
        //     50% {
        //         opacity: 0.6;
        //     }
        //     to {
        //         opacity: 1.0;
        //     }
        // }
    }
    var getStability = ($box) => {
        var $lis = $box.children('li'), cnt = $lis.length, $$ = (i) => $('span.date', $lis[i]);
        var minYear = new Date($$(cnt - 1).text().split('-')[0]), maxYear = $$(0).text().split('-')[1];
        maxYear = maxYear == '至今' ? new Date() : new Date(maxYear);
        return ((maxYear - minYear) / (24 * 60 * 60 * 1000) / 365) / cnt;//  年限/工作次数
    }

    var validCompanies = (companies, $box) => {
        var text = $('ul.work-exp-box span.exp-content', $box).map((a, b) => b.innerText).get().join('---');
        return RegExp(companies).test(text)
    }

    var filterHandle = ($elem, condition) => {
        //兼容非jQ的$
        if ($elem.attr('wz') == '1') return !1;

        var $$ = (selector) => $(selector, $elem),
            $span = $$('span.label-text'),
            without = /暂不考虑/.test('$span[4].innerText'),
            age = ~~$span[1].innerText.replace('岁', ''),
            workYears = ~~$span[2].innerText.replace('年', ''),
            stability = getStability($$('ul.work-exp-box')),
            isGreeted = $$('.iboss-goutongjindu-xian').length > 0;


        //排除在职不考虑机会
        if (without && condition.without)
            return !1;
        //排除已沟通
        if (isGreeted && condition.greeted)
            return !1;
        //年龄过滤
        if (age && (condition.minAge || condition.maxAge) && (age < ~~condition.minAge || (~~condition.maxAge && age > condition.maxAge)))
            return !1;
        //工作年限过滤
        if (workYears && (condition.minWorkYears || condition.maxWorkYears) && (age < ~~condition.minWorkYears || (~~condition.maxWorkYears && age > condition.maxWorkYears)))
            return !1;
        //稳定率过滤
        if (stability && condition.stability && stability < parseFloat(condition.stability))
            return !1;
        //公司过滤
        if (condition.companies && condition.companies != '不限' && !validCompanies(condition.companies, $$('ul.work-exp-box')))
            return !1;

        return !0;
    }

    var scrollToBottom = () => {
        var h = doc.documentElement.scrollHeight || doc.body.scrollHeight;
        wind.scrollTo(h, h);
    }


    var search = (condition) => {
        var $box = $('#recommend-list ul.recommend-card-list'), $list = $box.children('li');
        var $resuls = $($list.filter((idx, item) => filterHandle($(item), condition)).get()).attr('wz', '1');
        wind.$resuls = $resuls;
        $resuls.find('.geek-info-card').css({ "background-color": "#b8ff00", "animation": "fade 1000ms infinite ease-in-out" });
        return $resuls;
    }
    //search({ minAge: 25,minWorkYears:2,stability:1.0,companies:'携程|点评|滴滴|中通' })

    var getParams = () => {
        var $$ = (selector) => $(doc.getElementsByClassName(boxClass)[0].querySelector(selector));
        return {
            without: $$('#tools_ck_without').prop('checked'),
            greeted: $$('#tools_ck_greeted').prop('checked'),
            minAge: $$('#tools_txt_minAge').val(),
            maxAge: $$('#tools_txt_maxAge').val(),
            minWorkYears: $$('#tools_txt_minWorkYears').val(),
            maxWorkYears: $$('#tools_txt_maxWorkYears').val(),
            stability: $$('#tools_txt_stability').val(),
            companies: $$('#tools_txt_companies').val()
        }
    }
    var clearMark = () => {
        $('#recommend-list ul.recommend-card-list>li').removeAttr('wz');
        $('#recommend-list .geek-info-card').removeAttr('style');
    }
    var delayClick = (btns, callback, idx) => {
        idx = idx || 0;
        var btn = btns[idx];
        if (btn) {
            btn.onclick();
            console.log(btn);
            console.log('click');
            setTimeout(() => {
                idx++;
                delayClick(btns, callback, idx);
            }, ~~doc.querySelector('.' + boxClass + ' #it').value || 500);
            return;
        }
        callback();
    }

    var flag = 1;
    var waitScroll = (callback) => {
        var len = $('#recommend-list ul.recommend-card-list>li').length;
        scrollToBottom();
        var handle = setInterval(() => {
            var l1 = 0;
            if (flag && ($('#recommend-list ul.recommend-card-list>li').length != len || (l1 = $('i.iboss-meiyougengduole').length) > 0)) {
                clearInterval(handle);
                callback();
                l1 == 0 && waitScroll(callback);
                console.log('running......');
            }
        }, 200);
    }
    var bindEvent = () => {
        var box = doc.getElementsByClassName(boxClass)[0],
            autoTurn = box.querySelector('#auto_turn');

        box.querySelector('h2 a').onclick = clear;
        box.querySelector('.center #search').onclick = () => {
            var fn = () => {
                var $resuls = search(getParams());
                //$resuls.find('.geek-info-card').css({ "background-color": "#b8ff00", "animation": "fade 1000ms infinite ease-in-out" });
            }
            clearMark();
            fn();
            autoTurn.checked && waitScroll(fn);
        }

        var recursionClick = () => {
            flag = 0;
            var $resuls = search(getParams());
            if($resuls.length==0)return;
            delayClick($resuls.find('.btn-greet'), () => {
                flag = 1;
                if (autoTurn.checked) {
                    waitScroll(recursionClick);
                }
            });
        }

        box.querySelector('.center #greet').onclick = () => {
            clearMark();
            recursionClick();
        }

        autoTurn.onclick = (elem) => {
            $(box.querySelector('#it'))[elem.target.checked ? 'show' : 'hide']();
        }
    }

    render();
    bindEvent();
})(typeof jQuery == 'undefined' ? $ : jQuery);

//javascript:(function(){var script = document.createElement('script');script.src='//c.caibeike.net/download/attachments/110137307/tools.js?version=1&amp;modificationDate=1639623813355&amp;api=v2?'+new Date().getTime();document.querySelector("body").appendChild(script);})()