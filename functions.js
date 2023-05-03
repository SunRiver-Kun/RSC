var _G = Number.prototype._G;
var filePath = "functions.js";
if (_G.loadedFiles[filePath] == null) {
    _G.loadedFiles[filePath] = _G;
    print("Load " + filePath);

    //TheFrontEnd
    _G.getWidgetStack = function () {
        return _G.hud.leftStack;
    };

    _G.pushScreen = function (screen) {
        print("_G.pushScreen: ", screen);
        _G.hud.c.pushLeftScreen(_G.hud, screen);
    };

    _G.popScreen = function (screen) {
        _G.hud.c.popLeftScreen(_G.hud, screen);
    };

    _G.clearScreen = function () {
        _G.hud.c.clearLeftScreen(_G.hud);
    };


    //UI
    _G.add = function (parent, child) {
        if (parent.widget != null) { parent = parent.widget; }
        if (child.widget != null) { child = child.widget; }
        parent.add(child);
        return parent;
    };

    _G.remove = function (parent, child) {
        if (parent.widget != null) { parent = parent.widget; }
        if (child.widget != null) { child = child.widget; }
        parent.remove(child);
        return parent;
    };

    _G.clear = function (widget) {
        if (widget.widget != null) { widget = widget.widget; }
        widget.clear();
        return widget;
    };

    _G.show = function (widget) {
        if (widget.widget != null) { widget = widget.widget; }
        widget.style().set("shown", true);
        return widget;
    };

    _G.hide = function (widget) {
        if (widget.widget != null) { widget = widget.widget; }
        widget.style().set("shown", false);
        return widget;
    };

    _G.handler = function (self, fn) {
        return function (arg1, arg2, arg3, arg4) { fn(self, arg1, arg2, arg3, arg4); };
    };

    _G.horizontals = function (widgets, NoHstretch) {
        var panel = ui.Panel();
        panel.setLayout(ui.Panel.Layout.flow("horizontal"));
        if (widgets === undefined) { return panel; }
        if (widgets.length === undefined) { print("[ERROR]: _G.horizontals的widgets不是数组", widgets); }
        for (var i = 0; i < widgets.length; ++i) {
            if (widgets[i] == null || widgets[i].style == null) {
                print("[ERROR]: _G.horizontals()", widgets);
                return panel;
            }

            if (!NoHstretch) {
                widgets[i].style().set("stretch", "horizontal");
            }
            panel.add(widgets[i]);
        }
        return panel;
    };

    _G.verticals = function (widgets, NoVstretch) {
        var panel = ui.Panel();
        panel.setLayout(ui.Panel.Layout.flow("vertical"));
        if (widgets === undefined) { return panel; }
        if (widgets.length === undefined) { print("[ERROR]: _G.horizontals的widgets不是数组", widgets); }
        for (var i = 0; i < widgets.length; ++i) {
            if (widgets[i] == null || widgets[i].style == null) {
                print("[ERROR]: _G.verticals()", widgets);
                return panel;
            }
            if (!NoVstretch) {
                widgets[i].style().set("stretch", "vertical");
            }
            panel.add(widgets[i]);
        }
        return panel;
    };

    //转换
    _G.Astr2Int = function (str, alertStr) {
        var number = parseInt(str);
        if (isNaN(number)) {
            alert(alertStr);
            return null;
        }
        return number;
    };

    _G.Astr2UInt = function (str, alertStr) {
        var number = parseInt(str);
        if (isNaN(number) || number < 0) {
            alert(alertStr);
            return null;
        }
        return number;
    };


    _G.Astr2PInt = function (str, alertStr) {
        var number = parseInt(str);
        if (isNaN(number) || number < 1) {
            alert(alertStr);
            return null;
        }
        return number;
    };

    _G.Astr2Float = function (str, alertStr) {
        var number = parseFloat(str);
        if (isNaN(number)) {
            alert(alertStr);
            return null;
        }
        return number;
    };

    _G.clamp = function (value, min, max) {
        if (value < min) { return min; }
        if (value > max) { return max; }
        return value;
    };

    //颜色
    _G.getRandomColor = function (hasAlpha) {
        var color = "#";
        var length = 6;
        for (var i = 0; i < length; ++i) {
            color += Math.floor(Math.random() * 16).toString(16).toUpperCase();
        }
        if (hasAlpha) { color += "FF"; }
        return color;
    };

    _G.isValidColor = function (color, hasAlpha) {
        if (color == null || color == "") { return false; }
        var startIndex = color[0] == '#' ? 1 : 0;
        var numLength = hasAlpha ? 8 : 6;
        if (color.length - startIndex != numLength) { return false; }

        for (var i = startIndex; i < color.length; ++i) {
            var ch = color[i];
            if (!(('0' <= ch && ch <= '9') || ('A' <= ch && ch <= 'F') || ('a' <= ch && ch <= 'f'))) { return false; }
        }
        return true;
    };

    //地图
    _G.isClipImageName = function (imageName) {
        return imageName.startsWith(_G.clipImageHead);
    };

    _G.isCompositeImageName = function (imageName) {
        return imageName.endsWith(_G.compositeImageTail);
    };

    _G.isNotVaildImageName = function (imageName) {
        if (imageName == null || imageName == "") { return true; }
        var notValidCh = ["-", "+"];
        for (var i = 0; i < notValidCh.length; ++i) {
            if (imageName.indexOf(notValidCh[i]) != -1) {
                return true;
            }
        }
        return false;
    }

    _G.getImageType = function (imageName) {
        //[clip-]from/id    [clip-]from+composite
        var start = imageName.indexOf("-") + 1;
        var end = imageName.lastIndexOf("+");
        if (end == -1) { end = imageName.lastIndexOf("/");; }
        return imageName.substring(start, end == -1 ? undefined : end);
    };

    _G.getImageParams = function (imageName) {
        var type = _G.getImageType(imageName);
        var params = _G.imageParams[type];
        if (!params) {
            print("[Waring]:_G.getImageParams can't find imageParams for", imageName, type);
            return {};
        }
        return params;
    };

    _G.getImageParamsValue = function (imageName, key, defautlValue, errorLevel) {
        if (errorLevel == undefined) { errorLevel = 1; }
        var params = _G.getImageParams(imageName);
        var value = params[key];
        if (value == null && errorLevel > 0) {
            print((errorLevel == 1 ? "[Waring]" : "[Error]") + ": _G.getImageParamsValue can't find " + key + " for ", imageName);
        }
        return value != null ? value : defautlValue;
    };

    _G.getImageVisualParams = function (imageName) {
        var params = _G.getImageParams(imageName);
        var visParams = params.visParams;
        if (visParams == null || (params.compositeParams != null && _G.isCompositeImageName(imageName))) { visParams = params.compositeParams; }
        if (visParams == null) {
            print("[Waring]:_G.getImageVisualParams can't find visParams or compositeParams for", imageName);
            return {};
        }
        return visParams;
    };

    _G.getImageDes = function (imageName) { return _G.getImageParamsValue(imageName, "des", ""); };
    _G.getImageBaseVisParams = function (imageName) { return _G.getImageParamsValue(imageName, "visParams", {}); };
    _G.getImageCopVisParams = function (imageName) { return _G.getImageParamsValue(imageName, "compositeParams", {}); };
    _G.getImageBands = function (imageName) { return _G.getImageParamsValue(imageName, "bands", []); };
    _G.getImageCloudBand = function (imageName) { return _G.getImageParamsValue(imageName, "cloudBand", null); };
    _G.getImageSortType = function (imageName) { return _G.getImageParamsValue(imageName, "sortType", {}); };

    _G.addLayer = function (imageName, focus, zoom) {
        if (_G.isNotVaildImageName(imageName)) { print("[ERROR]: _G.addLayer imageName of ", imageName); return null; }

        var image = ee.Image(imageName);
        var layer = Map.addLayer(image, _G.getImageVisualParams(imageName), imageName);
        if (focus) { Map.centerObject(image, zoom); }
        return layer;
    };

    _G.addLayerOrHideBefore = function (imageName, focus, zoom) {
        if (_G.isNotVaildImageName(imageName)) { print("[ERROR]: _G.addLayerOrHideBefore imageName of ", imageName); return null; }

        var layers = Map.layers();
        var index = null;
        for (var i = 0; i < layers.length(); ++i) {
            if (layers.get(i).getName() == imageName) {
                index = i;
                break;
            }
        }
        if (index != null) {
            for (var i = index + 1; i < layers.length(); ++i) { layers.get(i).setShown(false); }
            layers.get(index).setShown(true);
            if (focus) { Map.centerObject(layers.get(index).getEeObject(), zoom); }
            return layers.get(index);
        } else {
            return _G.addLayer(imageName, focus, zoom);
        }
    };

    _G.rawAddLayerOrHideBefore = function (eeObject, visParams, name, shown, opacity) {
        var layers = Map.layers();
        if (layers.length() > 0 && name != null && name != "") {
            var index = null;
            for (var i = 0; i < layers.length(); ++i) {
                if (layers.get(i).getName() == name) {
                    index = i;
                    break;
                }
            }
            if (index != null) {
                var layer = layers.get(index);
                if (layer.getEeObject() == eeObject) {
                    for (var i = index + 1; i < layers.length(); ++i) { layers.get(i).setShown(false); }
                    layer.setShown(true);
                    return layer;
                }
            }
        }
        return Map.addLayer(eeObject, visParams, name, shown, opacity);
    }

    _G.rawAddLayerOrReplaceTop = function (eeObject, visParams, name, shown, opacity) {
        var layers = Map.layers();
        if (layers.length() > 0 && name != null && name != "") {
            var elm = layers.get(layers.length() - 1);
            if (elm.getName() == name) { layers.remove(elm); }
        }
        return Map.addLayer(eeObject, visParams, name, shown, opacity);
    }

    //Layer
    _G.showTopMapLayer = function () {
        var layers = Map.layers();
        var length = layers.length();
        if (length > 0) { layers.get(length - 1).setShown(true); }
    };

    _G.hideAllMapLayer = function () {
        Map.layers().forEach(function (layer) {
            layer.setShown(false);
        });
    };

    _G.clearMapLayer = function () {
        Map.layers().reset();
    };

    //GeoLayer
    var defaultDrawType = "point";
    _G.clearMapGeoLayer = function () {
        Map.drawingTools().layers().reset();
    };

    _G.removeCurrentMapGeoLayer = function () {
        var layers = Map.drawingTools().layers();
        var length = layers.length();
        if (length > 0) { layers.remove(layers.get(length - 1)); }
    };

    _G.selectCurrentMapGeoLayer = function () {
        var tools = Map.drawingTools()
        var layers = tools.layers();
        var length = layers.length();
        if (length > 0) { tools.setSelected(layers.get(length - 1)); }
    }

    _G.reDrawCurrentMapGeoLayer = function () {
        var tools = Map.drawingTools()
        var layers = tools.layers();
        var length = layers.length();
        if (length == 0) { return; }
        var layer = layers.get(length - 1);
        var newLayer = ui.Map.GeometryLayer({
            name: layer.getName(),
            color: layer.getColor()
        });
        var shape = tools.getShape();
        if (shape == null || shape == "") { shape = defaultDrawType; }
        layers.remove(layer);
        layers.add(newLayer);
        tools.setSelected(newLayer);
        tools.setShape(shape);
    };

    _G.newDrawMapGeoLayer = function () {
        var tools = Map.drawingTools()
        var layers = tools.layers();
        var newLayer = ui.Map.GeometryLayer({ color: _G.getRandomColor() });
        var shape = tools.getShape();
        if (shape == null || shape == "") { shape = defaultDrawType; }
        layers.add(newLayer);
        tools.setSelected(newLayer);
        tools.setShape(shape);
    };
}
else {

}

