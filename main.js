Number.prototype._G = {};    //全局变量   
var _G = Number.prototype._G;
_G.loadedFiles = {};    //加载过的文件列表，避免require时多次执行代码

require("users/sunriverkun/gee_test:functions.js");

var ToolBox = require("users/sunriverkun/gee_test:widgets/toolBox.js");
var toolBox = ToolBox.new();
toolBox.widget.style().set({
    position : "top-right",
});

var toolBoxButton = ui.Button("工具栏", function () { ToolBox.show(toolBox); }, undefined, { 
    position : "top-right",
    padding : "0px",
    margin : "150px"
});

Map.add(toolBoxButton);
Map.add(toolBox.widget);
