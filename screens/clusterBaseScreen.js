var _G = Number.prototype._G;
var filePath = "screens/clusterBaseScreen";
if (_G.loadedFiles[filePath] == null) {
    _G.loadedFiles[filePath] = exports;
    print("Load " + filePath);

    exports.new = function (argsWidget, onClass) {
        var panel = ui.Panel();
        panel.setLayout(ui.Panel.Layout.flow("vertical"));
        var self = {
            c: exports,
            widget: panel
        };
        //图像输入
        self.imageLabel = ui.Label("遥感图像名");
        self.imageNameTex = ui.Textbox("", "LANDSAT/LE7_TOA_1YEAR/2001");
        self.chooseButton = ui.Button("选择", function () {
            print("TODO: 打开searchScreen");
        });
        panel.add(_G.horizontals([self.imageLabel, self.imageNameTex, self.chooseButton], true));
        //算法参数
        panel.add(argsWidget);
        //train参数
        self.subsamplingLabel = ui.Label("二次抽样系数");
        self.subsamplingTex = ui.Textbox("(0, 1]", "1");
        panel.add(_G.horizontals([self.subsamplingLabel, self.subsamplingTex]));

        self.subsamplingSeedLabel = ui.Label("二次抽样种子");
        self.subsamplingSeedTex = ui.Textbox("整数", "0");
        panel.add(_G.horizontals([self.subsamplingSeedLabel, self.subsamplingSeedTex]));

        //分类，取消
        self.classButton = ui.Button("分类", onClass);
        self.cancelButton = ui.Button("取消", function () { _G.popScreen(); });
        panel.add(_G.horizontals([self.classButton, self.cancelButton]));
        return self;
    };
} else {
    exports = _G.loadedFiles[filePath];
}