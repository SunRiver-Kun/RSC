var _G = Number.prototype._G;
var filePath = "screens/clusterBaseScreen";
if (_G.loadedFiles[filePath] == null) {
    _G.loadedFiles[filePath] = exports;
    print("Load " + filePath);

    var MapDrawer = require("users/sunriverkun/gee_test:widgets/mapDrawer.js");
    var ImageChooser = require("users/sunriverkun/gee_test:widgets/imageChooser.js");

    exports.new = function (title, titleDes) {
        var panel = ui.Panel();
        panel.setLayout(ui.Panel.Layout.flow("vertical"));
        var self = {
            c: exports,
            widget: panel,
            title: title ? title : "Title",
            titleDes: titleDes ? titleDes : ""
        };
        return self;
    };

    exports.init = function (self) {
        var panel = self.widget;
        //标题
        self.titleLabel = ui.Label(self.title, _G.styles.totalTitle);
        self.titleDesLabel = ui.Label(self.titleDes, _G.styles.des);
        panel.add(self.titleLabel);
        panel.add(self.titleDesLabel);
        //图像输入
        self.imageChooser = ImageChooser.new(false, function () { exports.setRegion(self, null); });
        panel.add(self.imageChooser.widget);

        //算法参数
        self.argsPanel = ui.Panel();
        if (self.argsWidget) { self.argsPanel.add(self.argsWidget); }
        panel.add(self.argsPanel);

        //选择训练区域
        self.region = null;
        self.regionButton = ui.Button("绘制", _G.handler(self, exports.openMapDrawScreen));
        self.regionLabel = ui.Label("");
        exports.setRegion(self, null);
        panel.add(_G.horizontals([ui.Label("绘制训练区域(可选)"), self.regionButton, self.regionLabel], true));

        //分类，取消
        self.classButton = ui.Button("分类", _G.handler(self, exports.onClass));
        self.cancelButton = ui.Button("取消", function () { _G.popScreen(); });
        panel.add(_G.horizontals([self.classButton, self.cancelButton]));

        ImageChooser.setImageName(self.imageChooser, "LANDSAT/LC08/C01/T1_SR/LC08_192024_20160624");

        return self;
    };

    exports.setRegion = function (self, region) {
        self.region = region;
        self.regionLabel.setValue(region == null ? "(全部)" : "(部分)");
    };

    //abstract
    exports.getClassifier = function (self) {
        return null;
    };

    exports.getShowImage = function (self) {
        return ImageChooser.getShowImage(self.imageChooser);
    };

    function union(a, b) {
        if (a == null) { return b; }
        if (b == null) { return a; }
        return a.union(b, 100);
    }

    exports.openMapDrawScreen = function (self) {
        if (exports.getShowImage(self) == null) { return; }
        var mapDrawScreen = MapDrawer.new("请绘制训练区域", function (geoLayers) {
            var length = geoLayers.length();
            var area = null;
            for (var i = 0; i < length; ++i) {
                area = union(area, geoLayers.get(length - 1).toGeometry());
            }
            exports.setRegion(self, area); 
        }, null, true);
    };

    exports.onClass = function (self) {
        var classifier = self.c.getClassifier(self);
        if (classifier == null) { return; }

        var image = exports.getShowImage(self);
        if (image == null) { return; }

        print("image", image);
        var training = image.sample({
            region: self.region,
            scale: 30,
            numPixels: 5000
        });
        print("training", training);
        var clusterer = classifier.train(training);
        var result = image.cluster(clusterer).randomVisualizer();
        print("result", result);
        Map.addLayer(result, {}, self.title);
    };

    exports.setArgsWidget = function (self, argsWidget) {
        self.argsWidget = argsWidget;
        if (self.argsPanel) {
            self.argsPanel.clear();
            self.argsPanel.add(argsWidget);
        }
    };

} else {
    exports = _G.loadedFiles[filePath];
}