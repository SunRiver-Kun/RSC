var _G = Number.prototype._G;
var filePath = "screens/cobwebScreen";
if (_G.loadedFiles[filePath] == null) {
    _G.loadedFiles[filePath] = exports;
    print("Load " + filePath);

    var ClusterBaseScreen = require("users/sunriverkun/gee_test:screens/clusterBaseScreen.js");
    var MapDrawScreen = require("users/sunriverkun/gee_test:screens/mapDrawScreen.js");

    exports.new = function () {
        var panel = _G.verticals();
        var self = ClusterBaseScreen.new();
        self.base = self.c;
        self.c = exports;

        self.acuityLabel = ui.Label("最小标准差");
        self.acuityTex = ui.Textbox("默认1.0", "1.0");
        panel.add(_G.horizontals([self.acuityLabel, self.acuityTex]));

        self.cutoffLabel = ui.Label("最小类别效用");
        self.cutoffTex = ui.Textbox("默认0.002", "0.002");
        panel.add(_G.horizontals([self.cutoffLabel, self.cutoffTex]));

        self.seedLabel = ui.Label("随机数种子(整数)");
        self.seedTex = ui.Textbox("默认42", "42");
        panel.add(_G.horizontals([self.seedLabel, self.seedTex]));

        self.region = null;
        self.regionButton = ui.Button("选择训练区域", _G.handler(self, exports.openMapDrawScreen));
        self.regionLabel = ui.Label("");
        exports.setRegion(self, null);
        panel.add(_G.horizontals([self.regionButton, self.regionLabel]));

        ClusterBaseScreen.setOnClass(self, exports.onClass);
        ClusterBaseScreen.setArgsWidget(self, panel);
        ClusterBaseScreen.init(self);

        return self;
    };

    exports.setRegion = function (self, region) {
        self.region = region;
        self.regionLabel.setValue(region == null ? "X" : "√");
    }

    exports.openMapDrawScreen = function (self) {
        _G.addLayer(self.imageNameTex.getValue(), true);
        var mapDrawScreen = MapDrawScreen.new("请绘制训练区域", function (geoLayers) {
            var length = geoLayers.length();
            exports.setRegion(self, length > 0 ? geoLayers.get(length - 1).toGeometry() : null);
        })
        _G.pushScreen(mapDrawScreen);
    }

    exports.onClass = function (self) {
        var imageName = self.imageNameTex.getValue();
        if (imageName == "") { alert("遥感图像名不应为空"); }
        var acuity = _G.Astr2Float(self.acuityTex.getValue(), "最小标准差应为实数。");
        var cutoff = _G.Astr2Float(self.cutoffTex.getValue(), "最小类别效用应为实数。");
        var seed = _G.Astr2Int(self.seedTex.getValue(), "随机种子应为整数。");
        var subsampling = self.subsamplingSlider.getValue();
        var subsamplingSeed = _G.Astr2Int(self.subsamplingSeedTex.getValue(), "二次抽样种子应为整数。");
        if (self.region == null) { alert("未绘制训练区域"); }

        if (imageName == "" || acuity == null || cutoff == null || seed == null || subsampling == null || subsamplingSeed == null || self.region == null) {
            print("分类失败，参数错误");
            return;
        }

        var input = ee.Image(imageName);
        print("input", input);
        var training = input.sample({
            region: self.region,
            scale: 30,
            numPixels: 5000
        });
        print("training",training);
        var clusterer = ee.Clusterer.wekaCobweb(acuity, cutoff, seed).train(training);
        var result = input.cluster(clusterer).randomVisualizer();
        print("result", result);
        Map.addLayer(result, {}, "CobWeb");
    };

} else {
    exports = _G.loadedFiles[filePath];
}