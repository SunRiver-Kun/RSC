var _G = Number.prototype._G;
var filePath = "screens/cartScreen";
if (_G.loadedFiles[filePath] == null) {
    _G.loadedFiles[filePath] = exports;
    print("Load " + filePath);

    var ClassifyBaseScreen = require("users/sunriverkun/gee_test:screens/classifyBaseScreen.js");

    exports.new = function () {
        var panel = _G.verticals();
        var self = ClassifyBaseScreen.new("Cart", "Classification and Regression Trees");
        self.base = self.c;
        self.c = exports;

        self.minLeafPopulationLabel = ui.Label("最小节点数");
        self.minLeafPopulationTex = ui.Textbox("默认为1 (正整数)", "1");
        panel.add(_G.horizontals([self.minLeafPopulationLabel, self.minLeafPopulationTex]));

        self.maxNodesLabel = ui.Label("最大节点数");
        self.maxNodesTex = ui.Textbox("留空不限制", "");
        panel.add(_G.horizontals([self.maxNodesLabel, self.maxNodesTex]));

        ClassifyBaseScreen.setArgsWidget(self, panel);
        ClassifyBaseScreen.init(self);

        return self;
    };

    exports.getClassifier = function (self) {
        var maxNodes = self.maxNodesTex.getValue() == "" ? undefined : _G.Astr2UInt(self.maxNodesTex.getValue(), "最大节点数应留空或为正整数");
        if (maxNodes == null) { maxNodes = undefined; }

        var minLeafPopulation = _G.Astr2UInt(self.minLeafPopulationTex.getValue(), "最小节点数应为正整数");
        if (minLeafPopulation == null) { return null; }

        return ee.Classifier.smileCart(maxNodes, minLeafPopulation);
    }
} else {
    exports = _G.loadedFiles[filePath];
}