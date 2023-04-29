var _G = Number.prototype._G;
var filePath = "screens/imageBrowerScreen";
if (_G.loadedFiles[filePath] == null) {
    _G.loadedFiles[filePath] = exports;
    print("Load " + filePath);

    var MapDrawer = require("users/sunriverkun/gee_test:widgets/mapDrawer.js");
    var SubMenu = require("users/sunriverkun/gee_test:widgets/subMenu.js");
    var ImageCollectionViewr = require("users/sunriverkun/gee_test:widgets/imageCollectionViewr.js");
    var FeatureDrawer = require("users/sunriverkun/gee_test:widgets/featureDrawer.js");

    var provinceNames = null;
    var provincesData = ee.FeatureCollection("projects/ee-sunriverkun/assets/china_province"); //省区
    provincesData.aggregate_array("省区").evaluate(function (list) { provinceNames = list; });

    var cityNames = null;
    var citysData = ee.FeatureCollection("projects/ee-sunriverkun/assets/china_city");  //地市
    citysData.aggregate_array("地市").evaluate(function (list) { cityNames = list; });

    var divCh = "；";

    var defaultCollectionTypes = {
        "Landsat-8-T1_SR": { c: "LANDSAT/LC08/C01/T1_SR", des: "Landsat 8, Collection 1, Tier 1 + Real Time" },
        "Landsat-8-T1": { c: "LANDSAT/LC08/C01/T1", des: "Landsat 8, Collection 1, Tier 1" }
    };
    var defaultCollectionType = "Landsat-8-T1_SR";

    exports.new = function (onChooseClick, collectionTypes, defaultType) {
        var panel = ui.Panel(null, ui.Panel.Layout.flow("vertical"));
        var self = {
            c: exports,
            widget: panel,
            onChooseClick : onChooseClick
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
        self.cltTypeSelect = ui.Select(Object.keys(self.cltTypes), "图像来源", defaultType, _G.handler(self, exports.onImageCollectionChange));

        menu = SubMenu.new("🧾图像来源", titleStyle);
        panel.add(menu.widget);
        SubMenu.add(menu, self.cltTypeDesLabel);
        SubMenu.add(menu, self.cltTypeSelect);
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
        self.cltTypeDesLabel.setValue(self.cltTypes[type].des != null ? self.cltTypes[type].des : "");
    };
    
    //图像选择
    exports.onSearchButtonClick = function (self) {
        var geometry = FeatureDrawer.getGeometry(self.featureDrawer);
        var typeData = self.cltTypes[self.cltTypeSelect.getValue()];
        var cloudValue = parseInt(self.cloudTex.getValue());
        var collection = ee.ImageCollection(typeData.c)
            .filterDate(self.startTimeTex.getValue(), self.endTimeTex.getValue())
            .filter(ee.Filter.lte('CLOUD_COVER', cloudValue));
        if (geometry != null) { collection = collection.filterBounds(geometry); }

        var visParams = _G.getImageVisualParams(typeData.c, true);
        var viewr = ImageCollectionViewr.new(collection, visParams, visParams, geometry, self.onChooseClick);
        self.resultPanel.clear();
        self.resultPanel.add(viewr.widget);
    };

} else {
    exports = _G.loadedFiles[filePath];
}