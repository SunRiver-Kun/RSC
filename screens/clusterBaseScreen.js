var _G = Number.prototype._G;
var filePath = "screens/clusterBaseScreen";
if (_G.loadedFiles[filePath] == null) {
    _G.loadedFiles[filePath] = exports;
    print("Load " + filePath);

    var MapDrawer = require("users/sunriverkun/gee_test:widgets/mapDrawer.js");
    var ImageBrowerScreen = require("users/sunriverkun/gee_test:screens/imageBrowerScreen.js");

    exports.new = function (name) {
        var panel = ui.Panel();
        panel.setLayout(ui.Panel.Layout.flow("vertical"));
        var self = {
            c: exports,
            widget: panel,
            name: name ? name : "Title",
            imageName: "",
            image: null
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
        self.chooseButton = ui.Button("选择", _G.handler(self, exports.onChooseButtonClick));
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
        panel.add(_G.horizontals([ui.Label("绘制训练区域(可选)"), self.regionButton, self.regionLabel], true));

        //分类，取消
        self.classButton = ui.Button("分类", _G.handler(self, exports.onClass));
        self.cancelButton = ui.Button("取消", function () { _G.popScreen(); });
        panel.add(_G.horizontals([self.classButton, self.cancelButton]));
        return self;
    };

    exports.setRegion = function (self, region) {
        self.region = region;
        self.regionLabel.setValue(region == null ? "(全部)" : "(部分)");
    };

    exports.getShowImage = function (self) {
        var name = self.imageNameTex.getValue();
        if (name == "") { return null; }

        if (_G.isClipImageName(name)) {
            if (self.imageName == name && self.image != null) {
                Map.centerObject(self.image);
                _G.rawAddLayerOrHideBefore(self.image, _G.getImageVisualParams(name), name);
                return self.image
            } else {
                alert("遥感图像名错误，裁剪后图像名被修改，或是直接使用了裁剪后图像名");
                return null;
            }
        } else {
            _G.addLayerOrHideBefore(name, true);
            return ee.Image(name);
        }
    }

    exports.openMapDrawScreen = function (self) {
        if (exports.getShowImage(self) == null) { return; }
        var mapDrawScreen = MapDrawer.new("请绘制训练区域", function (geoLayers) {
            var length = geoLayers.length();
            exports.setRegion(self, length > 0 ? geoLayers.get(length - 1).toGeometry() : null);
        }, null, true);
    };

    exports.onChooseButtonClick = function (self) {
        var screen = ImageBrowerScreen.new(function (image, imageName) {
            self.image = image;
            self.imageName = imageName;
            self.imageNameTex.setValue(imageName);
            _G.popScreen();
        });
        _G.pushScreen(screen);
    }

    exports.onClass = function (self) {
        var image = exports.getShowImage(self);
        if (image == null) { return; }

        if (self.onClass) { self.onClass(self, image); }
    };

    exports.setOnClass = function (self, fn) {
        self.onClass = fn;
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