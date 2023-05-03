var _G = Number.prototype._G;
var filePath = "widgets/colorNameItem";
if (_G.loadedFiles[filePath] == null) {
    _G.loadedFiles[filePath] = exports;
    print("Load " + filePath);

    var ColorLinker = require("users/sunriverkun/gee_test:widgets/colorLinker.js");

    exports.new = function (color, name, hasAlpha, namePlaceHolder) {
        var panel = ui.Panel();
        panel.setLayout(ui.Panel.Layout.flow("horizontal"));
        var self = {
            c: exports,
            widget: panel
        };
        self.colorLinker = ColorLinker.new(hasAlpha);
        self.nameTex = ui.Textbox(namePlaceHolder ? namePlaceHolder : "Name", name ? name : "", undefined, undefined, { width: "128px", margin: "auto 0px" });
        self.randomButton = ui.Button("随机颜色", _G.handler(self, exports.randomColor), undefined, { padding: "0px" }, "https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/autorenew/default/24px.svg");

        panel.add(self.colorLinker.widget);
        panel.add(self.nameTex);
        panel.add(self.randomButton);

        if (color) { exports.setColor(self, color); }

        return self;
    };

    exports.getName = function (self) { return self.nameTex.getValue(); };
    exports.randomColor = function (self) { ColorLinker.randomColor(self.colorLinker); };
    exports.getColor = function (self) { return ColorLinker.getColor(self.colorLinker); };
    exports.setColor = function (self, color) { return ColorLinker.setColor(self.colorLinker, color); };


} else {
    exports = _G.loadedFiles[filePath];
}