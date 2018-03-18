// 创建jQuery插件: autoHide()
(function($){
    $.fn.sm_autoHide = function(opts) {
        var defaults = {
            // 设置你的选项缺省值
         }  
        
        // 使用用户的选项缺省值来扩展缺省选项  
        var options = $.extend(defaults, opts || {});  
        
         return this.each(function(){ // jQuery链式操作  
            // 插件的相关内容
            var elem = $(this);
            $(document).on('click', function(e){
                if (elem.is(':visible') && (!$(e.target)[0].isEqualNode(elem[0]) && elem.has(e.target).length === 0)) {
                    // TODO: 隐藏ElementController控件
                    elem.hide();
                }
                e.stopPropagation();
            })
        });
    }
})(jQuery)

// 创建Widget: ElementController

$.widget( "custom.ElementController", {
 
    // Default options.
    options: {
        _defaultViableNode: [
            "a", "abbr", "acronym", "address", "area", "article", "aside", "audio", 
            "b", "bdi", "bdo", "big", "blockquote", "br", "button", "canvas", "cite", "code", "command", 
            "datalist", "dd", "del", "details", "dfn", "dialog", "div", "dl", "dt", 
            "em", "embed", "fieldset", "figcaption", "figure", "footer", "form", "frame", "frameset", 
            "h1", "h2", "h3", "h4", "h5", "h6", "header", "hr", "i", "iframe", "img", "input", "ins", 
            "kbd", "keygen", "label", "legend", "li", "main", "map", "mark", "menu", "menuitem", "meter", 
            "nav", "noframes", "noscript", "object", "ol", "optgroup", "option", "output", "p", "pre", "progress", 
            "q", "rp", "rt", "ruby", "s", "samp", "section", "select", "small", "span", "strong", "sub", "summary", "sup", 
            "table", "textarea", "tt", "u", "ul", "var", "video", "wbr"
        ],
        ViableNode: [],
        OutlineStyle: {
            'border-radius': '0px',
            'box-shadow': '0 0 4px 2px #26C2A7 inset'
        },
        EmptyStyle: {
            'border-radius': '',
            'box-shadow': ''
        },
        zIndex: 90,

    },

    _currentActiveInstance: null,
 
    _create: function() {
        let opts = this.options;
        let that = this;
        let el = this.element;

        // 首先判断是否为允许的元素
        let elType = el[0].nodeName.toLowerCase();
        if (!opts._defaultViableNode.includes(elType)) {
            console.warn(`<${elType}> 不适用动态布局！`);
            return false;
        };
        this.element.addClass('el-ctrl');

        // 给元素设置focus/blur事件
        this._setTabIndex();
        
        // 绑定鼠标悬停句柄
        this.element.hover(
            function(){
                /*
                if ( this.outline ) {
                    // 当元素被点击时，outline 被固定
                } else {
                    this._renderOutline();
                }
                */
               el.focus();
                
            },
            function(){
                /*
                this._destroyOutline();
                */
               el.blur();
            }
        );

        // 绑定鼠标点击句柄
        this.element.click(function(e){
            // 展示边框
            /*
            if ( this.outline ) {
                this.outline.addClass('ui-outline-active');
            } else {
                this._renderOutline();
                this.outline.addClass('ui-outline-active');
                console.warn('点击前未触发hover事件');
            }
            */
           e.stopPropagation();
           //TODO: 展示一个框，因为focus只能使一个元素
           if ( that._currentActiveInstance != null ) {
               that._currentActiveInstance.css(opts.EmptyStyle);
           }
           that.__proto__._currentActiveInstance = el;
           el.css(opts.OutlineStyle);
        });

        // 元素失去焦点
        this.element.blur(function(){
            //this._destroyOutline();
        });
    },

    refresh: function() {
        let el = this.element;
        let opts = this.options;
        let elType = el[0].nodeName.toLowerCase();
        if (!opts._defaultViableNode.includes(elType)) {
            this.destroy();
        };
    },

    _renderOutline: function() {
        // 获得元素定位
		var el = this.element, o = this.options;
        this.elementOffset = el.offset();
        
        // 判断是否纯在outline
        if ( this.outline ) {
            this.outline.show();
        } else {
            // 创建元素
            this.outline = $( "<div class='ui-outline-default' style='overflow:hidden;'></div>" );

            // 设置样式
            this.outline.css( {
                width: this.element.outerWidth(),
                height: this.element.outerHeight(),
                position: "absolute",
                left: this.elementOffset.left + "px",
                top: this.elementOffset.top + "px",
                'border-radius': '1px',
                'box-shadow': '0 0 1px 1px #26C2A7',
                zIndex: ++o.zIndex //TODO: Don't modify option
            } );
        }


        // 定位到DOM，并禁用选择
        this.outline.appendTo( "body" ).disableSelection();

    },
    
    _destroyOutline: function() {
        // 判断是否已选中该元素
        let isClicked = this.outline.hasClass('ui-outline-active');

        if ( isClicked ) {
            // 选中则不执行
        } else {
            // 未选中则摧毁
            this.outline.remove();
        }
        
    },
    
    _setTabIndex: function() {
        let el = this.element;
        // 判断是否为默认拥有tabIndex属性的元素
        if ( el.prop('tabIndex') < 0 ) {
            el.addClass('ui-set-tabIndex');
            // 将属性写入HTML，从而激活focus事件
            el.attr('tabIndex', el.prop('tabIndex'));
        }
      },

    _resTabIndex: function() {
        let el = this.element;
        if ( el.hasClass('ui-set-tabIndex') ) {
            el.removeAttr("tabIndex");
        }
    },

    _destroy: function() {
        this.element.removeClass('el-ctrl');
        this._resTabIndex();
        if ( this.outline ) this.outline.remove();
    }
});

// 工具

function clearUp() {
    //TODO: 选中所有元素，调用ElementController的_destroy()
    $('*').ElementController('destroy');
    //TODO: 清除已注入的CSS
    $('jqueryUI-style').remove();
}

// 初始化

function Init(objApp, objDatabase, objCommon, smBrowser) {
    console.log('Hello World!');

    // 一些变量
    let pluginPath = objApp.GetPluginPathByScriptFileName("sm_global.js");
 
    // 准备jQueyr-UI的CSS文件
    let jqueryUI_CSS_Path =  pluginPath + "lib/jQuery-UI/jquery-ui.min.css";
    $('<link id="jqueryUI-style" rel="stylesheet" href="'+ jqueryUI_CSS_Path + '">').appendTo(document.head);
 
    // 将所有元素加载控件
    $('*').ElementController().ElementController('refresh');
}