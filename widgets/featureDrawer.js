var _G = Number.prototype._G;
var filePath = "widgets/featureDrawer";
if (_G.loadedFiles[filePath] == null) {
    _G.loadedFiles[filePath] = exports;
    print("Load " + filePath);

    var provinceNames = null;
    var provincesData = ee.FeatureCollection("projects/ee-sunriverkun/assets/china_province"); //省区
    provincesData.aggregate_array("省区").evaluate(function (list) { provinceNames = list; });

    var cityNames = null;
    var citysData = ee.FeatureCollection("projects/ee-sunriverkun/assets/china_city");  //地市
    citysData.aggregate_array("地市").evaluate(function (list) { cityNames = list; });

    var divCh = "；";

    var MapDrawer = require("users/sunriverkun/gee_test:widgets/mapDrawer.js");

    exports.new = function () {
        var panel = ui.Panel(null, ui.Panel.Layout.flow("vertical"));
        var self = {
            c: exports,
            widget: panel
        };

        //地区
        self.customArea = null;
        self.customAreaButotn = ui.Button("绘制", _G.handler(self, exports.onCustomAreaButotnClick));
        self.customAreaClearButton = ui.Button("清除", function () { exports.setCustomArea(self, null); });
        self.areaPreviewButton = ui.Button("总体预览🔍", _G.handler(self, exports.onAreaPreviewButtonClick));
        self.provinceTex = ui.Textbox("以；分割不同省", "");
        self.provinceButton = ui.Button("补全", _G.handler(self, exports.onProvinceButtonClick));
        self.cityTex = ui.Textbox("以；分割不同市", "");
        self.cityButton = ui.Button("补全", _G.handler(self, exports.onCityButtonClick));

        panel.add(ui.Label("选择自定义/省/市一种或多种做为导出区域", _G.styles.des));
        panel.add(_G.horizontals([ui.Label("自定义"), self.customAreaButotn, self.customAreaClearButton, self.areaPreviewButton], true));
        panel.add(_G.horizontals([ui.Label("+ 省"), self.provinceTex, self.provinceButton], true));
        panel.add(_G.horizontals([ui.Label("+ 市"), self.cityTex, self.cityButton], true));

        exports.setCustomArea(self, null);

        return self;
    };

    //地区
    function _getFeatureCollection(collection, property, str) {
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
        return filter == null ? null : collection.filter(filter);
    }

    function _getGeometry(collection, property, str) {
        var result = _getFeatureCollection(collection, property, str);
        return result != null ? result.geometry() : null;
    }
    function union(a, b) {
        if (a == null) { return b; }
        if (b == null) { return a; }
        return a.union(b, 100);
    }

    exports.getFeatureCollection = function (self) {
        var geometry = self.customArea;
        var provinceStr = self.provinceTex.getValue();
        var cityStr = self.cityTex.getValue();
        if (geometry != null && provinceStr == "" && cityStr == "") {
            return ee.FeatureCollection(geometry);
        }
        if (geometry == null && provinceStr != "" && cityStr == "") {
            return _getFeatureCollection(provincesData, "省区", provinceStr)
        }
        if (geometry == null && provinceStr == "" && cityStr != "") {
            return _getFeatureCollection(citysData, "地市", cityStr)
        }

        var totalGeo = exports.getGeometry(self);
        return totalGeo != null ? ee.FeatureCollection(totalGeo) : null;
    };

    exports.getGeometry = function (self) {
        var geometry = null;
        var provinceStr = self.provinceTex.getValue();
        var cityStr = self.cityTex.getValue();

        geometry = union(geometry, _getGeometry(provincesData, "省区", provinceStr));
        geometry = union(geometry, _getGeometry(citysData, "地市", cityStr));
        geometry = union(geometry, self.customArea);

        return geometry;
    }

    exports.setCustomArea = function (self, area) {
        self.customArea = area;
        self.customAreaClearButton.style().set("shown", area != null);
    }

    exports.onCustomAreaButotnClick = function (self) {
        var mapDrawScreen = MapDrawer.new("请绘制自定义区域", function (geoLayers) {
            var length = geoLayers.length();
            var area = null;
            for (var i = 0; i < length; ++i) {
                area = union(area, geoLayers.get(length - 1).toGeometry());
            }
            exports.setCustomArea(self, area);
        }, null, true);
    };

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

} else {
    exports = _G.loadedFiles[filePath];
}