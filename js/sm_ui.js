// 浏览器对象
var objApp = window.external;
var objDatabase = objApp.Database;
var objCommon = objApp.CreateWizObject("WizKMControls.WizCommonUI");
var objWindow = objApp.Window;
var pluginPath = objApp.GetPluginPathByScriptFileName("sm_global.js");

function messageToUser(str, type = 'success'){
    if ( typeof($.notify) == 'undefined' ) {
        console.log(str);
    } else if ( typeof($.notify) == 'function' ) {
        $.notify(str, type);
    }
}

function injectJqueryToBrowser(){
    let jQueryPath = pluginPath + "lib/jQuery/jquery-3.3.1.min.js";
    let objBrowser = objWindow.CurrentDocumentBrowserObject;
    objBrowser.ExecuteScriptFile(jQueryPath, function(ret){
        if (ret) {
            messageToUser("已执行jQuery插入！", "success");
        } else {
            messageToUser("jQuery注入失败！", 'error');
        }
    });
}

$(document).ready(function(){
    // 设置Notify
    $.notify.defaults({
        position: "bottom",
    })

    // 设置UI控件 
    $("#date").datepicker({
        min: 0,
        max: 100,
    });
    $('#inject-jquery').click(function(){
        injectJqueryToBrowser();
    });
    $('#alert').click(function(){
        messageToUser('The quick brown fox jumps over！', 'info');
    })
});