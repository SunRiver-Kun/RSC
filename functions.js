var _G = Number.prototype._G;
var filePath = "functions.js";
if (_G.loadedFiles[filePath] == null) {
    _G.loadedFiles[filePath] = _G;
    print("Load " + filePath);

    var widgetStack = [];

    _G.getWidgetStack = function () {
        return widgetStack;
    };

    _G.pushScreen = function (screen) {
        print("_G.pushScreen: ", screen);
        if (widgetStack.length > 0) {
            _G.hide(widgetStack[widgetStack.length - 1]);
        }
        _G.show(screen);
        widgetStack.push(screen);
        Map.add(screen.widget);
    };

    _G.popScreen = function (self) {
        if (self != undefined && self != widgetStack[widgetStack.length - 1]) { return; }
        var screen = widgetStack.pop();
        print("_G.popScreen: ", screen);
        _G.hide(screen);
        Map.remove(screen.widget);
        if (widgetStack.length > 0) {
            _G.show(widgetStack[widgetStack.length - 1]);
        }
        return screen;
    };

    _G.topScreen = function () {
        return widgetStack[widgetStack.length - 1];
    };

    _G.clearScreen = function () {
        print("_G.clearScreen: ", widgetStack.length);
        for (var i = widgetStack.length - 1; i >= 0; --i) {
            _G.hide(widgetStack[i]);
            Map.remove(widgetStack[i].widget);
            widgetStack.pop();
        }
    };

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
    }

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
    }

    _G.Astr2Int = function (str, alertStr) {
        var number = parseInt(str);
        if (isNaN(number)) {
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

    _G.addLayer = function (imageName, focus) {
        var image = null;
        if (imageName.indexOf("LANDSAT") != -1) {
            image = ee.Image(imageName);
            Map.addLayer(image, { bands: ["B4", "B3", "B2"], min: 0, max: 3000 }, imageName);
        } else {
            print("[ERROR]: 未知类型图像名 " + imageName);
            return null;
        }
        if (focus) { Map.centerObject(image); }
        return image;
    }
}
else {

}

