var _G = Number.prototype._G;
var filePath = "screens/xMeansScreen";
if (_G.loadedFiles[filePath] == null) {
    _G.loadedFiles[filePath] = exports;
    print("Load " + filePath);

    var ClusterBaseScreen = require("users/sunriverkun/gee_test:screens/clusterBaseScreen.js");

    exports.new = function () {
        var panel = _G.verticals();
        var self = ClusterBaseScreen.new("XMeans");
        self.base = self.c;
        self.c = exports;

        self.minClustersLabel = ui.Label("最小聚类数");
        self.minClustersTex = ui.Textbox("默认2", "2");
        panel.add(_G.horizontals([self.minClustersLabel, self.minClustersTex]));

        self.maxClustersLabel = ui.Label("最大聚类数");
        self.maxClustersTex = ui.Textbox("默认6", "6");
        panel.add(_G.horizontals([self.maxClustersLabel, self.maxClustersTex]));

        self.maxIterationsLabel = ui.Label("最大迭代次数");
        self.maxIterationsTex = ui.Textbox("", "3");
        panel.add(_G.horizontals([self.maxIterationsLabel, self.maxIterationsTex]));

        ClusterBaseScreen.setArgsWidget(self, panel);
        ClusterBaseScreen.init(self);

        return self;
    };

    exports.getClassifier = function (self) {
        var minClusters = _G.Astr2PInt(self.minClustersTex.getValue(), "最小聚类数应为正整数");
        var maxClusters = _G.Astr2PInt(self.maxClustersTex.getValue(), "最大聚类数应为正整数");

        var maxIterations = parseInt(self.maxIterationsTex.getValue());
        if (isNaN(maxIterations) || maxIterations < 1) { maxIterations = undefined; }

        if (minClusters == null || maxClusters == null) { return null; }
        if (minClusters > maxClusters) { alert("最小聚类数不应大于最大聚类数"); return null; }

        return ee.Clusterer.wekaXMeans({
            minClusters: minClusters,
            maxClusters: maxClusters,
            maxIterations: maxIterations
        });
    };

} else {
    exports = _G.loadedFiles[filePath];
}