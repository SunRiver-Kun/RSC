var _G = Number.prototype._G;
var filePath = "screens/imageBrowerScreen";
if (_G.loadedFiles[filePath] == null) {
    _G.loadedFiles[filePath] = exports;
    print("Load " + filePath);

    var MapDrawer = require("users/sunriverkun/gee_test:widgets/mapDrawer.js");
    var SubMenu = require("users/sunriverkun/gee_test:widgets/subMenu.js");
    var ImageCollectionViewr = require("users/sunriverkun/gee_test:widgets/imageCollectionViewr.js");

    var provinceNames = null;
    var provincesData = ee.FeatureCollection("projects/ee-sunriverkun/assets/china_province"); //省区
    provincesData.aggregate_array("省区").evaluate(function (list) { provinceNames = list; });

    var cityNames = null;
    var citysData = ee.FeatureCollection("projects/ee-sunriverkun/assets/china_city");  //地市
    citysData.aggregate_array("地市").evaluate(function (list) { cityNames = list; });

    var divCh = "；";

    var defaultCollectionTypes = {
        "Landsat-8-T1_SR": { c: "LANDSAT/LC08/C01/T1_SR", des: "Landsat 8, Collection 1, Tier 1 + Real Time", visParams: _G.imageParams.LANDSAT },
        "Landsat-8-T1": { c: "LANDSAT/LC08/C01/T1", des: "Landsat 8, Collection 1, Tier 1", visParams: _G.imageParams.LANDSAT }
    };
    var defaultCollectionType = "Landsat-8-T1_SR";

    exports.new = function (onChooseClick, collectionTypes, defaultType) {
        var panel = ui.Panel(null, ui.Panel.Layout.flow("vertical"), {
            height: "80%"
        });
        var self = {
            c: exports,
            widget: panel,
            onChooseClick : onChooseClick
        };
        //参数预处理
        collectionTypes = collectionTypes ? collectionTypes : defaultCollectionTypes;
        defaultType = defaultType ? defaultType : defaultCollectionType;

        var menu = null;
        var titleStyle = _G.styles.title;

        panel.add(ui.Label("图像选择界面", _G.styles.totalTitle));
        //类型
        self.cltTypes = collectionTypes;
        self.cltTypeDesLabel = ui.Label(collectionTypes[defaultType].des != null ? collectionTypes[defaultType].des : "", _G.styles.des);
        self.cltTypeSelect = ui.Select(Object.keys(self.cltTypes), "图像来源", defaultType, _G.handler(self, exports.onImageCollectionChange));

        menu = SubMenu.new("🧾图像来源", titleStyle);
        panel.add(menu.widget);
        SubMenu.add(menu, self.cltTypeDesLabel);
        SubMenu.add(menu, self.cltTypeSelect);
        //地区
        self.customArea = null;
        self.customAreaButotn = ui.Button("绘制区域", _G.handler(self, exports.onCustomAreaButotnClick));
        self.areaPreviewButton = ui.Button("总体预览🔍", _G.handler(self, exports.onAreaPreviewButtonClick));
        self.provinceTex = ui.Textbox("以；分割不同省", "");
        self.provinceButton = ui.Button("补全", _G.handler(self, exports.onProvinceButtonClick));
        self.cityTex = ui.Textbox("以；分割不同市", "");
        self.cityButton = ui.Button("补全", _G.handler(self, exports.onCityButtonClick));

        menu = SubMenu.new("🎨研究区域", titleStyle);
        panel.add(menu.widget);
        SubMenu.add(menu, ui.Label("选择自定义/省/市一种或多种做为遥感图像覆盖的区域", _G.styles.des));
        SubMenu.add(menu, _G.horizontals([ui.Label("自定义"), self.customAreaButotn, self.areaPreviewButton], true));
        SubMenu.add(menu, _G.horizontals([ui.Label("+ 省"), self.provinceTex, self.provinceButton], true));
        SubMenu.add(menu, _G.horizontals([ui.Label("+ 市"), self.cityTex, self.cityButton], true));
        //时间
        self.startTimeTex = ui.Textbox("YYYY-MM-DD", "2015-01-01");
        self.endTimeTex = ui.Textbox("YYYY-MM-DD", "2022-12-31")

        menu = SubMenu.new("📅起止时间", titleStyle);
        panel.add(menu.widget);
        SubMenu.add(menu, ui.Label("输入格式为YYYY-MM-DD, 例如：2015-01-01", _G.styles.des));
        SubMenu.add(menu, _G.horizontals([ui.Label("开始时间"), self.startTimeTex], true));
        SubMenu.add(menu, _G.horizontals([ui.Label("结束时间"), self.endTimeTex], true));
        //云量
        self.cloudTex = ui.Textbox("0~100", "5", null, false, { width: "40px" });

        menu = SubMenu.new("⛅云量占比", titleStyle);
        panel.add(menu.widget);
        SubMenu.add(menu, ui.Label("云量占比越大云越多, 0~100的整数", _G.styles.des));
        SubMenu.add(menu, _G.horizontals([ui.Label("云量占比小于等于"), self.cloudTex], true));

        //图像选择
        self.searchButton = ui.Button("搜索", _G.handler(self, exports.onSearchButtonClick), false, { stretch: "horizontal" });
        self.resultLabel = ui.Label("");
        self.resultPanel = ui.Panel(null, ui.Panel.Layout.flow("vertical"));

        menu = SubMenu.new("💾图像选择", titleStyle);
        panel.add(menu.widget);
        SubMenu.add(menu, ui.Label("点击搜索开始搜索图像", _G.styles.des));
        SubMenu.add(menu, _G.horizontals([self.searchButton, self.resultLabel]));
        SubMenu.add(menu, self.resultPanel);
        //default


        return self;
    };

    //类型
    exports.onImageCollectionChange = function (self, type) {
        self.cltTypeDesLabel.setValue(self.cltTypes[type].des != null ? self.cltTypes[type].des : "");
    };

    //地区
    exports.onCustomAreaButotnClick = function (self) {
        var mapDrawScreen = MapDrawer.new("请绘制自定义区域（点/线/多边形/矩形）", function (geoLayers) {
            var length = geoLayers.length();
            self.customArea = length > 0 ? geoLayers.get(length - 1).toGeometry() : null;
        });
    };


    function _getGeometry(collection, property, str) {
        if (str == "") { return null; }

        var arr = str.split(divCh);
        var filter = null;
        for (var i = 0; i < arr.length; ++i) {
            if (arr[i] != "") {
                if (filter == null) {
                    filter = ee.Filter.eq(property, arr[i]);
                } else {
                    filter = ee.Filter.or(filter, ee.Filter.eq(property, arr[i]));
                }
            }
        }
        return filter == null ? null : collection.filter(filter).geometry();
    }
    function union(a, b) {
        if (a == null) { return b; }
        if (b == null) { return a; }
        return a.union(b, 100);
    }

    exports.getGeometry = function (self) {
        var geometry = null;
        var provinceStr = self.provinceTex.getValue();
        var cityStr = self.cityTex.getValue();

        geometry = union(geometry, _getGeometry(provincesData, "省区", provinceStr));
        geometry = union(geometry, _getGeometry(citysData, "地市", cityStr));

        var layers = Map.drawingTools().layers();
        for (var i = 0; i < layers.length(); ++i) {
            geometry = union(geometry, layers.get(i).toGeometry());
        }
        return geometry;
    }

    exports.onAreaPreviewButtonClick = function (self) {
        var geometry = exports.getGeometry(self);
        if (geometry != null) {
            Map.centerObject(geometry);
            _G.rawAddLayerOrReplaceTop(geometry, undefined, "geometry");
        }
        else {
            alert("预览失败!");
        }
    };

    function getPreviewString(list, oldStr) {
        if (list == null || oldStr == null || oldStr == "") { return oldStr; }

        var preStr = null;
        var lastStr = null;
        var index = oldStr.lastIndexOf(divCh);
        if (index + 1 == oldStr.length) { return oldStr; }

        if (index == -1) {
            preStr = "";
            lastStr = oldStr;
        } else {
            preStr = oldStr.substring(0, index + 1);
            lastStr = oldStr.substring(index + 1);
        }

        if (lastStr == "") { return oldStr; }

        var result = null;
        for (var i = 0; i < list.length; ++i) {
            if (list[i].startsWith(lastStr)) {
                result = list[i];
                break;
            }
        }

        if (result == undefined) {
            alert("补全失败, 未找到字符串: " + lastStr);
            return oldStr;
        } else {
            return preStr + result + divCh;
        }
    }
    exports.onProvinceButtonClick = function (self) {
        self.provinceTex.setValue(getPreviewString(provinceNames, self.provinceTex.getValue()));
    };

    exports.onCityButtonClick = function (self) {
        self.cityTex.setValue(getPreviewString(cityNames, self.cityTex.getValue()));
    };


    //图像选择
    exports.onSearchButtonClick = function (self) {
        var geometry = exports.getGeometry(self);
        var typeData = self.cltTypes[self.cltTypeSelect.getValue()];
        var cloudValue = parseInt(self.cloudTex.getValue());
        var collection = ee.ImageCollection(typeData.c)
            .filterDate(self.startTimeTex.getValue(), self.endTimeTex.getValue())
            .filter(ee.Filter.lte('CLOUD_COVER', cloudValue));
        if (geometry != null) { collection = collection.filterBounds(geometry); }

        var viewr = ImageCollectionViewr.new(collection, typeData.visParams, typeData.visParams, geometry, self.onChooseClick);
        self.resultPanel.clear();
        self.resultPanel.add(viewr.widget);
    };

} else {
    exports = _G.loadedFiles[filePath];
}