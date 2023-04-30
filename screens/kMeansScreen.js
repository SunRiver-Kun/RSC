var _G = Number.prototype._G;
var filePath = "screens/kMeansScreen";
if (_G.loadedFiles[filePath] == null) {
    _G.loadedFiles[filePath] = exports;
    print("Load " + filePath);

    var ClusterBaseScreen = require("users/sunriverkun/gee_test:screens/clusterBaseScreen.js");

    exports.new = function () {
        var panel = _G.verticals();
        var self = ClusterBaseScreen.new("kMeans");
        self.base = self.c;
        self.c = exports;

        self.nClustersLabel = ui.Label("聚类数");
        self.nClustersTex = ui.Textbox("默认5", "5");
        panel.add(_G.horizontals([self.nClustersLabel, self.nClustersTex]));

        self.maxIterationsLabel = ui.Label("最大迭代次数");
        self.maxIterationsTex = ui.Textbox("", "");
        panel.add(_G.horizontals([self.maxIterationsLabel, self.maxIterationsTex]));

        ClusterBaseScreen.setArgsWidget(self, panel);
        ClusterBaseScreen.init(self);

        return self;
    };

    exports.getClassifier = function (self) {
        var nClusters = _G.Astr2PInt(self.nClustersTex.getValue(), "聚类数应为正整数");
        var maxIterations = parseInt(self.maxIterationsTex.getValue());
        if (isNaN(maxIterations) || maxIterations < 1) { maxIterations = undefined; }

        return ee.Clusterer.wekaKMeans({
            nClusters: nClusters,
            maxIterations: maxIterations
        });
    };

} else {
    exports = _G.loadedFiles[filePath];
}