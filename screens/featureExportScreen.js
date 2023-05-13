var _G = Number.prototype._G;
var filePath = "screens/featureExportScreen";
if (_G.loadedFiles[filePath] == null) {
    _G.loadedFiles[filePath] = exports;
    print("Load " + filePath);

    var FeatureDrawer = require("users/sunriverkun/gee_test:widgets/featureDrawer.js");

    exports.new = function () {
        var panel = ui.Panel();
        panel.setLayout(ui.Panel.Layout.flow("vertical"));
        var self = {
            c: exports,
            widget: panel,

        };


        panel.add(ui.Label("绘图导出界面",  _G.styles.totalTitle));
        //绘图
        self.featureDrawer = FeatureDrawer.new();
        panel.add(ui.Label("🎨导出区域", _G.styles.title));
        panel.add(self.featureDrawer.widget);

        //导出设置
        self.formatSelect = ui.Select(["kml", "kmz","csv", "geojson"], "选择导出格式", "kml");
        self.filenameTex = ui.Textbox("请输入文件名", "feature");
        self.downLoadButton = ui.Button("获取下载链接", _G.handler(self, exports.onDownLoadButtonClick));
        self.downLoadLabel = ui.Label("", { shown: false });

        panel.add(ui.Label("⚙导出设置", _G.styles.title));
        panel.add(_G.horizontals([ui.Label("格式"), self.formatSelect]));
        panel.add(_G.horizontals([ui.Label("文件名"), self.filenameTex]));
        panel.add(_G.horizontals([self.downLoadButton, self.downLoadLabel]));

        return self;
    };


    //导出设置
    exports.onDownLoadButtonClick = function (self) {
        self.downLoadLabel.setValue("Loading...");
        self.downLoadLabel.setUrl(null);
        _G.show(self.downLoadLabel);

        var collection = FeatureDrawer.getFeatureCollection(self.featureDrawer);
        if (collection == null) {
            alert("获取导出区域失败。");
            _G.hide(self.downLoadLabel);
            return;
        }
        var name = self.filenameTex.getValue();
        collection.getDownloadURL(self.formatSelect.getValue(), undefined, name != "" ? name : "feature", function (url) {
            if (url && url != "") {
                self.downLoadLabel.setValue("点击下载");
                self.downLoadLabel.setUrl(url);
                _G.show(self.downLoadLabel);
            } else {
                alert("获取下载链接失败。");
                _G.hide(self.downLoadLabel);
            }
        });
    };


} else {
    exports = _G.loadedFiles[filePath];
}