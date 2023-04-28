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

        ClassifyBaseScreen.setOnClass(self, exports.onClass);
        ClassifyBaseScreen.setArgsWidget(self, panel);
        ClassifyBaseScreen.init(self);

        return self;
    };

    exports.onClass = function (self, input) {
        var imageName = self.imageNameTex.getValue();
        if (imageName == "") { alert("遥感图像名不应为空"); return; }

        var points = ClassifyBaseScreen.getPoints(self);  //FeatureCollection
        if (points == null) { alert("未绘制样板点"); return; }

        var maxNodes = self.maxNodesTex.getValue() == "" ? undefined : _G.Astr2UInt(self.maxNodesTex.getValue(), "最大节点数应留空或为正整数");
        if (maxNodes == null) { maxNodes = undefined; }

        var minLeafPopulation = _G.Astr2UInt(self.minLeafPopulationTex.getValue(), "最小节点数应为正整数");
        if (minLeafPopulation == null) { return; }

        var image = input != null ? input : ee.Image(imageName);
        var classProperty = ClassifyBaseScreen.getClassProperty();
        var bands = ClassifyBaseScreen.getBands(self);

        var training = image.select(bands).sampleRegions({
            collection: points,
            properties: [classProperty],
            scale: 30
        });
        print('training', training);
        var classifier = ee.Classifier.smileCart(maxNodes, minLeafPopulation).train({
            features: training,
            classProperty: classProperty,
            inputProperties: bands
        });
        var classified = image.select(bands).classify(classifier);
        print("classified", classified);
        //Display classification
        Map.centerObject(classified);
        Map.addLayer(classified, ClassifyBaseScreen.getClassifyVisParams(self), 'Cart');
    };

} else {
    exports = _G.loadedFiles[filePath];
}