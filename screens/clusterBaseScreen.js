var _G = Number.prototype._G;
var filePath = "screens/clusterBaseScreen";
if (_G.loadedFiles[filePath] == null) {
    _G.loadedFiles[filePath] = exports;
    print("Load " + filePath);

    var MapDrawScreen = require("users/sunriverkun/gee_test:screens/mapDrawScreen.js");

    exports.new = function (name) {
        var panel = ui.Panel();
        panel.setLayout(ui.Panel.Layout.flow("vertical"));
        var self = {
            c: exports,
            widget: panel,
            name : name ? name : "Title"
        };
        return self;
    };

    exports.init = function (self) {
        var panel = self.widget;
        //标题
        self.titleLabel = ui.Label(self.name, _G.styles.totalTitle);
        panel.add(self.titleLabel);
        //图像输入
        self.imageLabel = ui.Label("遥感图像名");
        self.imageNameTex = ui.Textbox("", "LANDSAT/LC08/C01/T1_SR/LC08_192024_20160624");
        self.chooseButton = ui.Button("选择", function () {
            print("TODO: 打开searchScreen");
        });
        panel.add(_G.horizontals([self.imageLabel, self.imageNameTex, self.chooseButton], true));
        //算法参数
        self.argsPanel = ui.Panel();
        if (self.argsWidget) { self.argsPanel.add(self.argsWidget); }
        panel.add(self.argsPanel);
        //train参数
        // self.subsamplingLabel = ui.Label("二次抽样系数");
        // self.subsamplingSlider = ui.Slider(0.1, 1, 1, 0.1);
        // panel.add(_G.horizontals([self.subsamplingLabel, self.subsamplingSlider]));

        // self.subsamplingSeedLabel = ui.Label("二次抽样种子(整数)");
        // self.subsamplingSeedTex = ui.Textbox("默认0", "0");
        // panel.add(_G.horizontals([self.subsamplingSeedLabel, self.subsamplingSeedTex]));
        //选择训练区域
        self.region = null;
        self.regionButton = ui.Button("绘制", _G.handler(self, exports.openMapDrawScreen));
        self.regionLabel = ui.Label("");
        exports.setRegion(self, null);
        panel.add(_G.horizontals([ui.Label("绘制训练区域(可选)"),self.regionButton, self.regionLabel], true));

        //分类，取消
        self.classButton = ui.Button("分类", _G.handler(self, exports.onClass));
        self.cancelButton = ui.Button("取消", function () { _G.popScreen(); });
        panel.add(_G.horizontals([self.classButton, self.cancelButton]));
        return self;
    }

    exports.setRegion = function (self, region) {
        self.region = region;
        self.regionLabel.setValue(region == null ? "(全部)" : "(部分)");
    }

    exports.openMapDrawScreen = function (self) {
        _G.addLayer(self.imageNameTex.getValue(), true);
        var mapDrawScreen = MapDrawScreen.new("请绘制训练区域", function (geoLayers) {
            var length = geoLayers.length();
            exports.setRegion(self, length > 0 ? geoLayers.get(length - 1).toGeometry() : null);
        })
    }

    exports.onClass = function (self) {
        if (self.onClass) { self.onClass(self); }
    }

    exports.setOnClass = function (self, fn) {
        self.onClass = fn;
    }

    exports.setArgsWidget = function (self, argsWidget) {
        self.argsWidget = argsWidget;
        if (self.argsPanel) {
            self.argsPanel.clear();
            self.argsPanel.add(argsWidget);
        }
    }

} else {
    exports = _G.loadedFiles[filePath];
}