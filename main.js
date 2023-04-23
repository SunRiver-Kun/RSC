Number.prototype._G = {};    //全局变量   
var _G = Number.prototype._G;
_G.loadedFiles = {};    //加载过的文件列表，避免require时多次执行代码

require("users/sunriverkun/gee_test:functions.js");

var ToolBox = require("users/sunriverkun/gee_test:widgets/toolBox.js");
var toolBox = ToolBox.new();
toolBox.widget.style().set({
    position : "middle-right",
    margin  : "20px"
});
Map.add(toolBox.widget);