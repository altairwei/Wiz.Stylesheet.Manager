// 浏览器对象
var objApp = window.external;
var objDatabase = objApp.Database;
var objCommon = objApp.CreateWizObject("WizKMControls.WizCommonUI");
var objWindow = objApp.Window;
var pluginPath = objApp.GetPluginPathByScriptFileName("sm_global.js");

// 定义BrowserInjector原型对象

class BrowserInjector {
    constructor(scriptPath, objBrowser) {
        //TODO: 将script, scriptFile, function区分开来
        this.scriptPaths = [];
        this.scriptPaths.push(scriptPath);
        this.objBrowser = objBrowser;
    };
    inject() {
        //TODO: 通过scriptPaths具有多少层元素来判断需要多少层回调注入。
        //TODO: 定制成功和错误的消息通知及通知函数。
    };
}

// 工具

function messageToUser(str, type = 'success'){
    if ( typeof($.notify) == 'undefined' ) {
        console.log(str);
    } else if ( typeof($.notify) == 'function' ) {
        $.notify(str, type);
    }
}

function injectSelectedJsToBrowser(jsName){
    let jQueryPath = pluginPath + "lib/jQuery/jquery-3.3.1.min.js";
    let jQueryUIPath = pluginPath + "lib/jQuery-UI/jquery-ui.js";
    let ElementControllerPath = pluginPath + "js/ElementController.js";
    let objBrowser = objWindow.CurrentDocumentBrowserObject;

    switch (jsName) {
        case "jQuery": 
            objBrowser.ExecuteScriptFile(jQueryPath, function(ret){
                messageToUser("已执行jQuery注入！", "success");
            });
            break;
        case "All": 
            injectAllScript();
            break;
    }
}

function injectJsToBrowser(js){
    let objBrowser = objWindow.CurrentDocumentBrowserObject;
    js += ';(function(){return true})()';
    objBrowser.ExecuteScript(js, function(ret){
        if (ret) {
            messageToUser("已执行脚本插入！", "success");
        } else {
            messageToUser("jQuery注入失败！", 'error');
        }
    });
}

function injectAllScript(){
    let jQueryPath = pluginPath + "lib/jQuery/jquery-3.3.1.min.js";
    let jQueryUIPath = pluginPath + "lib/jQuery-UI/jquery-ui.js";
    let fontAwesomePath = pluginPath + "js/fontawesome-all.js";
    let ElementControllerPath = pluginPath + "js/ElementController.js";
    let objBrowser = objWindow.CurrentDocumentBrowserObject;
    objBrowser.ExecuteScriptFile(jQueryPath, function(ret){
        messageToUser("正在启动动态布局……", "info");
        objBrowser.ExecuteScriptFile(jQueryUIPath, function(ret){
            //messageToUser("已执行jQueryUI注入！", "success");
            objBrowser.ExecuteScriptFile(fontAwesomePath, function(ret){
                //messageToUser("已执行FontAwesome注入！", "success");
                objBrowser.ExecuteScriptFile(ElementControllerPath, function(ret){
                    //messageToUser("已执行ElementController注入！", "success");
                    objBrowser.ExecuteFunction4("Init", objApp, objCommon, window.WizChromeBrowser, pluginPath, function(ret){
                        if (ret) {
                            messageToUser("成功进入动态布局模式！", "success");
                        } else {
                            messageToUser("脚本初始化失败！", "error");
                        }
                        
                    });
                });
            });
        });
    });
}

function initDynaamicLayout() {
    // 动态布局
    $( '#js-menu' ).selectmenu({
        classes: {
            "ui-selectmenu-button": "ui-button-icon-only demo-splitbutton-select"
        },
        change: function(){
            $( "#injector-btn" ).attr('value', this.value).text($(this).find(':selected').text());
        }
    });

    // 初始化脚本注入按钮
    $( ".controlgroup" ).controlgroup({
        onlyVisible: false,
    })
    .find("#injector-btn").click(function() {
        let jsName = $(this).attr('value');
        injectSelectedJsToBrowser(jsName);
    });

    $("#save-clear").button().click(function() {
        let objBrowser = objWindow.CurrentDocumentBrowserObject;
        objBrowser.ExecuteFunction1("clearUp", true, function(ret) {
            if (ret) {
                messageToUser("成功保存并完成清理！", "success");
            } else {
                messageToUser("清理失败，请放弃修改！", "error");
            }
        })
    })

    $("#clear").button().click(function() {
        let objBrowser = objWindow.CurrentDocumentBrowserObject;
        objBrowser.ExecuteFunction1("clearUp", false, function(ret) {
            if (ret) {
                messageToUser("成功完成清理！", "success");
            } else {
                messageToUser("清理失败，请放弃修改！", "error");
            }
        })
    })
}

$(document).ready(function(){
    // 设置Notify
    $.notify.defaults({
        position: "bottom",
    })

    // 设置UI控件

    // 功能分页
    $( "#function-tabs" ).tabs();

    // 元素批处理
    $( "#accordion" ).accordion({
        collapsible: true
    });

    // 样式管理
    $( "#css-toolbar" ).controlgroup({
        onlyVisible: false,
    })

    // 动态布局
    initDynaamicLayout();

    // 注入自定义脚本
    $('#inject-js').button().click(function(){
        let js = $('#js-str').val();
        injectJsToBrowser(js);
    })

    // 加载完毕后再展示<body>
    $('body').css('visibility', 'visible');
});