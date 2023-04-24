var _G = Number.prototype._G;
var filePath = "screens/hud";
if (_G.loadedFiles[filePath] == null) {
    _G.loadedFiles[filePath] = exports;
    print("Load " + filePath);

    var ToolBox = require("users/sunriverkun/gee_test:widgets/toolBox.js");

    exports.new = function () {
        var panel = ui.Panel(null, ui.Panel.Layout.flow("horizontal"), {
            width: "100%",
            height: "100%"
        });
        var self = {
            c: exports,
            widget: panel
        };

        self.leftStack = [];
        self.leftTotalPanel = ui.Panel(null, ui.Panel.Layout.flow("vertical"), { shown: false });
        self.leftEscButton = ui.Button("╳", _G.handler(self, exports.clearLeftScreen), false, { margin: "auto auto auto 0px", padding:"0px" });
        self.leftBackButton = ui.Button("←", function () { exports.popLeftScreen(self); }, false, { margin: "auto 0px auto auto", padding:"0px"  });
        self.leftPanel = ui.Panel(null, ui.Panel.Layout.flow("horizontal"));

        self.leftTotalPanel.add(_G.horizontals([self.leftEscButton, self.leftBackButton], true));
        self.leftTotalPanel.add(self.leftPanel);

        self.map = ui.Map();

        self.rightStack = {};  //name : {button  screen}
        self.rightTotalPanel = ui.Panel(null, ui.Panel.Layout.flow("horizontal"));
        exports.addRightWidget(self, "💼工具栏", ToolBox.new(), true);

        panel.add(self.leftTotalPanel);
        panel.add(self.map);
        panel.add(self.rightTotalPanel);

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

    //right
    exports.addRightWidget = function (self, name, widget, shown) {
        if (self.rightStack[name]) { print("[ERROR]: " + name + " is in Hud.rightStack!"); return; }
        if (widget.widget) { widget = widget.widget; }

        var panel = ui.Panel(null, ui.Panel.Layout.flow("vertical"), { shown: shown });
        var titlePanel = ui.Panel(null, ui.Panel.Layout.flow("horizontal"));
        titlePanel.add(ui.Label(name, {fontSize : "20px", backgroundColor: "FFFFFF00"}));
        var closePng = "https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/close/default/24px.svg";
        titlePanel.add(ui.Button("", function () { exports.hideRightWidget(self, name); }, false, {
            margin:"0px 0px auto auto", padding:"0px", backgroundColor:"#FFFFFF00"
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