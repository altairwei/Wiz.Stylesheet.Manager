
function sm_OnButtonClicked() {
    let pluginPath = objApp.GetPluginPathByScriptFileName("sm_global.js");
    let jQueryPath = pluginPath + "lib/jQuery/jquery-3.3.1.min.js";
    let rect = objWindow.GetToolButtonRect("document", "SM_button");
    let arr = rect.split(',');
    //objWindow.ShowSelectorWindow(pluginPath + 'menu.html', (parseInt(arr[0]) + parseInt(arr[2])) / 2, arr[3], 220, 150, "");
    objWindow.ShowHtmlDialogEx(false, "层叠样式表管理工具", pluginPath + 'index.html', 440, 500, "", null, null);
}
function sm_InitButton() {
    let pluginPath = objApp.GetPluginPathByScriptFileName("sm_global.js");
    let langFileName = pluginPath + "plugin.ini";
    let buttonText = objApp.LoadStringFromFile(langFileName, "strSM");
    objWindow.AddToolButton("document", "SM_button", buttonText, pluginPath + "logo-jquery.ico", "sm_OnButtonClicked");
}

sm_InitButton();