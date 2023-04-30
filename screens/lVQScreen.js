var _G = Number.prototype._G;
var filePath = "screens/lVQScreen";
if (_G.loadedFiles[filePath] == null) {
    _G.loadedFiles[filePath] = exports;
    print("Load " + filePath);

    var ClusterBaseScreen = require("users/sunriverkun/gee_test:screens/clusterBaseScreen.js");

    exports.new = function () {
        var panel = _G.verticals();
        var self = ClusterBaseScreen.new("LVQ", "Learning Vector Quantization");
        self.base = self.c;
        self.c = exports;

        self.numClustersLabel = ui.Label("聚类数");
        self.numClustersTex = ui.Textbox("默认5 (正整数)", "5");
        panel.add(_G.horizontals([self.numClustersLabel, self.numClustersTex]));

        self.learningRateLabel = ui.Label("分类精度");
        self.learningRateTex = ui.Slider(0.1, 1, 0.1, 0.1);
        panel.add(_G.horizontals([self.learningRateLabel, self.learningRateTex]));

        self.epochsLabel = ui.Label("训练期");
        self.epochsTex = ui.Textbox("默认1000 (正整数)", "1000");
        panel.add(_G.horizontals([self.epochsLabel, self.epochsTex]));

        ClusterBaseScreen.setArgsWidget(self, panel);
        ClusterBaseScreen.init(self);

        return self;
    };

    exports.getClassifier = function (self) {
        var numClusters = _G.Astr2PInt(self.numClustersTex.getValue(), "聚类数应为正整数");
        var learningRate = self.learningRateTex.getValue();
        var epochs = _G.Astr2PInt(self.epochsTex.getValue(), "训练期应为正整数");
        if (numClusters == null || learningRate == null || epochs == null) { return null; }

        return ee.Clusterer.wekaLVQ({
            numClusters: numClusters,
            learningRate: learningRate,
            epochs: epochs
        });
    };

} else {
    exports = _G.loadedFiles[filePath];
}