var widgetStack = [];
exports.pushScreen = function(screen){
    widgetStack.push(screen);
};

exports.popScreen = function() {
    return widgetStack.pop();
};

exports.topScreen = function(){
    return widgetStack[widgetStack.length - 1];
};

exports.show = function(ui) {
    ui.style().set('shown',true);  
};

exports.hide = function(ui) {
    ui.style().set('shown',false);  
};