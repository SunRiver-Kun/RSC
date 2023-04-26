var _G = Number.prototype._G;
var _S = String.prototype;
var filePath = "string";
if (_G.loadedFiles[filePath] == null) {
    _G.loadedFiles[filePath] = _S;
    print("Load " + filePath);

    _S.startsWith = function (str) {
        if (this.length < str.length) { return false; }
        for (var i = 0; i < str.length; ++i) {
            if (this[i] != str[i]) {
                return false;
            }
        }
        return true;
    };

} else {

}