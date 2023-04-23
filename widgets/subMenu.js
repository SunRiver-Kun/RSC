var _G = Number.prototype._G;
var filePath = "widgets/subMenu";
if (_G.loadedFiles[filePath] == null) {
    _G.loadedFiles[filePath] = exports;
    print("Load " + filePath);

    exports.new = function (str) {
        var panel = ui.Panel(null, ui.Panel.Layout.flow("vertical"), {
            backgroundColor: "FFFFFF00",
        });

        var self = {
            c: exports,
            widget: panel,
            panel : ui.Panel(null, ui.Panel.Layout.flow("vertical"), {
                backgroundColor: "FFFFFF00",
                margin : "0px 0px auto 10%"
            }),
            str : str ? str :"subMenu"
        };
        
        self.button = ui.Button("", _G.handler(self, exports.onClick));
        panel.add(self.button);
        panel.add(self.panel);

        exports.setIsOpen(self, true);
        return self;
    };

    exports.isopen = function (self) {
        return self.panel.style().get("shown");
    }

    exports.setIsOpen = function (self, isopen) {
        self.panel.style().set("shown", isopen);
        self.button.setLabel( (isopen ? "-" : "+") + " 📁"  + self.str);
    }

    exports.setStr = function (self, str) {
        self.str = str;
        exports.setIsOpen(self, exports.isopen(self));
    }

    exports.add = function (self, widget) {
        if(widget.widget) { widget = widget.widget; }
        self.panel.add(widget);
    }

    exports.remove = function (self, widget) {
        if(widget.widget) { widget = widget.widget; }
        self.panel.remove(widget);
    }

    exports.onClick = function (self) {
        exports.setIsOpen(self, !exports.isopen(self));
    }

} else {
    exports = _G.loadedFiles[filePath];
}