Number.prototype._G = {};    //全局变量   
var _G = Number.prototype._G;
_G.loadedFiles = {};    //加载过的文件列表，避免require时多次执行代码

require("users/sunriverkun/gee_test:functions.js");

var Hud = require("users/sunriverkun/gee_test:screens/hud.js");
_G.hud = Hud.new();
ui.root.clear();
ui.root.add(_G.hud.widget);
