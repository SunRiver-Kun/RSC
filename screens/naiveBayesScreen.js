var _G = Number.prototype._G;
var filePath = "screens/naiveBayesScreen";
if (_G.loadedFiles[filePath] == null) {
    _G.loadedFiles[filePath] = exports;
    print("Load " + filePath);

    var ClassifyBaseScreen = require("users/sunriverkun/gee_test:screens/classifyBaseScreen.js");

    exports.new = function () {
        var panel = _G.verticals();
        var self = ClassifyBaseScreen.new("Naive Bayes", "");
        self.base = self.c;
        self.c = exports;

        ClassifyBaseScreen.setArgsWidget(self, panel);
        ClassifyBaseScreen.init(self);

        return self;
    };

    exports.getClassifier = function (self) {
        return ee.Classifier.smileNaiveBayes();
    };

} else {
    exports = _G.loadedFiles[filePath];
}