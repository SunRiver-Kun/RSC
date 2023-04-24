var _G = Number.prototype._G;
var filePath = "screens/mapDrawScreen";
if (_G.loadedFiles[filePath] == null) {
    _G.loadedFiles[filePath] = exports;
    print("Load " + filePath);

    exports.new = function (helpStr, onFinishCb) {
        var panel = ui.Panel();
        panel.setLayout(ui.Panel.Layout.flow("horizontal"));
        var self = {
            c: exports,
            widget: panel
        };
        Map.drawingTools().layers().reset();

        exports.setOnFinish(self, onFinishCb);

        self.helpLabel = ui.Label(helpStr!=undefined ? helpStr : "请使用左上角的绘图工具绘制几何体");
        panel.add(self.helpLabel);
        self.finishButton = ui.Button("完成", _G.handler(self, exports.onFinish));
        panel.add(self.finishButton);
        self.cancelButton = ui.Button("取消", _G.handler(self, exports.onCancel));
        panel.add(self.cancelButton);

        Map.add(self.widget);

        return self;
    };

    exports.setOnFinish = function (self, fn) {
       self.onFinishCb = fn; 
    }

    exports.pop = function (self) {
        Map.drawingTools().layers().reset();
        Map.remove(self.widget);
    }

    exports.onFinish = function (self) {
        if (self.onFinishCb) {
            self.onFinishCb(Map.drawingTools().layers());
        }
        exports.pop(self);
    };

    exports.onCancel = function (self) {
        exports.pop(self);
    }

} else {
    exports = _G.loadedFiles[filePath];
}