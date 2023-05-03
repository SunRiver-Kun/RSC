var _G = Number.prototype._G;
var filePath = "screens/classifyBaseScreen";
if (_G.loadedFiles[filePath] == null) {
    _G.loadedFiles[filePath] = exports;
    print("Load " + filePath);

    var ImageChooser = require("users/sunriverkun/gee_test:widgets/imageChooser.js");
    var MapDrawer = require("users/sunriverkun/gee_test:widgets/mapDrawer.js");
    var ColorNameSettingScreen = require("users/sunriverkun/gee_test:screens/colorNameSettingScreen.js");

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
        self.imageChooser = ImageChooser.new(false, _G.handler(self, exports.onSetNameCb));
        self.bandsLabel = ui.Label("分类波段名");
        self.bandsTex = ui.Textbox("以" + divCh + "分割每个波段名", "");
        panel.add(self.imageChooser.widget);
        panel.add(_G.horizontals([self.bandsLabel, self.bandsTex]));
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

        //图例
        self.legendNames = null;  //self.classifyVisParams.palette
        self.legendCheck = ui.Checkbox("生成图例", true);
        self.legendButton = ui.Button("图例设置", _G.handler(self, exports.onLegendButtonClick));
        panel.add(_G.horizontals([self.legendCheck, self.legendButton]));

        //分类，取消
        self.classButton = ui.Button("分类", _G.handler(self, exports.onClass));
        self.cancelButton = ui.Button("取消", function () { _G.popScreen(); });
        panel.add(_G.horizontals([self.classButton, self.cancelButton]));


        exports.setPoints(self, null);
        ImageChooser.setImageName(self.imageChooser, "LANDSAT/LC08/C01/T1_SR/LC08_192024_20160624");

        return self;
    };

    exports.onSetNameCb = function (self, name) {
        self.bandsTex.setValue(_G.getImageBands(name).join(divCh));
        exports.setPoints(self, null);
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
    };

    exports.getShowImage = function (self, zoom) {
        return ImageChooser.getShowImage(self.imageChooser, zoom);
    };

    exports.generateLegend = function (self) {
        var colors = self.classifyVisParams.palette;
        var names = self.legendNames;
        _G.generateLegend(colors, names);
    };

    exports.openMapDrawScreen = function (self) {
        if (exports.getShowImage(self, 10) == null) { return; }
        var mapDrawScreen = MapDrawer.new({ title: "请绘制样板点", des: "(每个图层一个样板类型)" }, function (geoLayers) {
            var length = geoLayers.length();
            var palette = [];
            var names = [];
            for (var i = 0; i < length; ++i) {
                var layer = geoLayers.get(i)
                palette.push(layer.getColor());
                names.push(layer.getName());
            }
            self.classifyVisParams.max = length > 0 ? length - 1 : 0;
            self.classifyVisParams.palette = palette;
            self.legendNames = names;

            exports.setPoints(self, length > 0 ? Map.drawingTools().toFeatureCollection(classProperty) : null);
        }, null, true, "point");
    };

    exports.onLegendButtonClick = function (self) {
        var colors = self.classifyVisParams.palette;
        var names = self.legendNames;
        if (exports.getPoints(self) == null || colors == null || names == null) { alert("需要先设置样板点，才能设置图例"); return; }
        var screen = ColorNameSettingScreen.new(colors, names, "图例设置");
        _G.pushScreen(screen);
    };

    //abstract
    exports.getClassifier = function (self) {
        return null;
    }

    exports.onClass = function (self) {
        var points = exports.getPoints(self);  //FeatureCollection
        if (points == null) { alert("未绘制样板点"); return; }

        var bands = exports.getBands(self);
        if (bands == null || bands.length == 0) { alert("未填写分类波段名称"); return; }

        var classifier = self.c.getClassifier(self);
        if (classifier == null) { return; }

        var image = exports.getShowImage(self);
        if (image == null) { return; }

        if (self.legendCheck.getValue()) { exports.generateLegend(self); }

        var classProperty = exports.getClassProperty();

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