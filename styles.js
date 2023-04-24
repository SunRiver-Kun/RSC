var _G = Number.prototype._G;
var filePath = "styles";
if (_G.loadedFiles[filePath] == null) {
    _G.loadedFiles[filePath] = exports;
    print("Load " + filePath);

    exports.totalTitle = { fontSize: "24px", fontWeight: "bold", padding: "10px" };
    exports.title = { fontWeight: "bold" };
    exports.des = { fontSize: "12px", color: "gray" };


} else {
    exports = _G.loadedFiles[filePath];
}