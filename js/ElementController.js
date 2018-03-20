
// 创建Widget: 元素控制面板
$.widget("sm.cPanelBtn", $.ui.button, {
    options: {
		classes: {
            "ui-button": "ui-corner-all",
            "sm-cpanel-btn" : "",
            "sm-cpanel-btn-default" : "",
            "sm-cpanel-btn-active" : "ui-state-active",
		},
		disabled: null,
		icon: null, // 传入FontAwesome的<i></i>字符串。
		iconPosition: "beginning",
		label: null,
        showLabel: true,
        actionTarget: null, // 传入jQuery对象
        actionCallback: null, // 传入要执行的动作
        actionCallbackParam: null, // 动作需要的参数
	},
    // 目标: 通过Options传入要绑定的callback或target，从而设置该按钮的功能；
    // 设置成可以接受FontAwsome图标的按钮
    _create: function() {
        let that = this, opts = this.options, el = this.element;

        // 绑定事件
        this._on(el, {
            click : that._toggleAction,
        })

        // 
        this._addClass(el, "sm-cpanel-btn-default");

        return this._super();
    },

    _toggleAction: function() {
        let that = this, opts = this.options, el = this.element;
        
        // 判断语句，查看按钮处于什么状态
        if ( el.hasClass('sm-cpanel-btn-active') ) {
            // 关闭元素控件操作
            opts.actionCallback.call(opts.actionTarget, 'destroy');
            console.log(opts.actionTarget);
            // 清除Class
            this._removeClass(el, "sm-cpanel-btn-active");
            this._addClass(el, "sm-cpanel-btn-default");
        } else {
            // 开启元素控件操作
            opts.actionCallback.call(opts.actionTarget, opts.actionCallbackParam);
            
            // 设置激活Class
            this._addClass(el, "sm-cpanel-btn-active");
            this._removeClass(el, "sm-cpanel-btn-default");
        }
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
            focus : function(e) {
                e.stopPropagation();
                that._renderToolkit();
            },
            blur : function(e){
                
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

        // 更新this.toolkit的定位，用position()工具
    },

    _renderToolkit: function() {
        var el = this.element, opts = this.options, that = this;
        this.elementOffset = el.offset();
        // 准备元素控件面板
        if ( this.toolkit ) {
            this._show(this.toolkit, this.options.show, null);
        } 
        
        else {
            // 这里应该交给组件来做！
            // 创建元素，可以写个controlgroup控件，自动设置corner的圆角
            this.toolkit = $(`
            <div id='ui-toolkit' class='toolbar'>
                <button id="ui-sm-resizable-${this.uuid}" class="ui-corner-left"><i class="fas fa-expand-arrows-alt"></i></button>
                <button id="ui-sm-draggable-${this.uuid}" class=""><i class="fas fa-arrows-alt"></i></button>
                <button id="ui-sm-delete-${this.uuid}" class="ui-corner-right"><i class="fas fa-trash-alt"></i></button>
            </div>
            `);

            // 设置控件格式
            // 如果元素Position: fixed要注意定位。
            this._addClass(this.toolkit.find('button'), null, 'sm-cpanel-btn');
            this.toolkit.css( {
                position: "absolute",
                left: this.elementOffset.left + "px",
                top: (parseInt(this.elementOffset.top) - 24) + "px",
                zIndex: opts.zIndex
            } )
            .buttonset()
            this.toolkit.find(`#ui-sm-resizable-${this.uuid}`).cPanelBtn({
                actionTarget: el, 
                actionCallback: $.fn.resizable, // 传入要执行的callback
            })
            this.toolkit.find(`#ui-sm-draggable-${this.uuid}`).cPanelBtn({
                actionTarget: el, 
                actionCallback: $.fn.draggable, // 传入要执行的callback
            })
            this.toolkit.find(`#ui-sm-delete-${this.uuid}`).cPanelBtn({
                actionTarget: el, 
                actionCallback: function(){
                    // 删除后元素遗留下来了，应该启动ElementControl的自毁程序
                    el.ElementController('destroy');
                    el.remove();
                }, 
            });;

            // 绑定按钮响应事件
            this._on(this.toolkit.find('button'), {
                focus: function(e) {
                    // 100ms后让元素重获焦点
                    that._delay(function(){
                        that.element.focus();
                    }, 100)
                },
            })

            // 点击空白处自动隐藏工具栏
            this._on(this.document, {
                click: function(e) {
                    if(!that.element.is(e.target) && !that.toolkit.is(e.target) && that.toolkit.has(e.target).length === 0){
                        that._hideToolkit();
                    }
                }
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
        this.element.removeClass('sm-elctrl-el');
        this._resTabIndex();
        if ( this.toolkit ) this.toolkit.remove();
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
    let
    jqueryUI_CSS_Path =  pluginPath + "lib/jQuery-UI/jquery-ui.min.css",
    jqueryUI_structure_Path = pluginPath + "lib/jQuery-UI/jquery-ui.structure.css",
    jqueryUI_theme_Path = pluginPath + "lib/jQuery-UI/jquery-ui.theme.css",
    sm_structure_Path = pluginPath + "css/stylesheet-manager.structure.css";

    $(`
    <link class="jqueryUI-style" rel="stylesheet" href="${ jqueryUI_CSS_Path }">
    <link class="jqueryUI-style" rel="stylesheet" href="${ jqueryUI_structure_Path }">
    <link class="jqueryUI-style" rel="stylesheet" href="${ jqueryUI_theme_Path }">
    <link class="sm-style" rel="stylesheet" href="${ sm_structure_Path }">
    `).appendTo(document.head);
 
    // 所有元素加载控件
    $('*').ElementController().ElementController('refresh');

    // 清理程序
    $('document').on('beforeunload', function(){
        $(":data('StylesheetManager-ElementController')").ElementController('destroy');
        $(":data('StylesheetManager-cPanelBtn')").cPanelBtn('destroy');
    })

    return true;
}