var _G = Number.prototype._G;
var filePath = "screens/clusterBaseScreen";
if (_G.loadedFiles[filePath] == null) {
    _G.loadedFiles[filePath] = exports;
    print("Load " + filePath);

    var MapDrawer = require("users/sunriverkun/gee_test:widgets/mapDrawer.js");
    var ImageChooser = require("users/sunriverkun/gee_test:widgets/imageChooser.js");
    var divCh = ";";

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
        self.imageChooser = ImageChooser.new(false, _G.handler(self, exports.onSetImage));
        self.bandsLabel = ui.Label("分类波段名");
        self.bandsTex = ui.Textbox("以" + divCh + "分割每个波段名", "");
        panel.add(self.imageChooser.widget);
        panel.add(_G.horizontals([self.bandsLabel, self.bandsTex]));

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
        
        panel.add(ui.Label("当影像过大时，可以选择绘制训练区域和减少分类波段数。", _G.styles.des));

        ImageChooser.setImageName(self.imageChooser, "LANDSAT/LC08/C01/T1_SR/LC08_192024_20160624");

        return self;
    };

    exports.setRegion = function (self, region) {
        self.region = region;
        self.regionLabel.setValue(region == null ? "(全部)" : "(部分)");
    };

    exports.onSetImage = function (self, name) {
        exports.setRegion(self, null);
        self.bandsTex.setValue(_G.getImageBands(name).join(divCh));
    };

    exports.getShowImage = function (self) {
        return ImageChooser.getShowImage(self.imageChooser);
    };

    exports.getBands = function (self) {
        var str = self.bandsTex.getValue();
        if(str == "") { return null; }
        var bands = str.split(divCh);
        for (var i = bands.length - 1; i >= 0; --i) {
            if (bands[i] == "") {
                bands.splice(i, 1);
            }
        }
        return bands;
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

    //abstract
    exports.getClassifier = function (self) {
        return null;
    };

    //optional

    exports.onClass = function (self) {
        var bands = exports.getBands(self);
        if (bands == null || bands.length == 0) { alert("未填写分类波段名称"); return; }

        var classifier = self.c.getClassifier(self);
        if (classifier == null) { return; }

        var image = exports.getShowImage(self);
        if (image == null) { return; }

        print("image", image);
        var training = image.select(bands).sample({
            region: self.region,
            scale: 30,
            numPixels: 50
        });
        print("training", training);
        var clusterer = classifier.train(training, bands);
        var result = image.cluster(clusterer);
        print("result", result);

        result = result.randomVisualizer();
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