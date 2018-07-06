var objApp = window.external;
var objDatabase = objApp.Database;
var objWindow = objApp.Window;
var objCommon = objApp.CreateWizObject("WizKMControls.WizCommonUI");
var pluginPath = objApp.GetPluginPathByScriptFileName("sm_global.js");

function WizAlert(msg) {
    objWindow.ShowMessage(msg, "{p}", 0x00000040);
}

function WizConfirm(msg) {
    return objWindow.ShowMessage(msg, "{p}", 0x00000020 | 0x00000001) == 1;
}

(function() {
    let objBrowser = objWindow.CurrentDocumentBrowserObject;
    objBrowser.ExecuteScriptFile(pluginPath + "lib/jQuery/jquery-3.3.1.min.js", function(ret) {
        const code = `$('body').css('max-width', '800px').css('margin-left', 'auto').css('margin-right', 'auto')`
        objBrowser.ExecuteScript(code, null);
    })
})()