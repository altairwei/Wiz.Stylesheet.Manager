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
    const script = objCommon.InputBox('请输入要执行的代码片段', '代码片段将在jQuery注入后执行，因此您可以使用相关API。', '');
    progress.Title = "正在注入jQuery...";
    progress.Max = 3;
    progress.Show();
    progress.Pos = 1;
    objBrowser.ExecuteScriptFile(pluginPath + "lib/jQuery/jquery-3.3.1.min.js", function(ret) {
        if (ret) {
            progress.Pos = 2;
            progress.Text = '成功注入jQuery！';
            objBrowser.ExecuteScript(script, function(ret){
                progress.Pos = 3;
                progress.Text = '执行代码！';
                setTimeout(function(){
                    progress.Pos = 3;
                    progress.Hide();
                    progress.Destroy();
                    progress = null;
                }, 300)
            })
        } else {
            progress.Pos = 2;
            progress.Text = '注入失败！';
            progress.Hide();
            WizAlert('注入失败！')
            setTimeout(function(){
                progress.Pos = 3;
                progress.Hide();
                progress.Destroy();
                progress = null;
            }, 300)
        }
    })
})()