var _G = Number.prototype._G;
var filePath = "styles";
if (_G.loadedFiles[filePath] == null) {
    _G.loadedFiles[filePath] = exports;
    print("Load " + filePath);

    exports.totalTitle = { fontSize: "24px", fontWeight: "bold", padding: "10px" };
    exports.title = { fontWeight: "bold" };
    exports.des = { fontSize: "12px", color: "gray" };

    //bands不包含sr_aerosol等
    exports.imageParams = {
        "LANDSAT/LC08/C01/T1_SR": {
            visParams: { bands: ["B4", "B3", "B2"], min: 0, max: 3000 },
            bands: ["B1", "B2", "B3", "B4", "B5", "B6", "B7", "B10", "B11"]
        },
        "LANDSAT/LC08/C01/T1": {
            visParams: { bands: ["B4", "B3", "B2"], min: 5000, max: 15000 },
            bands: ["B1", "B2", "B3", "B4", "B5", "B6", "B7", "B8", "B9", "B10", "B11"]
        },
    };
} else {
    exports = _G.loadedFiles[filePath];
}