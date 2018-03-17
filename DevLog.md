# 层叠样式表管理器 - 开发日志

## 主体UI

* [ ] 用 jQuery UI 写用户界面

## 元素批处理

* [ ] 构建一个`ScriptAssembler`原型对象，通过传入的参数组装出一段脚本。
* [ ] 构建一个`BrowserInjector`原型对象，通过传入浏览器对象以及脚本来形成。
* [ ] 注入jQuery后，获取所有元素，以及他们的属性、值等等信息，在UI界面作为input标签输入提示的功能；

## 布局可视化

* [ ] 利用jQueryUI的核心——互动功能 `Interactions` 、 `Effects` 、 `Utilities` 三个功能，赋予页面所有元素可移动、可排序的功能。

* [ ] 首先注入 `jQuery` ，然后注入 `jQuery UI` ，最后再注入自定义脚本用以载入 `CSS` 以及元素控件。
    1. [ ] 注入 `jQuery`
    2. [ ] 注入 `jQuery UI`
    3. [ ] 注入自定义脚本用以载入 `CSS` 以及元素控件

* [ ] 利用 `jQuery` 的鼠标事件句柄，给被鼠标悬停的元素添加荧光边框，在鼠标点击后激活元素控件。
    1. [ ] 利用 `Outline` 样式来实现荧光边框；
    2. [ ] `mouseover()` 记得 `e.stopPropagation()`
    3. [ ] 插入CSS样式表， `:hover,:focus {outline: 1px solid #26C2A7}`；
    4. [ ] 点击后直接在该元素内联样式添加 `$(this).css('outline', '1px solid #26C2A7')`；
    5. [ ] 另外一种实现方法：注意应该先进行一场判断，如果父元素左右边框没有大于2px的padding的话，就进行设置，如果有就不设置。
        ```JavaScript
        $('p').css({
            'margin': '0 2px 0 2px',
            'border-radius': '1px',
            'box-shadow': '0 0 1px 1px #26C2A7'
        }).parent().css({
            'padding': '0 2px 0 2px',
        })
        ```

* [ ] 在修改完毕，激活痕迹清理程序，清除一系列临时的HTML片段。

* [ ] 元素控件 `ElementControl`
    1. [ ] 第一种事项方法时用 `jQueryUI` 的 `Widget Factory` 创建一个小工具。这样小工具具有明显的生命周期。
    2. [ ] 第二种是创建一个 `ElementControl` 对象，在每次点击元素时，将 `this` 作用域绑定到该元素对象，然后初始化启动。可参考 `Pell` 项目。