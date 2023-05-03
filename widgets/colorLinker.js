var _G = Number.prototype._G;
var filePath = "widgets/colorLinker";
if (_G.loadedFiles[filePath] == null) {
    _G.loadedFiles[filePath] = exports;
    print("Load " + filePath);

    exports.new = function (hasAlpha, size) {
        var panel = ui.Panel(null, ui.Panel.Layout.flow("horizontal"), { margin: "auto 0px" });
        var self = {
            c: exports,
            widget: panel,
            hasAlpha: hasAlpha
        };

        self.colorLabel = ui.Label("", { padding: size ? size : "12px", margin:"auto 0px" });
        self.colorTex = ui.Textbox("#RRGGBB" + (hasAlpha ? "AA" : ""), "", _G.handler(self, exports.onColorTexChange), undefined, {
            width: "98px",
            margin: "auto 0px"
        });

        panel.add(self.colorLabel);
        panel.add(self.colorTex);

        exports.setColor(self, _G.getRandomColor(hasAlpha));
        return self;
    };

    exports.getColor = function (self) {
        return self.colorLabel.style().get("backgroundColor");
    };

    exports.setColor = function (self, color) {
        self.colorLabel.style().set("backgroundColor", color);
        self.colorTex.setValue(color);
    };

    exports.randomColor = function (self) {
        var color = _G.getRandomColor(self.hasAlpha);
        exports.setColor(self, color);
        exports.onColorTexChange(self);
    };

    exports.onColorTexChange = function (self) {
        var color = self.colorTex.getValue();
        if (_G.isValidColor(color, self.hasAlpha)) {
            self.colorLabel.style().set("backgroundColor", color);
            self.colorTex.style().set("color", "black");
        } else {
            self.colorTex.style().set("color", "red");
        }
    };

} else {
    exports = _G.loadedFiles[filePath];
}