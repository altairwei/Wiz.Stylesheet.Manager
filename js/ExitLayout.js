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

class BrowserInjector {
    //TODO: 将返回值添加到retValue属性上
    constructor(script, objBrowser) {
        //TODO: 首先判断脚本类型：将script, scriptFile, function区分开来
        this.scriptType = this._checkScriptType(script);
        this.script = script;
        //TODO: 检测objBrowser类型，如果没有传入objBrowser或者类型错误，就获得当前Browser
        if ( objBrowser instanceof Object ) {
            this.objBrowser = objBrowser;
        } else {
            this.objBrowser = objWindow.CurrentDocumentBrowserObject;
        }
        
    };

    inject() {
        //TODO: 定制成功和错误的消息通知及通知函数。
        //TODO: 返回一个Promise对象，让用户可以通过callback获得传出值。
        return this._initInjectionLoop(this.script, this.objBrowser, this.scriptType).catch((e)=>console.error(e));
    };

    _initInjectionLoop(script, objBrowser, type) {
        let that = this;
        switch ( type ) {
            case "Script" :
            case "File" :
            case "Function" :
                return this._chooseInjectorApply(script, objBrowser, type)
                break;
            case "Array" :
                return new Promise(function(resolve, reject){
                    // forEach()异步等价物
                    /*
                    return Promise.all(script.map(function(scriptItem) {
                        let scriptType = that._checkScriptType(scriptItem);
                        return that._chooseInjectorToApply(scriptItem, objBrowser, scriptType)
                    }));
                    */
                    // 初始化 PromiseLoop
                    let PromiseLoop = that._chooseInjectorApply(script[0], objBrowser, that._checkScriptType(script[0]));
                    // 执行数组中剩余的脚本注入
                    for ( let i = 1; i < script.length; i++ ) {
                        // 检测当前元素的脚本类型
                        let scriptType = that._checkScriptType(script[i]);
                        // 每个循环返回一个Promise对象，从而链式调用
                        PromiseLoop = PromiseLoop.then(
                            function(ret){
                                return that._chooseInjectorApply(script[i], objBrowser, scriptType);
                            }, 
                            function(error){
                                console.log(error);
                            }
                        )
                    }
                    // 将PromiseLoop中的值传出
                    PromiseLoop.then(function(ret){
                        resolve(ret);
                    }).catch(function(error){
                        console.log(error);
                    })
                })
            
        }
        
    };

    _checkScriptType(script) {
        let objClass = script.constructor
        let pathExam = /^[a-zA-Z]:((\\|\/)[a-z0-9\s_@\-^!#$%&+={}\[\]\.]+)+\.js$/i;
        let type;
        switch (objClass) {
            case String:
                if ( script.search(pathExam) != -1 ) type = "File";
                else type = "Script";
                break;
            case Object:
                type = 'Function'
                break;
            case Array:
                type = 'Array';
                break;

        }
        return type;
    };

    _chooseInjectorApply(script, objBrowser, type) {
        let that = this;
        // 返回 Promise 对象
        switch ( type ) {
            case "Script" :
                return new Promise(function(resolve, reject){
                    objBrowser.ExecuteScript(script, function(ret){
                        return resolve(ret);
                    });
                })
                break;
            case "File" :
                return new Promise(function(resolve, reject){
                    objBrowser.ExecuteScriptFile(script, function(ret){
                        return resolve(ret);
                    });
                })
                break;
            case "Function" :
                return new Promise(function(resolve, reject){
                    // 判断Function类型是否传入了参数
                    script['arg'] = script['arg'] ? script['arg'] : [];
                    let funcType = 'Function' + script['arg'].length;
                    // 组装参数列表
                    let argArray = [ script['functionName'] ].concat(script['arg']);
                    argArray.push(function(ret){
                        return resolve(ret);
                    });
                    objBrowser['Execute' + funcType].apply(objBrowser, argArray);
                })
                break;
        }
    }
}

(function() {
    let objBrowser = objWindow.CurrentDocumentBrowserObject;
    objBrowser.ExecuteFunction1("clearUp", false, function(ret) {
        if (ret) {
            WizAlert("成功完成清理！", "success");
        } else {
            WizAlert("清理失败，请放弃修改！", "error");
        }
    })
})()