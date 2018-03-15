// 浏览器对象
var objApp = window.external;
var objDatabase = objApp.Database;
var objCommon = objApp.CreateWizObject("WizKMControls.WizCommonUI");
var objWindow = objApp.Window;
var pluginPath = objApp.GetPluginPathByScriptFileName("sm_global.js");

function messageToUser(str, jqObj = $(document)){
    jqObj.sticky(str);
}

function injectJqueryToBrowser(){
    let jQueryPath = pluginPath + "lib/jQuery/jquery-3.3.1.min.js";
    let objBrowser = objWindow.CurrentDocumentBrowserObject;
    objBrowser.ExecuteScriptFile(jQueryPath, function(){
        messageToUser("已执行jQuery插入！");
    });
}

$(document).ready(function(){
    $("#date").datepicker();
    $('#inject-jquery').click(function(){
        injectJqueryToBrowser();
    });
});