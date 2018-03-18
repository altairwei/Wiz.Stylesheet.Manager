// 浏览器对象
var objApp = window.external;
var objDatabase = objApp.Database;
var objCommon = objApp.CreateWizObject("WizKMControls.WizCommonUI");
var objWindow = objApp.Window;
var pluginPath = objApp.GetPluginPathByScriptFileName("sm_global.js");

// 定义BrowserInjector原型对象

class BrowserInjector {

}

// 工具

function messageToUser(str, type = 'success'){
    if ( typeof($.notify) == 'undefined' ) {
        console.log(str);
    } else if ( typeof($.notify) == 'function' ) {
        $.notify(str, type);
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
    let ElementControllerPath = pluginPath + "js/ElementController.js";
    let objBrowser = objWindow.CurrentDocumentBrowserObject;
    objBrowser.ExecuteScriptFile(jQueryPath, function(ret){
        messageToUser("已执行jQuery注入！", "success");
        objBrowser.ExecuteScriptFile(jQueryUIPath, function(ret){
            messageToUser("已执行jQueryUI注入！", "success");
            objBrowser.ExecuteScriptFile(ElementControllerPath, function(ret){
                messageToUser("已执行ElementController注入！", "success");
                objBrowser.ExecuteFunction4("Init", objApp, objCommon, objDatabase, window.WizChromeBrowser, function(ret){
                    messageToUser("成功投递对象！", "success");
                });
            });
        });
    });
}

$(document).ready(function(){
    // 设置Notify
    $.notify.defaults({
        position: "bottom",
    })

    // 设置UI控件 
    $( "#function-tabs" ).tabs();
    $( "#accordion" ).accordion({
        collapsible: true
      });
    $('#inject-jquery').button().click(function(){
        injectAllScript();
    });
    $('#alert').button().click(function(){
        let str = $('#input-str').val();
        messageToUser(str, 'info');
    })
    $('#inject-js').button().click(function(){
        let js = $('#js-str').val();
        injectJsToBrowser(js);
    })

    // 加载完毕后再展示<body>
    $('body').css('visibility', 'visible');
});