var _G = Number.prototype._G;
var filePath = "screens/colorNameSettingScreen";
if (_G.loadedFiles[filePath] == null) {
    _G.loadedFiles[filePath] = exports;
    print("Load " + filePath);

    var ColorNameItem = require("users/sunriverkun/gee_test:widgets/colorNameItem.js");

    exports.new = function (colors, names, title, onFinishCb, onCancelCb) {
        if (colors.length != names.length) { print("[ERROR]: ColorNameSettingScreen colors和names需要等长"); return; }
        var panel = ui.Panel();
        panel.setLayout(ui.Panel.Layout.flow("vertical"));
        var self = {
            c: exports,
            widget: panel,
            colors: colors,
            names: names,
            onFinishCb: onFinishCb,
            onCancelCb: onCancelCb
        };

        if (title != null) { panel.add(ui.Label(title, _G.styles.totalTitle)); }
        panel.add(ui.Label("Color格式是#RRGGBB，输入后回车", _G.styles.des));

        var items = [];
        for (var i = 0; i < colors.length; ++i) {
            var item = ColorNameItem.new(colors[i], names[i], false, "图例名");
            items.push(item);
            panel.add(item.widget);
        }
        self.items = items;

        self.finishButton = ui.Button("确认", _G.handler(self, exports.onFinish));
        self.cancelButton = ui.Button("取消", _G.handler(self, exports.onCancel));
        panel.add(_G.horizontals([self.finishButton, self.cancelButton]));

        return self;
    };

    exports.onFinish = function (self) {
        var items = self.items;
        for (var i = 0; i < items.length; ++i) {
            self.colors[i] = ColorNameItem.getColor(items[i]);
            self.names[i] = ColorNameItem.getName(items[i]);
        }
        if (self.onFinishCb) { self.onFinishCb(self); }
        _G.popScreen(self);
    };

    exports.onCancel = function (self) {
        if (self.onCancelCb) { self.onCancelCb(self); }
        _G.popScreen(self);
    };

} else {
    exports = _G.loadedFiles[filePath];
}