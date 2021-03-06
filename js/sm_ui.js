// 浏览器对象
var objApp = window.external;
var objDatabase = objApp.Database;
var objCommon = objApp.CreateWizObject("WizKMControls.WizCommonUI");
var objWindow = objApp.Window;
var pluginPath = objApp.GetPluginPathByScriptFileName("sm_global.js");

// 定义BrowserInjector原型对象

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
            this.objBrowser = window.external.Window.CurrentDocumentBrowserObject;
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

// 工具

function messageToUser(str, type = 'success'){
    if ( typeof($.notify) == 'undefined' ) {
        //TODO: 实现通知类型的判断
        console.log(str);
    } else if ( typeof($.notify) == 'function' ) {
        $.notify(str, type);
    }
}

function injectSelectedJsToBrowser(jsName){
    let jQueryPath = pluginPath + "lib/jQuery/jquery-3.3.1.min.js";
    let jQueryUIPath = pluginPath + "lib/jQuery-UI/jquery-ui.js";
    let ElementControllerPath = pluginPath + "js/ElementController.js";
    let objBrowser = objWindow.CurrentDocumentBrowserObject;

    switch (jsName) {
        case "jQuery": 
            objBrowser.ExecuteScriptFile(jQueryPath, function(ret){
                messageToUser("已执行jQuery注入！", "success");
            });
            break;
        case "All": 
            injectAllScript();
            break;
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
    let objBrowser = objWindow.CurrentDocumentBrowserObject;
    let dynamicLayoutScript = [
        pluginPath + "lib/jQuery/jquery-3.3.1.min.js",
        pluginPath + "lib/jQuery-UI/jquery-ui.js",
        pluginPath + "js/fontawesome-all.js",
        pluginPath + "js/ElementController.js",
        {
            functionName: 'Init',
            arg: [objApp, objCommon, window.WizChromeBrowser, pluginPath]
        }
    ];
    let scriptInjector =  new BrowserInjector(dynamicLayoutScript, objBrowser);

    messageToUser("正在启动动态布局……", "info");
    scriptInjector.inject().then(function(ret){
        if (ret) {
            messageToUser("成功进入动态布局模式！", "success");
        } else {
            messageToUser("脚本初始化失败！", "error");
        }
    });
}

function initDynamicLayout() {
    // 动态布局
    $( '#js-menu' ).selectmenu({
        classes: {
            "ui-selectmenu-button": "ui-button-icon-only demo-splitbutton-select"
        },
        change: function(){
            $( "#injector-btn" ).attr('value', this.value).text($(this).find(':selected').text());
        }
    });

    // 初始化脚本注入按钮
    $( ".controlgroup" ).controlgroup({
        onlyVisible: false,
    })
    .find("#injector-btn").click(function() {
        let jsName = $(this).attr('value');
        injectSelectedJsToBrowser(jsName);
    });

    $("#save-clear").button().click(function() {
        let objBrowser = objWindow.CurrentDocumentBrowserObject;
        objBrowser.ExecuteFunction1("clearUp", true, function(ret) {
            if (ret) {
                messageToUser("成功保存并完成清理！", "success");
            } else {
                messageToUser("清理失败，请放弃修改！", "error");
            }
        })
    })

    $("#clear").button().click(function() {
        let objBrowser = objWindow.CurrentDocumentBrowserObject;
        objBrowser.ExecuteFunction1("clearUp", false, function(ret) {
            if (ret) {
                messageToUser("成功完成清理！", "success");
            } else {
                messageToUser("清理失败，请放弃修改！", "error");
            }
        })
    })
}

$(document).ready(function(){
    // 设置Notify
    $.notify.defaults({
        position: "bottom",
    })

    // 设置UI控件

    // 功能分页
    $( "#function-tabs" ).tabs({
        active: 2
    });

    // 元素批处理
    $( "#accordion" ).accordion({
        collapsible: true
    });

    // 样式管理
    $( "#css-toolbar" ).controlgroup({
        onlyVisible: false,
    })

    // 动态布局
    initDynamicLayout();

    // 注入自定义脚本
    $('#inject-js').button().click(function(){
        let js = $('#js-str').val();
        injectJsToBrowser(js);
    })

    // 加载完毕后再展示<body>
    $('body').css('visibility', 'visible');

    // 单元测试
    function testInjectionLoop() {
        let objBrowser = objWindow.CurrentDocumentBrowserObject;
        let script = [
            "var Speak = (arg1, arg2, arg3, arg4) => console.log(arg1, arg2, arg3, arg4)",
            {
                functionName: 'Speak',
                arg: ['A', '1', '2', '3'],
            },
            pluginPath + 'js/test.js',
        ]
        var objInjector = new BrowserInjector(script, objBrowser);
        objInjector.inject().catch( (e) => console.warn(e) );

    };

});