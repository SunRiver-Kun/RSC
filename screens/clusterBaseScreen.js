var _G = Number.prototype._G;
var filePath = "screens/clusterBaseScreen";
if (_G.loadedFiles[filePath] == null) {
    _G.loadedFiles[filePath] = exports;
    print("Load " + filePath);

    exports.new = function () {
        var panel = ui.Panel();
        panel.setLayout(ui.Panel.Layout.flow("vertical"));
        var self = {
            c: exports,
            widget: panel
        };
        return self;
    };

    exports.init = function (self) {
        var panel = self.widget;
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
        self.subsamplingLabel = ui.Label("二次抽样系数");
        self.subsamplingSlider = ui.Slider(0.1, 1, 1, 0.1);
        panel.add(_G.horizontals([self.subsamplingLabel, self.subsamplingSlider]));

        self.subsamplingSeedLabel = ui.Label("二次抽样种子(整数)");
        self.subsamplingSeedTex = ui.Textbox("默认0", "0");
        panel.add(_G.horizontals([self.subsamplingSeedLabel, self.subsamplingSeedTex]));

        //分类，取消
        self.classButton = ui.Button("分类", _G.handler(self, exports.onClass));
        self.cancelButton = ui.Button("取消", function () { _G.popScreen(); });
        panel.add(_G.horizontals([self.classButton, self.cancelButton]));
        return self;
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