
function sm_OnButtonClicked() {
    let pluginPath = objApp.GetPluginPathByScriptFileName("sm_global.js");
    let jQueryPath = pluginPath + "js/jQuery/jquery-3.3.1.min.js";
    let objBrowser = objWindow.CurrentDocumentBrowserObject;
    //
    objBrowser.ExecuteScriptFile(jQueryPath, function(){
        objWindow.ShowMessage("已执行jQuery插入！", "", 0);
    });
}
function sm_InitButton() {
    let pluginPath = objApp.GetPluginPathByScriptFileName("sm_global.js");
    let langFileName = pluginPath + "plugin.ini";
    let buttonText = objApp.LoadStringFromFile(langFileName, "strSM");
    objWindow.AddToolButton("document", "SM_button", buttonText, pluginPath + "logo-jquery.ico", "sm_OnButtonClicked");
}

sm_InitButton();