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
    _G.show = function (widget) {
        if (widget.widget != null) { widget = widget.widget; }
        widget.style().set("shown", true);
    };

    _G.hide = function (widget) {
        if (widget.widget != null) { widget = widget.widget; }
        widget.style().set("shown", false);
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

    //地图
    _G.isClipImageName = function (imageName) {
        return imageName.startsWith(_G.clipImageHead);
    };

    _G.getImageParams = function (imageName, isRaw) {
        var type = null;
        if (isRaw) {
            type = imageName;
        } else {
            var start = imageName.indexOf("+") + 1;
            var end = imageName.lastIndexOf("/");
            if (end == -1) { end = undefined; }
            type = imageName.substring(start, end);
        }
        var params = _G.imageParams[type];
        if (!params) {
            print("[Waring]:_G.getImageParams can't find imageParams for", imageName, type);
            return {};
        }
        return params;
    };

    _G.getImageVisualParams = function (imageName, isRaw) {
        var visParams = _G.getImageParams(imageName, isRaw).visParams;
        if (!visParams) {
            print("[Waring]:_G.getImageVisualParams can't find visParams for", imageName, type);
            return {};
        }
        return visParams;
    };

    _G.getImageBands = function (imageName, isRaw) {
        var bands = _G.getImageParams(imageName, isRaw).bands;
        if (!bands) {
            print("[Waring]:_G.getImageBands can't find bands for", imageName, type);
            return {};
        }
        return bands;
    };

    _G.addLayer = function (imageName, focus) {
        if (imageName == null || imageName == "" || _G.isClipImageName(imageName)) { print("[ERROR]: _G.addLayer imageName of ", imageName); return null; }
        for (var type in _G.imageParams) {
            if (imageName.indexOf(type) != -1) {
                var image = ee.Image(imageName);
                var layer = Map.addLayer(image, _G.getImageVisualParams(imageName), imageName);
                if (focus) { Map.centerObject(image); }
                return layer;
            }
        }
        print("[ERROR]: _G.addLayer unknow type of " + imageName);
        return null;
    };

    _G.addLayerOrHideBefore = function (imageName, focus) {
        if (imageName == null || imageName == "" || _G.isClipImageName(imageName)) { print("[ERROR]: _G.addLayerOrHideBefore imageName of ", imageName); return null; }

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
            if (focus) { Map.centerObject(layers.get(index).getEeObject()); }
            return layers.get(index);
        } else {
            return _G.addLayer(imageName, focus);
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

    //颜色
    var palette = [];
    _G.getPalette = function (count) {
        var arr = [];
        var length = palette.length;
        for (var i = 0; i < count; ++i) {
            arr.push(i < length ? palette[i] : _G.getRandomColor());
        }
        return arr;
    };

    _G.getRandomColor = function () {
        var color = "#";
        var length = 6;
        for (var i = 0; i < length; ++i) {
            color += Math.floor(Math.random() * 16).toString(16).toUpperCase();
        }
        return color;
    };
}
else {

}

