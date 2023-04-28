var _G = Number.prototype._G;
var filePath = "widgets/mapDrawer";
if (_G.loadedFiles[filePath] == null) {
    _G.loadedFiles[filePath] = exports;
    print("Load " + filePath);

    exports.new = function (helpStr, onFinishCb, onCancelCb, resetLayer) {
        var panel = ui.Panel(null, ui.Panel.Layout.flow("vertical"), {
            position: "top-left",
        });
        var self = {
            c: exports,
            widget: panel
        };

        exports.setOnFinish(self, onFinishCb);
        exports.setOnCancel(self, onCancelCb);
        self.resetLayer = resetLayer;
        if (self.resetLayer) { Map.drawingTools().layers().reset(); }

        self.helpLabel = ui.Label("请使用左上角的绘图工具绘制几何体", { margin: "auto" });
        self.helpDesLabel = ui.Label("", { margin: "auto", fontSize: "12px", color: "gray" });
        if ((typeof helpStr) == "string") {
            self.helpLabel.setValue(helpStr);
            _G.hide(self.helpDesLabel);
        } else {
            self.helpLabel.setValue(helpStr.title);
            self.helpDesLabel.setValue(helpStr.des);
        }

        self.finishButton = ui.Button("完成", _G.handler(self, exports.onFinish));
        self.cancelButton = ui.Button("取消", _G.handler(self, exports.onCancel));

        panel.add(self.helpLabel);
        panel.add(self.helpDesLabel);
        panel.add(_G.horizontals([self.finishButton, self.cancelButton]));

        Map.add(self.widget);

        return self;
    };

    exports.setOnFinish = function (self, fn) {
        self.onFinishCb = fn;
    }

    exports.setOnCancel = function (self, fn) {
        self.onCancelCb = fn;
    }

    exports.pop = function (self) {
        if (self.resetLayer) { Map.drawingTools().layers().reset(); }
        Map.remove(self.widget);
    }

    exports.onFinish = function (self) {
        if (self.onFinishCb) {
            self.onFinishCb(Map.drawingTools().layers());
        }
        exports.pop(self);
    };

    exports.onCancel = function (self) {
        if (self.onCancelCb) {
            self.onFinishCb(Map.drawingTools().layers());
        }
        exports.pop(self);
    }

} else {
    exports = _G.loadedFiles[filePath];
}