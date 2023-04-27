var _G = Number.prototype._G;
var filePath = "styles";
if (_G.loadedFiles[filePath] == null) {
    _G.loadedFiles[filePath] = exports;
    print("Load " + filePath);

    exports.totalTitle = { fontSize: "24px", fontWeight: "bold", padding: "10px" };
    exports.title = { fontWeight: "bold" };
    exports.des = { fontSize: "12px", color: "gray" };

    exports.imageParams = {
        "LANDSAT/LC08/C01/T1_SR": { bands: ["B4", "B3", "B2"], min: 0, max: 3000 },
        "LANDSAT/LC08/C01/T1": { bands: ["B4", "B3", "B2"], min: 5000, max: 15000 }
    };
} else {
    exports = _G.loadedFiles[filePath];
}