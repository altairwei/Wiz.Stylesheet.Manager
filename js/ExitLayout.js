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
    let progress = objApp.CreateWizObject("WizKMControls.WizProgressWindow");
    progress.Title = "正在清理并退出...";
    progress.Max = 3;
    progress.Show();
    progress.Pos = 1;
    objBrowser.ExecuteFunction1("clearUp", false, function(ret) {
        if (ret) {
            progress.Pos = 2;
            progress.Text = '成功完成清理！';
            setTimeout(function(){
                progress.Pos = 3;
                progress.Hide();
                progress.Destroy();
                progress = null;
            }, 300)
        } else {
            progress.Pos = 2;
            progress.Text = '清理失败，请放弃修改！';
            progress.Hide();
            WizAlert('清理失败，请放弃修改！')
            setTimeout(function(){
                progress.Pos = 3;
                progress.Hide();
                progress.Destroy();
                progress = null;
            }, 300)
        }
    })
})()