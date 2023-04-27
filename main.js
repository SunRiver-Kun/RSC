Number.prototype._G = {};    //全局变量   
var _G = Number.prototype._G;
_G.loadedFiles = {};    //加载过的文件列表，避免require时多次执行代码
_G.styles = require("users/sunriverkun/gee_test:styles.js");
_G.imageParams = _G.styles.imageParams;


require("users/sunriverkun/gee_test:functions.js");
require("users/sunriverkun/gee_test:string.js");
var Hud = require("users/sunriverkun/gee_test:screens/hud.js");
_G.hud = Hud.new();
_G.map = _G.hud.map;