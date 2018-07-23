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
        const code = `
        $('body').css('max-width', '820px')
                    .css('margin', '40px auto')
                    .css('padding', '48px 60px')
                    .css('min-height', 'calc(100% - 80px)')
                    .css('box-sizing', 'content-box')
                    .css('border', '1px solid #e8e8e8');
        $('html').css('height', '100%')
                    .css('background-color', '#f0f2f4');
        `
        objBrowser.ExecuteScript(code, null);
    })
})()