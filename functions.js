var widgetStack = [];
exports.pushScreen = function (screen) {
    widgetStack.push(screen);
};

exports.popScreen = function () {
    return widgetStack.pop();
};

exports.topScreen = function () {
    return widgetStack[widgetStack.length - 1];
};

exports.clearScreen = function (){
    for(var i=widgetStack.length - 1; i>=0; --i){
      exports.hide(widgetStack[i]);
      widgetStack.pop();
    }
};

exports.show = function (ui) {
    ui.style().set("shown", true);
};

exports.hide = function (ui) {
    ui.style().set("shown", false);
};

exports.handler = function (self, fn) {
    return function (params) { fn(self, params); };
};

exports.horizontals = function (widgets) {
    var panel = ui.Panel();
    panel.setLayout(ui.Panel.Layout.flow("horizontal"));
    for(var i=0; i<widgets.length; ++i){
      panel.add(widgets[i]);
    }
    return panel;
}

exports.verticals = function (widgets) {
        var panel = ui.Panel();
    panel.setLayout(ui.Panel.Layout.flow("vertical"));
    for(var i=0; i<widgets.length; ++i){
      panel.add(widgets[i]);
    }
    return panel;
}