var _G = Number.prototype._G;
var filePath = "screens/minimumDistanceScreen";
if (_G.loadedFiles[filePath] == null) {
    _G.loadedFiles[filePath] = exports;
    print("Load " + filePath);

    var ClassifyBaseScreen = require("users/sunriverkun/gee_test:screens/classifyBaseScreen.js");

    exports.new = function () {
        var panel = _G.verticals();
        var self = ClassifyBaseScreen.new("MinDistance", "");
        self.base = self.c;
        self.c = exports;

        self.metricTypes = {
            "欧几里": "euclidean",
            "余弦": "cosine"
        };
        self.metricLabel = ui.Label("距离函数");
        self.metricSelect = ui.Select(Object.keys(self.metricTypes), "请选择距离函数", "欧几里");
        panel.add(_G.horizontals([self.metricLabel, self.metricSelect]));

        ClassifyBaseScreen.setArgsWidget(self, panel);
        ClassifyBaseScreen.init(self);

        return self;
    };

    exports.getClassifier = function (self) {
        var metric = self.metricTypes[self.metricSelect.getValue()];
        return ee.Classifier.minimumDistance(metric);
    };

} else {
    exports = _G.loadedFiles[filePath];
}