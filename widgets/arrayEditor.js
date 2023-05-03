var _G = Number.prototype._G;
var filePath = "widgets/arrayEditor";
if (_G.loadedFiles[filePath] == null) {
    _G.loadedFiles[filePath] = exports;
    print("Load " + filePath);

    var ArrayItem = {};
    ArrayItem.new = function (parent, item, isNew) {
        var panel = ui.Panel();
        panel.setLayout(ui.Panel.Layout.flow("horizontal"));
        var self = {
            c: ArrayItem,
            widget: panel,
            parent: parent,
            item: item,
            isNew: isNew
        };
        self.removeButton = ui.Button("-", _G.handler(self, ArrayItem.remove), undefined, { padding: "0px" }, "https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/remove/default/24px.svg");

        _G.add(panel, item).add(self.removeButton);

        return self;
    };

    ArrayItem.remove = function (self) {
        self.parent.c.removeItem(self.parent, self);
    };

    ArrayItem.get = function (self) {
        return self.item;
    };

    ArrayItem.isNew = function (self) {
        return self.isNew;
    };

    exports.new = function (widgets, newWidgetFn) {
        var panel = ui.Panel();
        panel.setLayout(ui.Panel.Layout.flow("vertical"));
        var self = {
            c: exports,
            widget: panel,
            items: [],
            removedItems: [],
            newWidgetFn: newWidgetFn
        };

        self.itemPanel = ui.Panel(null, ui.Panel.Layout.flow("vertical"));
        self.newButton = ui.Button("+new", function () { exports.push(self, exports.getNewWidget(self), true); });
        self.clearButton = ui.Button("clear", _G.handler(self, exports.clear));

        panel.add(self.itemPanel);
        for (var i = 0; i < widgets.length; ++i) { exports.push(self, widgets[i]); }
        panel.add(_G.horizontals([self.newButton, self.clearButton], true));

        return self;
    };

    exports.push = function (self, widget, isNew) {
        if (widget == null) { return; }
        var item = ArrayItem.new(self, widget, isNew);
        _G.add(self.itemPanel, item);
        self.items.push(item);
    };

    exports.remove = function (self, index) {
        var items = self.items;
        var item = self.items[index];
        if (!ArrayItem.isNew(item)) { self.removedItems.push(item); }
        _G.remove(self.itemPanel, item);
        items.splice(index, 1);
    };

    exports.pop = function (self) {
        if (self.items.length == 0) { return; }
        exports.remove(self, self.items.length - 1);
    };

    exports.length = function (self) {
        return self.items.length;
    };

    exports.removeItem = function (self, item) {
        var items = self.items;
        var index = null;
        for (var i = 0; i < items.length; ++i) {
            if (items[i] == item) {
                index = i;
                break;
            }
        }
        if (index == null) { return; }
        exports.remove(self, index);
    };

    exports.clear = function (self) {
        var items = self.items;
        for (var i = items.length - 1; i >= 0; --i) {
            var item = items[i];
            if (!ArrayItem.isNew(item)) { self.removedItems.push(item); }
            _G.remove(self.itemPanel, item);
            items.pop();
        }
    };

    exports.getNewWidget = function (self) {
        return self.newWidgetFn ? self.newWidgetFn() : null;
    };

    exports.forEach = function (self, fn) {
        if (fn == null) { return; }
        var items = self.items;
        for (var i = 0; i < items.length; ++i) {
            fn(ArrayItem.get(items[i]), ArrayItem.isNew(items[i]));
        }
    };

    exports.forEachRemoved = function (self, fn) {
        if (fn == null) { return; }
        var items = self.removedItems;
        for (var i = 0; i < items.length; ++i) {
            fn(ArrayItem.get(items[i]));
        }
    };

} else {
    exports = _G.loadedFiles[filePath];
}