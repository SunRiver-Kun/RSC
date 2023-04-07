var _G = Number.prototype._G;
var filePath = "functions.js";
if (_G.loadedFiles[filePath] == null) {
    _G.loadedFiles[filePath] = _G;
    print("Load " + filePath);

    var widgetStack = [];

    _G.getWidgetStack = function (){
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

    _G.popScreen = function () {
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

    _G.horizontals = function (widgets) {
        var panel = ui.Panel();
        panel.setLayout(ui.Panel.Layout.flow("horizontal"));
        for (var i = 0; i < widgets.length; ++i) {
            panel.add(widgets[i]);
        }
        return panel;
    }

    _G.verticals = function (widgets) {
        var panel = ui.Panel();
        panel.setLayout(ui.Panel.Layout.flow("vertical"));
        for (var i = 0; i < widgets.length; ++i) {
            panel.add(widgets[i]);
        }
        return panel;
    }
}
else{
    
}

