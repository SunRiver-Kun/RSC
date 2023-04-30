var _G = Number.prototype._G;
var filePath = "widgets/imageChooser";
if (_G.loadedFiles[filePath] == null) {
    _G.loadedFiles[filePath] = exports;
    print("Load " + filePath);

    var ImageBrowerScreen = require("users/sunriverkun/gee_test:screens/imageBrowerScreen.js");

    exports.new = function (lockNameTex, onSetNameCb) {
        var self = {
            c: exports,
            widget: null,
            imageName: null,
            image: null,
            onSetNameCb: onSetNameCb
        };

        self.imageLabel = ui.Label("遥感图像名");
        self.imageNameTex = ui.Textbox("", "");
        self.imageNameTex.setDisabled(lockNameTex);
        self.chooseButton = ui.Button("选择", _G.handler(self, exports.onChooseButtonClick));
        self.widget = _G.horizontals([self.imageLabel, self.imageNameTex, self.chooseButton], true);

        return self;
    };

    exports.getShowImage = function (self, zoom) {
        var name = self.imageNameTex.getValue();
        if (name == "") { alert("遥感图像名为空"); return null; }

        if (_G.isNotVaildImageName(name)) {
            if (self.imageName == name && self.image != null) {
                Map.centerObject(self.image, zoom);
                _G.rawAddLayerOrHideBefore(self.image, _G.getImageVisualParams(name), name);
                return self.image
            } else {
                alert("遥感图像名错误，如需使用裁剪或合成的图像，点击选择按钮");
                return null;
            }
        } else {
            _G.addLayerOrHideBefore(name, true, zoom);
            return ee.Image(name);
        }
    };

    exports.getImage = function (self) {
        var name = self.imageNameTex.getValue();
        if (name == "") { alert("遥感图像名为空"); return null; }

        if (_G.isNotVaildImageName(name)) {
            if (self.imageName == name && self.image != null) {
                return self.image
            } else {
                alert("遥感图像名错误，如需使用裁剪或合成的图像，点击选择按钮");
                return null;
            }
        } else {
            return ee.Image(name);
        }
    };

    exports.setImageName = function (self, name) {
        self.imageName = name;
        self.imageNameTex.setValue(name);
        if(self.onSetNameCb) { self.onSetNameCb(name, self); }
    };

    exports.onChooseButtonClick = function (self) {
        var screen = ImageBrowerScreen.new(function (image, imageName) {
            self.image = image;
            exports.setImageName(self, imageName);
            _G.popScreen();
        });
        _G.pushScreen(screen);
    };

} else {
    exports = _G.loadedFiles[filePath];
}