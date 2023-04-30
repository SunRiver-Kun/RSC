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

    _S.endsWith = function (str) {
        if (this.length < str.length) { return false; }

        var index = this.length - 1;
        var strindex = str.length - 1;
        while(strindex >= 0){
            if(this[index] != str[strindex]) { return false; }
            --index;
            --strindex;
        }

        return true;
    }

} else {

}