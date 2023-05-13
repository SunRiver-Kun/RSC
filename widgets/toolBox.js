var _G = Number.prototype._G;
//监督分类
var CartScreen = require("users/sunriverkun/gee_test:screens/cartScreen.js");
var MinimumDistanceScreen = require("users/sunriverkun/gee_test:screens/minimumDistanceScreen.js");
var NaiveBayesScreen = require("users/sunriverkun/gee_test:screens/naiveBayesScreen.js");
var RandomForestScreen = require("users/sunriverkun/gee_test:screens/randomForestScreen.js");

//非监督分类
var KMeansScreen = require("users/sunriverkun/gee_test:screens/kMeansScreen.js");
var XMeansScreen = require("users/sunriverkun/gee_test:screens/xMeansScreen.js");
var LVQScreen = require("users/sunriverkun/gee_test:screens/lVQScreen.js");

//数据管理
var ImageExportScreen = require("users/sunriverkun/gee_test:screens/imageExportScreen.js");
var FeatureExportScreen = require("users/sunriverkun/gee_test:screens/featureExportScreen.js");

//Widget
var SubMenu = require("users/sunriverkun/gee_test:widgets/subMenu.js");

var MenuItem = {};
MenuItem.new = function (str, screenCls) {
    var self = {
        c: MenuItem,
        widget: null,
        screenCls: screenCls
    };
    var widget = ui.Button(str, _G.handler(self, MenuItem.onClick));
    self.widget = widget;
    return self;
};

MenuItem.onClick = function (self) {
    var screen = self.screenCls.new()
    _G.clearScreen();
    _G.pushScreen(screen);
};

function addMenuItem(menuItem, subMenu) {
    SubMenu.add(subMenu, menuItem.widget);
}

exports.new = function () {
    var panel = ui.Panel(null, ui.Panel.Layout.flow("vertical"), {
        //backgroundColor: "FFFFFF5F"
    });
    var self = {
        c: exports,
        widget: panel
    };

    //内容
    var subPanelStyle = { margin: "0px 0px auto 10%" };
    var classifyMenu = SubMenu.new("📁监督分类", undefined ,subPanelStyle);
    panel.add(classifyMenu.widget);
    addMenuItem(MenuItem.new("Cart", CartScreen), classifyMenu);
    addMenuItem(MenuItem.new("MinDistance", MinimumDistanceScreen), classifyMenu);
    addMenuItem(MenuItem.new("NaiveBayes", NaiveBayesScreen), classifyMenu);
    addMenuItem(MenuItem.new("RandomForest", RandomForestScreen), classifyMenu);

    var clusterMenu = SubMenu.new("📁非监督分类", undefined, subPanelStyle);
    panel.add(clusterMenu.widget);
    addMenuItem(MenuItem.new("kMeans", KMeansScreen), clusterMenu);
    addMenuItem(MenuItem.new("XMeans", XMeansScreen), clusterMenu);
    addMenuItem(MenuItem.new("LVQ", LVQScreen), clusterMenu);

    var fileMenu = SubMenu.new("📁数据管理", undefined, subPanelStyle);
    panel.add(fileMenu.widget);
    addMenuItem(MenuItem.new("图像导出", ImageExportScreen), fileMenu);
    addMenuItem(MenuItem.new("绘图导出", FeatureExportScreen), fileMenu);


    return self;
};

exports.isShown = function (self) {
    return self.widget.style().get("shown");
}

exports.setShown = function (self, shown) {
    self.widget.style().set("shown", shown);
}

exports.show = function (self) {
    exports.setShown(self, true);
}

exports.hide = function (self) {
    exports.setShown(self, false);
}