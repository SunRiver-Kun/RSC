var _G = Number.prototype._G;
var filePath = "screens/imageBrowerScreen";
if (_G.loadedFiles[filePath] == null) {
    _G.loadedFiles[filePath] = exports;
    print("Load " + filePath);

    var MapDrawer = require("users/sunriverkun/gee_test:widgets/mapDrawer.js");
    var SubMenu = require("users/sunriverkun/gee_test:widgets/subMenu.js");
    var ImageCollectionViewr = require("users/sunriverkun/gee_test:widgets/imageCollectionViewr.js");
    var FeatureDrawer = require("users/sunriverkun/gee_test:widgets/featureDrawer.js");

    var defaultCollectionTypes = _G.imageParams;
    var defaultCollectionType = "LANDSAT/LC08/C01/T1_SR";
    var noneType = "_none_";
    var intersectType = "_intersect_";


    exports.new = function (onChooseClick, collectionTypes, defaultType) {
        var panel = ui.Panel(null, ui.Panel.Layout.flow("vertical"));
        var self = {
            c: exports,
            widget: panel,
            onChooseClick: onChooseClick
        };
        //参数预处理
        collectionTypes = collectionTypes ? collectionTypes : defaultCollectionTypes;
        defaultType = defaultType ? defaultType : defaultCollectionType;

        var menu = null;
        var titleStyle = _G.styles.title;

        panel.add(ui.Label("图像选择界面", _G.styles.totalTitle));
        //类型
        self.cltTypes = collectionTypes;
        self.cltTypeDesLabel = ui.Label(collectionTypes[defaultType].des != null ? collectionTypes[defaultType].des : "", _G.styles.des);
        self.cltTypeSelect = ui.Select(Object.keys(self.cltTypes), "选择图像来源", defaultType, _G.handler(self, exports.onImageCollectionChange));
        self.cltSortSelect = ui.Select([noneType, intersectType], "选择排序方式", noneType);
        self.cltAscendingCheck = ui.Checkbox("升序", true);
        exports.onImageCollectionChange(self, defaultType);

        menu = SubMenu.new("🧾图像设置", titleStyle);
        panel.add(menu.widget);
        SubMenu.add(menu, self.cltTypeDesLabel);
        SubMenu.add(menu, _G.horizontals([ui.Label("图片来源"), self.cltTypeSelect], true));
        SubMenu.add(menu, _G.horizontals([ui.Label("排序方式"), self.cltSortSelect, self.cltAscendingCheck], true));
        //地区
        self.featureDrawer = FeatureDrawer.new();

        menu = SubMenu.new("🎨研究区域", titleStyle);
        panel.add(menu.widget);
        SubMenu.add(menu, self.featureDrawer.widget);
        //时间
        self.startTimeTex = ui.Textbox("YYYY-MM-DD", "2015-01-01");
        self.endTimeTex = ui.Textbox("YYYY-MM-DD", "2022-12-31")

        menu = SubMenu.new("📅起止时间", titleStyle);
        panel.add(menu.widget);
        SubMenu.add(menu, ui.Label("输入格式为YYYY-MM-DD, 例如：2015-01-01", _G.styles.des));
        SubMenu.add(menu, _G.horizontals([ui.Label("开始时间"), self.startTimeTex], true));
        SubMenu.add(menu, _G.horizontals([ui.Label("结束时间"), self.endTimeTex], true));
        //云量
        self.cloudTex = ui.Textbox("0~100", "5", null, false, { width: "40px" });

        menu = SubMenu.new("⛅云量占比", titleStyle);
        panel.add(menu.widget);
        SubMenu.add(menu, ui.Label("云量占比越大云越多, 0~100的整数", _G.styles.des));
        SubMenu.add(menu, _G.horizontals([ui.Label("云量占比小于等于"), self.cloudTex], true));

        //图像选择
        self.searchButton = ui.Button("搜索图像🔍", _G.handler(self, exports.onSearchButtonClick), false, { stretch: "horizontal" });
        self.resultLabel = ui.Label("");
        self.resultPanel = ui.Panel(null, ui.Panel.Layout.flow("vertical"));

        menu = SubMenu.new("💾图像选择", titleStyle);
        panel.add(menu.widget);
        SubMenu.add(menu, ui.Label("点击搜索开始搜索图像", _G.styles.des));
        SubMenu.add(menu, _G.horizontals([self.searchButton, self.resultLabel]));
        SubMenu.add(menu, self.resultPanel);
        //default


        return self;
    };

    //类型
    exports.onImageCollectionChange = function (self, type) {
        var typeData = self.cltTypes[type];
        var sortType = Object.keys(self.cltTypes[type].sortType);
        sortType.unshift(noneType, intersectType);

        self.cltTypeDesLabel.setValue(typeData.des != null ? typeData.des : "");
        self.cltSortSelect.items().reset(sortType);
        self.cltSortSelect.setValue(null, false);
        self.cltSortSelect.setValue(noneType, true);

    };

    //图像选择
    exports.onSearchButtonClick = function (self) {
        var cloudValue = _G.Astr2UInt((self.cloudTex.getValue()), "云量应为非负整数");
        if (cloudValue == null) { return; }

        var geometry = FeatureDrawer.getGeometry(self.featureDrawer);

        var type = self.cltTypeSelect.getValue();
        var typeData = self.cltTypes[type];
        var cloud = typeData.sortType.cloud;
        var sortType = self.cltSortSelect.getValue();

        var collection = ee.ImageCollection(type)
            .filterDate(self.startTimeTex.getValue(), self.endTimeTex.getValue())
            .filter(ee.Filter.lte(cloud, cloudValue));
        if (geometry != null) { collection = collection.filterBounds(geometry); }
        if (sortType == intersectType) {
            if (geometry == null) { alert("未绘制研究区域，无法根据相交区域排序"); return; }
            else {
                collection = collection.map(function (image) {
                    var area = image.geometry().intersection(geometry, 100).area();
                    var table = {};
                    table[intersectType] = area;
                    return image.set(table);
                });
                collection = collection.sort(intersectType, self.cltAscendingCheck.getValue());
            }
        }
        if (sortType != null && sortType != noneType && sortType != intersectType) { collection = collection.sort(typeData.sortType[sortType], self.cltAscendingCheck.getValue()); }

        var visParams = _G.getImageVisualParams(type, true);
        var viewr = ImageCollectionViewr.new(collection, visParams, visParams, geometry, self.onChooseClick);
        self.resultPanel.clear();
        self.resultPanel.add(viewr.widget);
    };

} else {
    exports = _G.loadedFiles[filePath];
}