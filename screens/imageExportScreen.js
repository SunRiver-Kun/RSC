var _G = Number.prototype._G;
var filePath = "screens/imageExportScreen";
if (_G.loadedFiles[filePath] == null) {
    _G.loadedFiles[filePath] = exports;
    print("Load " + filePath);

    var divCh = ";";
    //{ name1:{image: , bands:[]} }
    exports.new = function (data) {
        var panel = ui.Panel();
        panel.setLayout(ui.Panel.Layout.flow("vertical"));
        var self = {
            c: exports,
            widget: panel,
            data: data
        };

        self.imageSelect = ui.Select(Object.keys(data), "请选择导出图像", undefined, _G.handler(self, exports.onImageSelectChange));
        self.filenameTex = ui.Textbox("请输入文件名", "image");
        self.bandsTex = ui.Textbox("以" + divCh + "分割每个波段名", "");
        self.scaleTex = ui.Textbox("默认1000 (正整数)", "1000");
        self.typeSelect = ui.Select(["ZIPPED_GEO_TIFF", "GEO_TIFF"], "请选择导出类型", "ZIPPED_GEO_TIFF");
        self.downLoadButton = ui.Button("获取下载链接", _G.handler(self, exports.onDownLoadButtonClick));
        self.downLoadLabel = ui.Label("", { shown: false });
        self.errorLabel = ui.Label("", { color: "red", shown: false, padding: "0px", margin: "auto" });

        panel.add(ui.Label("遥感图像导出界面", _G.styles.totalTitle));
        panel.add(_G.horizontals([ui.Label("导出图像"), self.imageSelect]));
        panel.add(_G.horizontals([ui.Label("文件名"), self.filenameTex]));
        panel.add(_G.horizontals([ui.Label("波段名"), self.bandsTex]));
        panel.add(_G.horizontals([ui.Label("缩放(米/像素)"), self.scaleTex]));
        panel.add(_G.horizontals([ui.Label("导出类型"), self.typeSelect]));
        panel.add(_G.horizontals([self.downLoadButton, self.downLoadLabel]));
        panel.add(self.errorLabel);

        return self;
    };

    exports.getImage = function (self) {
        return self.data[self.imageSelect.getValue()].image;
    };

    exports.getBands = function (self) {
        var str = self.bandsTex.getValue();
        var bands = str.split(divCh);
        for (var i = bands.length - 1; i >= 0; --i) {
            if (bands[i] == "") {
                bands.splice(i, 1);
            }
        }
        return bands;
    };

    exports.onImageSelectChange = function (self) {
        var bands = self.data[self.imageSelect.getValue()].bands;
        if (bands == null) { print("[ERROR]: imageExportScreen.onImageSelectChange bands is null"); return; }
        self.bandsTex.setValue(bands.join(divCh));
    };

    exports.onDownLoadButtonClick = function (self) {
        //错误监测
        _G.hide(self.downLoadLabel);
        _G.hide(self.errorLabel);
        var scale = _G.Astr2PInt(self.scaleTex.getValue(), "缩放比例应为正整数");
        if (scale == null) { return; }
        var bands = exports.getBands(self);
        if (bands == null || bands.length == 0) { alert("波段名不能为空"); return; }


        self.downLoadLabel.setValue("Loading...");
        self.downLoadLabel.setUrl(null);
        _G.show(self.downLoadLabel);

        ee.data.getDownloadId({
            image: exports.getImage(self),
            name: self.filenameTex.getValue(),
            bands: bands,
            //region: region,
            scale: scale,
            //filePerBand: false
            format: self.typeSelect.getValue()
        }, function (downloadId, errorStr) {
            if (downloadId) {
                self.downLoadLabel.setValue("点击下载");
                self.downLoadLabel.setUrl(ee.data.makeDownloadUrl(downloadId));
            } else {
                self.downLoadLabel.setValue("failure");
                self.errorLabel.setValue(errorStr);
                _G.show(self.errorLabel);
            }
        });
    };

} else {
    exports = _G.loadedFiles[filePath];
}