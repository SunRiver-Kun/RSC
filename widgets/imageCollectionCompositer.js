var _G = Number.prototype._G;
var filePath = "widgets/imageCollectionCompositer";
if (_G.loadedFiles[filePath] == null) {
    _G.loadedFiles[filePath] = exports;
    print("Load " + filePath);

    exports.new = function (collection, visParams, thumbnailParams, clipGeo, onChooseClick, onDownloadClick, collectionName) {
        var panel = ui.Panel();
        panel.setLayout(ui.Panel.Layout.flow("vertical"));
        var self = {
            c: exports,
            widget: panel,
            collection: collection,
            collectionName: collectionName != null ? collectionName : "",
            visParams: visParams,
            clipGeo: clipGeo,
            image: null,
            readyToChoose: false
        };
        self.modeSelect = ui.Select(["mean", "median", "mode", "min", "max", "mosaic"], "选择合成方式", "mean", _G.handler(self, exports.onModeSelectChange));
        self.chooseButton = ui.Button("选择", _G.handler(self, exports.onChooseButtonClick));
        self.downloadButton = ui.Button("下载", _G.handler(self, exports.onDownloadButtonClick), undefined, { shown: onDownloadClick != null });
        self.clipCheck = ui.Checkbox("裁剪", clipGeo != null, _G.handler(self, exports.onClipCheckChange), undefined, { shown: clipGeo != null });
        self.bigImageCheck = ui.Checkbox("大图预览", true, _G.handler(self, exports.onBigImageCheckChange));
        self.thumbnailLabel = ui.Label("(点击图片显示大图)", _G.styles.des);
        self.thumbnail = ui.Thumbnail({ params: thumbnailParams, onClick: _G.handler(self, exports.onThumbnailClick) });

        panel.add(_G.horizontals([ui.Label("合成方式"), self.modeSelect, self.chooseButton, self.downloadButton]));
        panel.add(_G.horizontals([self.clipCheck, self.bigImageCheck, self.thumbnailLabel]));
        panel.add(self.thumbnail);

        exports.setOnChooseClick(self, onChooseClick);
        exports.setOnDownloadClick(self, onDownloadClick);
        exports.onBigImageCheckChange(self, true);
        exports.onModeSelectChange(self, "mean");

        return self;
    };

    exports.getImage = function (self) {
        if (self.image == null) { return null; }
        return self.clipGeo && self.clipCheck.getValue() ? self.image.clip(self.clipGeo) : self.image;
    };

    exports.getImageName = function (self) {
        return (self.clipCheck.getValue() ? _G.clipImageHead : "") + self.collectionName + _G.compositeImageTail;
    };

    exports.setOnChooseClick = function (self, fn) {
        self.onChooseClick = fn;
        self.chooseButton.style().set("shown", fn != null);
    };

    exports.setOnDownloadClick = function (self, fn) {
        self.onDownloadClick = fn;
        self.downloadButton.style().set("shown", fn != null);
    };

    exports.onClipCheckChange = function (self) {
        var image = exports.getImage(self);
        if (image != null) {
            self.thumbnail.setImage(image);
        }
    };

    exports.onBigImageCheckChange = function (self, showBig) {
        self.thumbnailLabel.style().set("shown", !showBig);
        self.thumbnail.style().set("shown", !showBig);
    };

    exports.onModeSelectChange = function (self, mode) {
        self.image = self.collection[mode]();
        var image = exports.getImage(self);
        self.readyToChoose = image != null;
        if (image != null) {
            if (self.bigImageCheck.getValue()) {
                Map.centerObject(image);
                _G.rawAddLayerOrReplaceTop(image, self.visParams, "ImageViewing");
            } else {
                self.thumbnail.setImage(image);
            }
        } else {
            _G.hide(self.thumbnail);
            alert("合成图片失败");
        }
    }

    exports.onChooseButtonClick = function (self) {
        if (self.readyToChoose && self.onChooseClick) {
            self.onChooseClick(exports.getImage(self), exports.getImageName(self), self);
        } else {
            print("[Waring]: image is not ready to choose");
        }
    };

    exports.onDownloadButtonClick = function (self) {
        if (self.readyToChoose && self.onDownloadClick) {
            self.onDownloadClick(exports.getImage(self), exports.getImageName(self), self);
        } else {
            print("[Waring]: image is not ready to download");
        }
    };

    exports.onThumbnailClick = function (self) {
        var image = exports.getImage(self);
        if (image == null) { return; }
        Map.centerObject(image);
        _G.rawAddLayerOrReplaceTop(image, self.visParams, "ImageViewing");
    };

} else {
    exports = _G.loadedFiles[filePath];
}