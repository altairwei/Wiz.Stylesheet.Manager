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
        OutlineStyle: {
            'margin': '0 2px 0 2px',
            'border-radius': '1px',
            'box-shadow': '0 0 1px 1px #26C2A7'
        },
        EmptyStyle: {
            'margin': '',
            'border-radius': '',
            'box-shadow': ''
        },
        ParentStyle: {
            'padding': '0 2px 0 2px'
        },
        zIndex: 90,

    },
 
    _create: function() {
        let opts = this.options;

        // 给元素设置focus/blur事件
        this._setTabIndex();
        
        // 绑定鼠标悬停句柄
        this.element.hover(
            function(){
                if ( this.outline ) {
                    // 当元素被点击时，outline 被固定
                } else {
                    this._renderOutline();
                }
                
            },
            function(){
                this._destroyOutline();
            }
        );

        // 绑定鼠标点击句柄
        this.element.click(function(){
            // 展示边框
            if ( this.outline ) {
                this.outline.addClass('ui-outline-active');
            } else {
                this._renderOutline();
                this.outline.addClass('ui-outline-active');
                console.warn('点击前未触发hover事件');
            }
        });

        // 元素失去焦点
        this.element.blur(function(){
            this._destroyOutline();
        });
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
    
    _setTabIndex: function(){
        let el = this.element;
        // 判断是否为默认拥有tabIndex属性的元素
        if ( el.prop('tabIndex') < 0) {
            el.addClass('ui-set-tabIndex');
            el.prop('tabIndex', -1);
        }
      }
});

// 初始化
$(document).ready(function(){
   console.log('Hello World!');
})