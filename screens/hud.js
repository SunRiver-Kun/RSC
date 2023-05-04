var _G = Number.prototype._G;
var filePath = "screens/hud";
if (_G.loadedFiles[filePath] == null) {
    _G.loadedFiles[filePath] = exports;
    print("Load " + filePath);


    var GeometrySettingScreen = require("users/sunriverkun/gee_test:screens/geometrySettingScreen.js");
    var ToolBox = require("users/sunriverkun/gee_test:widgets/toolBox.js");
    var leftTopMapStyle = {
        position: "top-left",
        padding: "0px"
    };
    var rightTopMapStyle = {
        position: "top-right",
        padding: "0px"
    }

    exports.new = function () {
        var panel = ui.root;
        ui.root.setLayout(ui.Panel.Layout.flow("horizontal"));

        var self = {
            c: exports,
            widget: panel
        };

        self.leftStack = [];
        self.leftTotalPanel = ui.Panel(null, ui.Panel.Layout.flow("vertical"), { shown: false });
        self.leftEscButton = ui.Button("╳", _G.handler(self, exports.clearLeftScreen), false, { margin: "auto auto auto 0px", padding: "0px" });
        self.leftBackButton = ui.Button("←", function () { exports.popLeftScreen(self); }, false, { margin: "auto 0px auto auto", padding: "0px" });
        self.leftPanel = ui.Panel(null, ui.Panel.Layout.flow("horizontal"));

        self.leftTotalPanel.add(_G.horizontals([self.leftEscButton, self.leftBackButton], true));
        self.leftTotalPanel.add(self.leftPanel);

        self.map = Map;
        self.map.setControlVisibility({ zoomControl: false });

        self.setMapGeoLayerButton = ui.Button("几何层设置", function () { _G.pushScreen(GeometrySettingScreen.new()); }, undefined, leftTopMapStyle, "https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/settings/default/24px.svg");
        self.newDrawMapGeoLayerButton = ui.Button("新建几何层", _G.newDrawMapGeoLayer, undefined, leftTopMapStyle, "https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/new_window/default/24px.svg");
        self.reDrawCurrentMapGeoLayerButton = ui.Button("重绘当前几何层", _G.reDrawCurrentMapGeoLayer, undefined, leftTopMapStyle, "https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/cleaning_services/default/24px.svg");
        self.removeCurrentMapGeoLayerButton = ui.Button("删除当前几何层", function () { _G.removeCurrentMapGeoLayer(); _G.selectCurrentMapGeoLayer(); }, undefined, leftTopMapStyle, "https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/restore_from_trash/default/24px.svg");
        self.map.add(self.setMapGeoLayerButton);
        self.map.add(self.newDrawMapGeoLayerButton);
        self.map.add(self.reDrawCurrentMapGeoLayerButton);
        self.map.add(self.removeCurrentMapGeoLayerButton);

        self.showTopMapLayerButton = ui.Button("显示顶部图层", _G.showTopMapLayer, undefined, rightTopMapStyle, "https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/visibility/default/24px.svg");
        self.hideAllMapLayerButton = ui.Button("隐藏全部图层", _G.hideAllMapLayer, undefined, rightTopMapStyle, "https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/visibility_off/default/24px.svg");
        self.clearMapLayerButton = ui.Button("删除全部图层和图例", function () { _G.clearMapLayer(); exports.removeLegend(self); }, undefined, rightTopMapStyle, "https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/delete/default/24px.svg");
        self.map.add(self.showTopMapLayerButton);
        self.map.add(self.hideAllMapLayerButton);
        self.map.add(self.clearMapLayerButton);

        self.rightStack = {};  //name : {button  screen}
        self.rightTotalPanel = ui.Panel(null, ui.Panel.Layout.flow("horizontal"));

        panel.insert(0, self.leftTotalPanel);
        panel.add(self.rightTotalPanel);

        exports.addRightWidget(self, "💼工具栏", ToolBox.new(), true);

        return self;
    };

    //left
    exports.pushLeftScreen = function (self, screen, keepBefore) {
        var widgetStack = self.leftStack;
        var panel = self.leftPanel;
        if (widgetStack.length > 0 && !keepBefore) {
            _G.hide(widgetStack[widgetStack.length - 1]);
        }
        _G.show(screen);
        widgetStack.push(screen);
        panel.add(screen.widget);

        self.leftTotalPanel.style().set("shown", widgetStack.length > 0);
    };

    exports.popLeftScreen = function (self, screen) {
        var widgetStack = self.leftStack;
        var panel = self.leftPanel;
        if (screen != undefined && screen != widgetStack[widgetStack.length - 1]) { return; }
        var screen = widgetStack.pop();
        panel.remove(screen.widget);
        if (widgetStack.length > 0) {
            _G.show(widgetStack[widgetStack.length - 1]);
        }

        self.leftTotalPanel.style().set("shown", widgetStack.length > 0);

        return screen;
    };

    exports.clearLeftScreen = function (self) {
        var widgetStack = self.leftStack;
        var panel = self.leftPanel;
        for (var i = widgetStack.length - 1; i >= 0; --i) {
            panel.remove(widgetStack[i].widget);
            widgetStack.pop();
        }
        self.leftTotalPanel.style().set("shown", widgetStack.length > 0);
    };

    //map
    exports.removeLegend = function (self) {
        if (self.mapLegend != null) {
            self.map.remove(self.mapLegend);
            self.mapLegend = null;
        }
    };

    exports.generateLegend = function (self, colors, names) {
        exports.removeLegend(self);
        if (colors == null || names == null || colors.length != names.length) { print("[ERROR]: Hud.generateLegend() colors和name不等长"); return; }
        var panel = ui.Panel(null, ui.Panel.Layout.flow("vertical"), { position: "bottom-left" });
        for (var i = 0; i < colors.length; ++i) {
            var colorLabel = ui.Label("", { padding: "12px", backgroundColor: colors[i] });
            var nameLabel = ui.Label(names[i]);
            panel.add(_G.horizontals([colorLabel, nameLabel], true));
        }
        self.mapLegend = panel;
        self.map.add(panel);
    };

    //right
    exports.addRightWidget = function (self, name, widget, shown) {
        if (self.rightStack[name]) { print("[ERROR]: " + name + " is in Hud.rightStack!"); return; }
        if (widget.widget) { widget = widget.widget; }

        var panel = ui.Panel(null, ui.Panel.Layout.flow("vertical"), { shown: shown, width: "150px" });
        var titlePanel = ui.Panel(null, ui.Panel.Layout.flow("horizontal"));
        titlePanel.add(ui.Label(name, { fontSize: "20px", backgroundColor: "FFFFFF00" }));
        var closePng = "https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/close/default/24px.svg";
        titlePanel.add(ui.Button("", function () { exports.hideRightWidget(self, name); }, false, {
            margin: "0px 0px auto auto", padding: "0px"
        }, closePng));

        panel.add(titlePanel);
        panel.add(widget);

        var tb = {};
        tb.screen = { name: name, widget: panel };
        tb.button = ui.Button(name, function () { exports.showRightWidget(self, name); }, false, {
            position: "top-right",
            padding: "0px",
            margin: "auto auto 4px auto",
            shown: !shown
        });

        self.rightTotalPanel.add(panel);
        self.map.add(tb.button);

        self.rightStack[name] = tb;
    };

    exports.showRightWidget = function (self, name) {
        var tb = self.rightStack[name];
        _G.hide(tb.button);
        _G.show(tb.screen);
    };

    exports.hideRightWidget = function (self, name) {
        var tb = self.rightStack[name];
        _G.show(tb.button);
        _G.hide(tb.screen);
    };

} else {
    exports = _G.loadedFiles[filePath];
}