var _G = Number.prototype._G;
var filePath = "screens/geometrySettingScreen";
if (_G.loadedFiles[filePath] == null) {
    _G.loadedFiles[filePath] = exports;
    print("Load " + filePath);

    var ColorNameItem = require("users/sunriverkun/gee_test:widgets/colorNameItem.js");
    var ArrayEditor = require("users/sunriverkun/gee_test:widgets/arrayEditor.js");

    var GeoLayerItem = {};
    GeoLayerItem.new = function (layer) {
        var self = ColorNameItem.new(layer.getColor(), layer.getName(), false, "Name");
        self._layer = layer;
        return self;
    };

    GeoLayerItem.getLayer = function (self) {
        return self._layer;
    };

    exports.new = function () {
        var panel = ui.Panel();
        panel.setLayout(ui.Panel.Layout.flow("vertical"));
        var self = {
            c: exports,
            widget: panel
        };

        var items = [];
        var layers = Map.drawingTools().layers();
        for (var i = 0; i < layers.length(); ++i) {
            var item = GeoLayerItem.new(layers.get(i));
            items.push(item);
        }
        self.editor = ArrayEditor.new(items, function () {
            var layer = ui.Map.GeometryLayer({ color: _G.getRandomColor() });
            return GeoLayerItem.new(layer, true);
        });

        self.finishButton = ui.Button("确认", _G.handler(self, exports.onFinish));
        self.cancelButton = ui.Button("取消", _G.handler(self, exports.onCancel));

        panel.add(ui.Label("几何层设置", _G.styles.totalTitle));
        panel.add(ui.Label("Color格式是#RRGGBB，输入后回车", _G.styles.des));
        panel.add(ui.Label("Name要求独一无二，字母开头，可加数字", _G.styles.des));
        panel.add(self.editor.widget);
        panel.add(_G.horizontals([self.finishButton, self.cancelButton]));
        return self;
    };

    function removeGeoLayer(geoItem) {
        var layer = GeoLayerItem.getLayer(geoItem);
        Map.drawingTools().layers().remove(layer);
    }

    function addOrSetGeoLayer(geoItem, isNew) {
        var layer = GeoLayerItem.getLayer(geoItem);
        layer.setColor(ColorNameItem.getColor(geoItem));
        layer.setName(ColorNameItem.getName(geoItem));
        if (isNew) { Map.drawingTools().layers().add(layer); }
    }

    exports.onFinish = function (self) {
        ArrayEditor.forEachRemoved(self.editor, removeGeoLayer);
        ArrayEditor.forEach(self.editor, addOrSetGeoLayer);
        _G.popScreen(self);
    };

    exports.onCancel = function (self) {
        _G.popScreen(self);
    };


} else {
    exports = _G.loadedFiles[filePath];
}