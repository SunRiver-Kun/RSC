var _G = Number.prototype._G;
var filePath = "screens/cobwebScreen";
if (_G.loadedFiles[filePath] == null) {
    _G.loadedFiles[filePath] = exports;
    print("Load " + filePath);

    var ClusterBaseScreen = require("users/sunriverkun/gee_test:screens/clusterBaseScreen.js");

    exports.new = function () {
        var panel = ui.Panel();
        var self = ClusterBaseScreen.new(panel, _G.handler(self, exports.onClass));
        return self;
    };

    exports.onClass = function (self) {
        print("onClass: ", self);
    };

} else {
    exports = _G.loadedFiles[filePath];
}