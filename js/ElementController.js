
// 创建Widget: 元素控制面板
$.widget("sm.cPanelBtn", $.ui.button, {
    options: {
        classes: {
            "sm-cpanel-btn-default" : "",
            "sm-cpanel-btn-active" : "",
        },
    },
    // 目标: 通过Options传入要绑定的$.ui控件名称，从而设置该按钮的功能；
    _create: function() {
        let that = this, opts = this.options;
        this._on(this.element, {
            click : function(e) {
                this._trigger( "_active", e, {
                    // Pass additional information unique to this event
                    checked: opts.is(":checked")
                });
            },
        })
        return this._super();
    },

    _active: function() {
        // 设置激活Class
    },
} )


// 创建Widget: ElementController

$.widget( "sm.ElementController", {
 
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
        _currentActiveInstance: null,
        _PrimaryStyle: null,
        _deactive: function(e) {
            let el = e.target;
        },
        classes: {
            'sm-elctrl-el' : '',
            'sm-elctrl-el-default' : '',
            'sm-elctrl-el-active' : '',
        },
        ViableNode: [],
        OutlineStyle: {
            //'border-radius': '2px',
            'box-shadow': '0 0 2px 2px #A5C7FE inset'
        },
        ActiveStyle: {
            'border-radius': '2px',
            'box-shadow': '0 0 2px 2px #A5C7FE'
        },
        zIndex: 0,
    },
    
    // ElementController原型对象的构造函数
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

        // 设置元素格式
        this._addClass(this.element, 'sm-elctrl-el');

        // 获取元素原始格式
        opts._PrimaryStyle = {
            'border-radius': this.element.css('border-radius'),
            'box-shadow': this.element.css('box-shadow'),
            'background': this.element.css('background')
        }

        // 给元素设置focus/blur事件
        this._setTabIndex();
        
        // 绑定事件句柄
        this._on(el, {
            // 绑定鼠标悬停句柄
            mouseover: function(e) {
                e.stopPropagation();
                el.css(opts.OutlineStyle);
            },
            mouseout : function(e) {
                e.stopPropagation();
                el.css(that.options._PrimaryStyle);
            },
            // 绑定鼠标点击句柄
            click : function(e) {
                e.stopPropagation();
                that._renderToolkit();
             },
             blur : function(e){
                // 触发消失事件
               that._trigger("_deactive", e, null )
                //TODO: 失去焦点后删除控件面板
                //that._hideToolkit();
            },
        })

        //TODO: 展示一个框，因为focus只能使一个元素
        /*
        if ( that._currentActiveInstance != null ) {
            that._currentActiveInstance.outline.remove();
        }
        $.StylesheetManager.ElementController.prototype.options._currentActiveInstance = that;
        that._renderOutline();
        */

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
                zIndex: ++o.zIndex //TODO: Don't modify option
            } ).css(o.ActiveStyle);
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

    _renderToolkit: function() {
        var el = this.element, opts = this.options, that = this;
        this.elementOffset = el.offset();
        // 准备元素控件面板
        if ( this.toolkit ) {
            this._show(this.toolkit, this.options.show, null);
        } else {

            // 创建元素
            this.toolkit = $(`
            <div id='ui-toolkit' class='toolbar'>
                <button id="ui-sm-resizable-${this.uuid}" class="ui-corner-left" tabIndex="-1">Re</button>
                <button id="ui-sm-draggable-${this.uuid}" class="ui-corner-right" tabIndex="-1">Dr</button>
            </div>
            `);

            // 设置控件格式
            this.toolkit.css( {
                position: "absolute",
                left: this.elementOffset.left + "px",
                top: (parseInt(this.elementOffset.top) - 28) + "px",
                zIndex: opts.zIndex
            } )
            .buttonset()

            // 绑定按钮响应事件
            $(`#ui-sm-resizable-${this.uuid}`).blur(function(){
                that._hideToolkit();
            })

            //TODO: 添加到元素上端
            this.toolkit.appendTo('body');
        }
        

    },

    _hideToolkit: function() {
        if ( this.toolkit ) {
            this._hide( this.toolkit, this.options.hide, null);
        }
    },

    _toggleButton: function() {
        // 根据按钮的ID来切换方法
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
        // 清除事件句柄
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
    // 一些变量
    let pluginPath = objApp.GetPluginPathByScriptFileName("sm_global.js");
 
    // 准备jQueyr-UI的CSS文件
    let jqueryUI_CSS_Path =  pluginPath + "lib/jQuery-UI/jquery-ui.min.css";
    let jqueryUI_structure_Path = pluginPath + "lib/jQuery-UI/jquery-ui.structure.css";
    let jqueryUI_theme_Path = pluginPath + "lib/jQuery-UI/jquery-ui.theme.css";
    $('<link class="jqueryUI-style" rel="stylesheet" href="'+ jqueryUI_CSS_Path + '">').appendTo(document.head);
    $('<link class="jqueryUI-style" rel="stylesheet" href="'+ jqueryUI_structure_Path + '">').appendTo(document.head);
    $('<link class="jqueryUI-style" rel="stylesheet" href="'+ jqueryUI_theme_Path + '">').appendTo(document.head);
 
    // 所有元素加载控件
    $('*').ElementController().ElementController('refresh');

    // 清理程序
    $('document').on('beforeunload', function(){
        $(":data('StylesheetManager-ElementController')").ElementController('destroy');
        $(":data('StylesheetManager-cPanelBtn')").cPanelBtn('destroy');
    })
}