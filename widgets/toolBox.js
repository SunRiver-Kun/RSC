var _G = Number.prototype._G;
//监督分类


//非监督分类
var CobwebScreen = require("users/sunriverkun/gee_test:screens/cobwebScreen.js");

var SubMenu = {};
SubMenu.new = function (str, color) {
    var self = {
        c: SubMenu,
        widget: null,
        children: [],
        str: str,
        isOpen: true,

    };
    var widget = ui.Button("- ", _G.handler(self, SubMenu.onClick));
    if(color) { widget.style().set("color", color); }
    self.widget = widget;
    SubMenu.setOpen(self, self.isOpen);
    return self;
};

SubMenu.onClick = function (self) {
    SubMenu.setOpen(self, !self.isOpen);
};

SubMenu.getShowStr = function (self) {
    return (self.isOpen ? "- " : "+ ") + self.str;
}

SubMenu.setStr = function (self, str) {
    self.str = str;
    self.widget.setLabel(SubMenu.getShowStr(self));
}

SubMenu.setOpen = function (self, isOpen) {
    self.isOpen = isOpen;
    self.widget.setLabel(SubMenu.getShowStr(self));
    for(var i=0; i<self.children.length; ++i){
      self.children[i].style().set("shown", isOpen);
    }
};

SubMenu.addChild = function (self, child) {
    self.children.push(child);
    child.style().set("shown", self.isOpen);
}

SubMenu.removeChild = function (self, child) {
    var children = self.children;
    for (var i = 0; i < children.length; ++i) {
        if (children[i] === child) {
            return children.splice(i, 1);
        }
      }
}

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

function addMenuItem(menuItem, subMenu, panel) {
    SubMenu.addChild(subMenu, menuItem.widget);
    panel.add(menuItem.widget);
}


exports.new = function () {
    var panel = ui.Panel();
    var self = {
        c: exports,
        widget: panel,

    };
    panel.setLayout(ui.Panel.Layout.flow("vertical"));
    var classifyMenu = SubMenu.new("监督分类", "orange");
    panel.add(classifyMenu.widget);
    addMenuItem(MenuItem.new("decisionTree", null), classifyMenu, panel);

    var clusterMenu = SubMenu.new("非监督分类", "orange");
    panel.add(clusterMenu.widget);
    addMenuItem(MenuItem.new("cobWeb", CobwebScreen), clusterMenu, panel);
    return self;
};