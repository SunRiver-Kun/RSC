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

        ClusterBaseScreen.setOnClass(self, exports.onClass);
        ClusterBaseScreen.setArgsWidget(self, panel);
        ClusterBaseScreen.init(self);

        return self;
    };

    exports.onClass = function (self, image) {
        var imageName = self.imageNameTex.getValue();
        if (imageName == "") { alert("遥感图像名不应为空"); return; }

        var nClusters = parseInt(self.nClustersTex.getValue());
        if (isNaN(nClusters) || nClusters < 1) { alert("聚类数应为正整数"); return; }

        var maxIterations = parseInt(self.maxIterationsTex.getValue());
        if (isNaN(maxIterations) || maxIterations < 1) { maxIterations = null; }

        var input = image != null ? image : ee.Image(imageName);
        print("input", input);
        var training = input.sample({
            region: self.region,
            scale: 30,
            numPixels: 5000
        });
        print("training", training);
        var clusterer = ee.Clusterer.wekaKMeans({
            nClusters: nClusters,
            maxIterations: maxIterations
        }).train(training);
        var result = input.cluster(clusterer).randomVisualizer();
        print("result", result);
        Map.addLayer(result, {}, "KMeans");
    };

} else {
    exports = _G.loadedFiles[filePath];
}