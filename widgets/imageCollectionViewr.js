var _G = Number.prototype._G;
var filePath = "widgets/imageCollectionViewr";
if (_G.loadedFiles[filePath] == null) {
    _G.loadedFiles[filePath] = exports;
    print("Load " + filePath);

    exports.new = function (collection, visParams, thumbnailParams, clipGeo, onChooseClick, onDownloadClick) {
        var panel = ui.Panel();
        panel.setLayout(ui.Panel.Layout.flow("vertical"));
        var self = {
            c: exports,
            widget: panel,
            collection: collection,
            visParams: visParams,
            clipGeo: clipGeo,
            collectionLength: null,
            selectedIndex: null,
            image: null
        };
        self.prevButton = ui.Button("上一张", _G.handler(self, exports.onPrevButtonClick), true);
        self.nextButton = ui.Button("下一张", _G.handler(self, exports.onNextButtonClick), true);
        self.chooseButton = ui.Button("选择");
        self.downloadButton = ui.Button("下载");
        

        self.clipCheck = ui.Checkbox("裁剪", clipGeo != null, _G.handler(self, exports.onClipCheckChange), undefined, { shown: clipGeo != null });
        self.thumbnail = ui.Thumbnail({ params: thumbnailParams, onClick: _G.handler(self, exports.onThumbnailClick) });
        self.idLabel = ui.Label("ID: ", { margin: "2px 0" });
        self.dateLabel = ui.Label("Data: ", { margin: "2px 0" });
        self.orderLabel = ui.Label("Index: ", { margin: "2px 0" });

        panel.add(_G.horizontals([self.prevButton, self.nextButton, self.chooseButton, self.downloadButton]));
        panel.add(_G.horizontals([self.clipCheck, ui.Label("(点击图片显示大图)", _G.styles.des)]));
        panel.add(self.thumbnail);
        panel.add(self.idLabel);
        panel.add(_G.horizontals([self.dateLabel, self.orderLabel]));

        collection.size().evaluate(function (length) {
            self.collectionLength = length;
            exports.setImageByIndex(self, 0);
        });

        exports.setOnChooseClick(self, onChooseClick);
        exports.setOnDownloadClick(self, onDownloadClick);

        return self;
    };

    exports.getSelectedIndex = function (self) {
        return self.selectedIndex;
    };

    exports.getImage = function (self) {
        if(self.image == null) { return null; }
        return self.clipGeo && self.clipCheck.getValue() ? self.image.clip(self.clipGeo) : self.image;
    };

    exports.setImageByIndex = function (self, index) {
        if (self.collectionLength == null) { print("imageCollectionViewr: isLoading"); return; }
        if (self.collectionLength == 0) {
            _G.hide(self.thumbnail);
            self.idLabel.setValue("ID: ");
            self.dateLabel.setValue("Data: ");
            self.orderLabel.setValue("Index: 0/0");
            self.prevButton.setDisabled(true);
            self.nextButton.setDisabled(true);
            return;
        }
        index = _G.clamp(index, 0, self.collectionLength - 1);
        self.selectedIndex = index;
        self.prevButton.setDisabled(index == 0);
        self.nextButton.setDisabled(index == self.collectionLength - 1);

        var image = ee.Image(self.collection.toList(1, index).get(0));
        self.image = image;
        self.thumbnail.setImage(exports.getImage(self));
        _G.show(self.thumbnail);

        // Asynchronously update the image information.
        self.orderLabel.setValue("Index: " + (index + 1) + "/" + self.collectionLength);
        image.get("system:id").evaluate(function (id) {
            self.idLabel.setValue("ID: " + id);
        });
        image.date().format("YYYY-MM-dd").evaluate(function (date) {
            self.dateLabel.setValue("Date: " + date);
        });
    };

    exports.setOnChooseClick = function (self, fn) {
        self.onChooseClick = fn;
        self.chooseButton.style().set("shown", fn!=null);
    };

    exports.setOnDownloadClick = function (self, fn) {
        self.onDownloadClick = fn;
        self.downloadButton.style().set("shown", fn!=null);
    };

    exports.onClipCheckChange = function (self) {
        var image = exports.getImage(self);
        if (image != null) {
            self.thumbnail.setImage(image);
        }
    }

    exports.onPrevButtonClick = function (self) {
        exports.setImageByIndex(self, self.selectedIndex - 1);
    };

    exports.onNextButtonClick = function (self) {
        exports.setImageByIndex(self, self.selectedIndex + 1);
    };

    exports.onChooseButtonClick = function (self) {
        if(self.onChooseClick){
            self.onChooseClick(self);
        }
    };

    exports.onDownloadButtonClick = function (self) {
        if (self.onDownloadClick) {
            self.onDownloadClick(self);
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