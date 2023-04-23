var _G = Number.prototype._G;
//监督分类


//非监督分类
var KMeansScreen = require("users/sunriverkun/gee_test:screens/kMeansScreen.js");
var XMeansScreen = require("users/sunriverkun/gee_test:screens/xMeansScreen.js");
var LVQScreen = require("users/sunriverkun/gee_test:screens/lVQScreen.js");

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

MenuItem.onClick = function (self){
    var screen = self.screenCls.new()
    _G.clearScreen();
    _G.pushScreen(screen);
};

function addMenuItem(menuItem, subMenu) {
    SubMenu.add(subMenu, menuItem.widget);
}

exports.new = function () {
    var panel = ui.Panel(null, ui.Panel.Layout.flow("vertical"), {
        backgroundColor: "FFFFFF5F"
    });
    var self = {
        c: exports,
        widget: panel
    };

    //标题
    var titlePanel = ui.Panel(null, ui.Panel.Layout.flow("horizontal"), {
        backgroundColor : "FFFFFFAF",
        margin : "-10px -6px 0px -6px",
        //padding : "0px 10px"
    });
    titlePanel.add(ui.Label("💼工具栏", {
        fontSize : "20px",
        backgroundColor: "FFFFFF00"
    }));
    titlePanel.add(ui.Button("> >    ++++++++++", _G.handler(self, exports.hide), undefined, {
        width : "27px"
    }));
    panel.add(titlePanel);

    //内容
    var classifyMenu = SubMenu.new("监督分类");
    panel.add(classifyMenu.widget);
    addMenuItem(MenuItem.new("decisionTree", null), classifyMenu);

    var clusterMenu = SubMenu.new("非监督分类");
    panel.add(clusterMenu.widget);
    addMenuItem(MenuItem.new("kMeans", KMeansScreen), clusterMenu);
    addMenuItem(MenuItem.new("XMeans", XMeansScreen), clusterMenu);
    addMenuItem(MenuItem.new("LVQ", LVQScreen), clusterMenu);

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