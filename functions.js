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
        return function (params) { fn(self, params); };
    };

    _G.horizontals = function (widgets, NoHstretch) {
        var panel = ui.Panel();
        panel.setLayout(ui.Panel.Layout.flow("horizontal"));
        if (widgets === undefined) { return panel; }
        if (widgets.length === undefined) { print("[ERROR]: _G.horizontals的widgets不是数组", widgets); }
        for (var i = 0; i < widgets.length; ++i) {
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

    //地图
    var imageParams = {
        LANDSAT: { bands: ["B4", "B3", "B2"], min: 0, max: 3000 }
    };
    _G.addLayer = function (imageName, focus) {
        if (imageName == null || imageName == "") { print("[ERROR]: _G.addLayer null imageName"); return null; }
        for (var type in imageParams) {
            if (imageName.indexOf(type) != -1) {
                var image = ee.Image(imageName);
                var layer = Map.addLayer(image, imageParams[type], imageName);
                if (focus) { Map.centerObject(image); }
                return layer;
            }
        }
        print("[ERROR]: _G.addLayer unknow type of " + imageName);
        return null;
    };

    _G.addLayerOrHideBefore = function (imageName, focus) {
        if (imageName == null || imageName == "") { print("[ERROR]: _G.addLayerOrHideBefore null imageName"); return null; }

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

