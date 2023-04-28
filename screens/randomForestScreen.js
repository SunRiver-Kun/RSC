var _G = Number.prototype._G;
var filePath = "screens/randomForestScreen";
if (_G.loadedFiles[filePath] == null) {
    _G.loadedFiles[filePath] = exports;
    print("Load " + filePath);

    var ClassifyBaseScreen = require("users/sunriverkun/gee_test:screens/classifyBaseScreen.js");

    exports.new = function () {
        var panel = _G.verticals();
        var self = ClassifyBaseScreen.new("Random Forest", "");
        self.base = self.c;
        self.c = exports;

        self.numberOfTreesLabel = ui.Label("决策树数量");
        self.numberOfTreesTex = ui.Textbox("默认为1 (正整数)", "1");
        panel.add(_G.horizontals([self.numberOfTreesLabel, self.numberOfTreesTex]));

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

        var numberOfTrees = _G.Astr2UInt(self.numberOfTreesTex.getValue(), "决策树数量应为正整数");
        var minLeafPopulation = _G.Astr2UInt(self.minLeafPopulationTex.getValue(), "最小节点数应为正整数");
        if (numberOfTrees == null || minLeafPopulation == null) { return null; }

        return ee.Classifier.smileRandomForest({
            numberOfTrees: numberOfTrees,
            minLeafPopulation: minLeafPopulation,
            maxNodes: maxNodes
        });
    };

} else {
    exports = _G.loadedFiles[filePath];
}