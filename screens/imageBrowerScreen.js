var _G = Number.prototype._G;
var filePath = "screens/imageBrowerScreen";
if (_G.loadedFiles[filePath] == null) {
    _G.loadedFiles[filePath] = exports;
    print("Load " + filePath);

    var SubMenu = require("users/sunriverkun/gee_test:widgets/subMenu.js");
    var FeatureDrawer = require("users/sunriverkun/gee_test:widgets/featureDrawer.js");
    var ImageCollectionViewr = require("users/sunriverkun/gee_test:widgets/imageCollectionViewr.js");
    var ImageCollectionCompositer = require("users/sunriverkun/gee_test:widgets/imageCollectionCompositer.js");


    var defaultCollectionTypes = _G.imageParams;
    var defaultCollectionType = "LANDSAT/LC08/C01/T1_SR";
    var noneType = "_none_";
    var intersectType = "_intersect_";
    var maxImageCount = 100;


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
        self.compositeSelect = ui.Select(["一般影像", "合成影像"], "选择输出类型", "一般影像", _G.handler(self, exports.onCompositeSelectChange));

        menu = SubMenu.new("🧾图像设置", titleStyle);
        panel.add(menu.widget);
        SubMenu.add(menu, self.cltTypeDesLabel);
        SubMenu.add(menu, _G.horizontals([ui.Label("图片来源"), self.cltTypeSelect], true));
        SubMenu.add(menu, _G.horizontals([ui.Label("排序方式"), self.cltSortSelect, self.cltAscendingCheck], true));
        SubMenu.add(menu, _G.horizontals([ui.Label("输出类型"), self.compositeSelect], true));
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
        self.clearCloudCheck = ui.Checkbox("自动去云", false);

        menu = SubMenu.new("⛅云量设置", titleStyle);
        panel.add(menu.widget);
        SubMenu.add(menu, ui.Label("云量占比越大云越多, 0~100的整数", _G.styles.des));
        SubMenu.add(menu, _G.horizontals([ui.Label("云量占比 ≤ "), self.cloudTex, self.clearCloudCheck], true));

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
        exports.onImageCollectionChange(self, defaultType);
        exports.onCompositeSelectChange(self, "一般影像")

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


    exports.onCompositeSelectChange = function (self, type) {
        var isComposite = type == "合成影像";
        self.clearCloudCheck.setValue(isComposite);
    }

    //图像选择
    function getClearCloudCollection(collection, type) {
        var cloudBand = _G.getImageCloudBand(type + _G.compositeImageTail);
        if (cloudBand == null) { return collection; }
        return collection.map(function (image) {
            var qa = image.select(cloudBand);
            // If the cloud bit (5) is set and the cloud confidence (7) is high
            // or the cloud shadow bit is set (3), then it's a bad pixel.
            var cloud = qa.bitwiseAnd(1 << 5)
                .and(qa.bitwiseAnd(1 << 7))
                .or(qa.bitwiseAnd(1 << 3))
            //删除所有波段中不出现的边缘像素
            var mask2 = image.mask().reduce(ee.Reducer.min());
            return image.updateMask(cloud.not()).updateMask(mask2);
        });
    };

    exports.onSearchButtonClick = function (self) {
        var cloudValue = _G.Astr2UInt((self.cloudTex.getValue()), "云量的范围在0~100");
        if (cloudValue == null) { return; }
        if (cloudValue < 0 || cloudValue > 100) { alert("云量的范围在0~100"); return; }

        var geometry = FeatureDrawer.getGeometry(self.featureDrawer);

        var type = self.cltTypeSelect.getValue();
        var typeData = self.cltTypes[type];
        var cloud = typeData.sortType.cloud;
        var sortType = self.cltSortSelect.getValue();
        var isComposite = self.compositeSelect.getValue() == "合成影像"

        //基本选择
        var collection = ee.ImageCollection(type)
            .filterDate(self.startTimeTex.getValue(), self.endTimeTex.getValue())
            .filter(ee.Filter.lte(cloud, cloudValue))
        if (geometry != null) { collection = collection.filterBounds(geometry); }

        //排序
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

        //限制数量
        if (!isComposite) { collection = collection.limit(maxImageCount); }

        //去云
        if (self.clearCloudCheck.getValue()) { collection = getClearCloudCollection(collection, type); }

        var viewr = null;
        if (isComposite) {
            var visParams = _G.getImageVisualParams(type + _G.compositeImageTail);
            viewr = ImageCollectionCompositer.new(collection, visParams, visParams, geometry, self.onChooseClick, null, type);
        } else {
            var visParams = _G.getImageVisualParams(type + "/name");
            viewr = ImageCollectionViewr.new(collection, visParams, visParams, geometry, self.onChooseClick, null, maxImageCount - 1);
        }

        self.resultPanel.clear();
        self.resultPanel.add(viewr.widget);
    };

} else {
    exports = _G.loadedFiles[filePath];
}