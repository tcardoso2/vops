function _StringFormatInline() {
    var txt = this;
    for (var i = 0; i < arguments.length; i++) {
        var exp = new RegExp('\\{' + (i) + '\\}', 'gm');
        txt = txt.replace(exp, arguments[i]);
    }
    return txt;
}

function _StringFormatStatic() {
    for (var i = 1; i < arguments.length; i++) {
        var exp = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
        arguments[0] = arguments[0].replace(exp, arguments[i]);
    }
    return arguments[0];
}

if (!String.prototype.format) {
    String.prototype.format = _StringFormatInline;
}

if (!String.format) {
    String.format = _StringFormatStatic;
}

if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return (this.replace(/^[\s\xA0]+/, "").replace(/[\s\xA0]+$/, ""));
    };
}

if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (str) {
        return (this.match("^" + str) == str);
    };
}

if (!String.prototype.endsWith) {
    String.prototype.endsWith = function (str) {
        return (this.match(str + "$") == str);
    };
}

