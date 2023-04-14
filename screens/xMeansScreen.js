var _G = Number.prototype._G;
var filePath = "screens/xMeansScreen";
if (_G.loadedFiles[filePath] == null) {
    _G.loadedFiles[filePath] = exports;
    print("Load " + filePath);

    var ClusterBaseScreen = require("users/sunriverkun/gee_test:screens/clusterBaseScreen.js");

    exports.new = function () {
        var panel = _G.verticals();
        var self = ClusterBaseScreen.new();
        self.base = self.c;
        self.c = exports;

        self.minClustersLabel = ui.Label("最小聚类数");
        self.minClustersTex = ui.Textbox("默认2", "2");
        panel.add(_G.horizontals([self.minClustersLabel, self.minClustersTex]));

        self.maxClustersLabel = ui.Label("最大聚类数");
        self.maxClustersTex = ui.Textbox("默认10", "10");
        panel.add(_G.horizontals([self.maxClustersLabel, self.maxClustersTex]));

        self.maxIterationsLabel = ui.Label("最大迭代次数");
        self.maxIterationsTex = ui.Textbox("", "3");
        panel.add(_G.horizontals([self.maxIterationsLabel, self.maxIterationsTex]));

        ClusterBaseScreen.setOnClass(self, exports.onClass);
        ClusterBaseScreen.setArgsWidget(self, panel);
        ClusterBaseScreen.init(self);

        return self;
    };

    exports.onClass = function (self) {
        var imageName = self.imageNameTex.getValue();
        if (imageName == "") { alert("遥感图像名不应为空"); }
        var minClusters = _G.Astr2PInt(self.minClustersTex.getValue(), "最小聚类数应为正整数");
        var maxClusters = _G.Astr2PInt(self.maxClustersTex.getValue(), "最大聚类数应为正整数");

        var maxIterations = parseInt(self.maxIterationsTex.getValue());
        if (isNaN(maxIterations) || maxIterations < 1) { maxIterations = null; }

        if (self.region == null) { alert("未绘制训练区域"); }

        if (imageName == "" || minClusters == null || maxClusters == null) {
            print("分类失败，参数错误");
            return;
        }
        if (minClusters > maxClusters) { alert("最小聚类数不应大于最大聚类数"); return; }

        var input = ee.Image(imageName);
        print("input", input);
        var training = input.sample({
            region: self.region,
            scale: 30,
            numPixels: 5000
        });
        print("training", training);
        var clusterer = ee.Clusterer.wekaXMeans({
            minClusters: minClusters,
            maxClusters: maxClusters,
            maxIterations: maxIterations
        }).train(training);
        var result = input.cluster(clusterer).randomVisualizer();
        print("result", result);
        Map.addLayer(result, {}, "XMeans");
    };

} else {
    exports = _G.loadedFiles[filePath];
}