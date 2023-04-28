var _G = Number.prototype._G;
var filePath = "screens/classifyBaseScreen";
if (_G.loadedFiles[filePath] == null) {
    _G.loadedFiles[filePath] = exports;
    print("Load " + filePath);

    var MapDrawer = require("users/sunriverkun/gee_test:widgets/mapDrawer.js");
    var ImageBrowerScreen = require("users/sunriverkun/gee_test:screens/imageBrowerScreen.js");

    var divCh = ";";
    var classProperty = "landcover";
    exports.getClassProperty = function () { return classProperty; };

    exports.new = function (title, titleDes) {
        var panel = ui.Panel();
        panel.setLayout(ui.Panel.Layout.flow("vertical"));
        var self = {
            c: exports,
            widget: panel,
            title: title ? title : "Title",
            titleDes: titleDes ? titleDes : "",
            imageName: "",
            image: null,
            classifyVisParams: { min: 0, max: 1, palette: null }
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
        self.imageLabel = ui.Label("遥感图像名");
        self.imageNameTex = ui.Textbox("", "");
        self.chooseButton = ui.Button("选择", _G.handler(self, exports.onChooseButtonClick));
        panel.add(_G.horizontals([self.imageLabel, self.imageNameTex, self.chooseButton], true));

        self.bandsLabel = ui.Label("分类波段名");
        self.bandsTex = ui.Textbox("以;分割每个波段名", "");
        panel.add(_G.horizontals([self.bandsLabel, self.bandsTex]));
        exports.setImageName(self, "LANDSAT/LC08/C01/T1_SR/LC08_192024_20160624");
        //算法参数
        self.argsPanel = ui.Panel();
        if (self.argsWidget) { self.argsPanel.add(self.argsWidget); }
        panel.add(self.argsPanel);

        //选择样本点
        self.points = null;
        self.pointsLabel = ui.Label("样板点");
        //self.pointsSelect = ui.Select(, "选择预设样板点", undefined);
        self.pointsButton = ui.Button("绘制", _G.handler(self, exports.openMapDrawScreen));
        self.pointsOkLabel = ui.Label("");
        panel.add(_G.horizontals([self.pointsLabel, self.pointsButton, self.pointsOkLabel]));

        exports.setPoints(self, null);
        //分类，取消
        self.classButton = ui.Button("分类", _G.handler(self, exports.onClass));
        self.cancelButton = ui.Button("取消", function () { _G.popScreen(); });
        panel.add(_G.horizontals([self.classButton, self.cancelButton]));

        return self;
    };

    exports.setImageName = function (self, name) {
        self.imageName = name;
        self.imageNameTex.setValue(name);
        self.bandsTex.setValue(_G.getImageBands(name).join(divCh));
    }

    exports.getBands = function (self) {
        var str = self.bandsTex.getValue();
        var bands = str.split(divCh);
        for (var i = bands.length - 1; i >= 0; --i) {
            if (bands[i] == "") {
                bands.splice(i, 1);
            }
        }

        return bands;
    }

    exports.setPoints = function (self, points) {   //FeatureCollection  
        self.points = points;
        self.pointsOkLabel.setValue(points != null ? "√" : "╳");
    };

    exports.getPoints = function (self) {
        return self.points;
    };

    exports.getClassifyVisParams = function (self) {
        return self.classifyVisParams;
    }

    exports.getShowImage = function (self) {
        var name = self.imageNameTex.getValue();
        if (name == "") { return null; }

        var zoom = 10;
        if (_G.isClipImageName(name)) {
            if (self.imageName == name && self.image != null) {
                Map.centerObject(self.image, zoom);
                _G.rawAddLayerOrHideBefore(self.image, _G.getImageVisualParams(name), name);
                return self.image
            } else {
                alert("遥感图像名错误，裁剪后图像名被修改，或是直接使用了裁剪后图像名");
                return null;
            }
        } else {
            _G.addLayerOrHideBefore(name, true, zoom);
            return ee.Image(name);
        }
    }

    exports.openMapDrawScreen = function (self) {
        if (exports.getShowImage(self) == null) { return; }
        var mapDrawScreen = MapDrawer.new({ title: "请绘制样板点", des: "(每个图层一个样板类型)" }, function (geoLayers) {
            var length = geoLayers.length();
            var palette = [];
            for (var i = 0; i < length; ++i) {
                palette.push(geoLayers.get(i).getColor());
            }
            self.classifyVisParams.max = length > 0 ? length - 1 : 0;
            self.classifyVisParams.palette = palette;

            exports.setPoints(self, length > 0 ? Map.drawingTools().toFeatureCollection(classProperty) : null);
        }, null, true);
    };

    exports.onChooseButtonClick = function (self) {
        var screen = ImageBrowerScreen.new(function (image, imageName) {
            self.image = image;
            exports.setImageName(self, imageName);
            _G.popScreen();
        });
        _G.pushScreen(screen);
    }

    //abstract
    exports.getClassifier = function (self) {
        return null;
    }

    exports.onClass = function (self) {
        var image = exports.getShowImage(self);
        if (image == null) { return; }

        var imageName = self.imageNameTex.getValue();
        if (imageName == "") { alert("遥感图像名不应为空"); return; }
        var points = exports.getPoints(self);  //FeatureCollection
        if (points == null) { alert("未绘制样板点"); return; }

        var classifier = self.c.getClassifier(self);
        if(classifier == null) { return; }

        var classProperty = exports.getClassProperty();
        var bands = exports.getBands(self);
        var training = image.select(bands).sampleRegions({
            collection: points,
            properties: [classProperty],
            scale: 30
        });
        print("training", training);
        var classifier = classifier.train({
            features: training,
            classProperty: classProperty,
            inputProperties: bands
        });
        var classified = image.select(bands).classify(classifier);
        print("classified", classified);
        Map.centerObject(classified);
        Map.addLayer(classified, exports.getClassifyVisParams(self), self.title);
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