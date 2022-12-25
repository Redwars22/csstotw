var reader = require('prompt-sync')();
var Tools = /** @class */ (function () {
    function Tools() {
    }
    Tools.prototype.transformToRem = function (value) {
        return value / 16;
    };
    return Tools;
}());
var units = {
    px: "px",
    rem: "rem"
};
var CSSTOTailwindMap = {
    "margin-top": "mt-",
    "width: 100%": "w-full"
};
function parseTokens(tokens) {
    var tokensArr = tokens;
    for (var token = 0; token < tokensArr.length; token++) {
        if (CSSTOTailwindMap[tokensArr[token]]) {
            tokensArr[token] = CSSTOTailwindMap[tokensArr[token]];
        }
        if (tokensArr[token].includes(units.px)) {
            var utils = new Tools();
            tokensArr[token] = tokensArr[token].replace(units.px, "");
            tokensArr[token] = "[".concat(utils.transformToRem(Number(tokensArr[token]))).concat(units.rem, "]");
        }
    }
    return tokensArr.join("");
}
while (true) {
    var command = reader("CSStoTW: ");
    if (command === null || command === void 0 ? void 0 : command.trim().match(/margin-top: .*/)) {
        var statement = command.split(':');
        console.log(parseTokens(statement));
    }
    if (command.trim() == "exit")
        break;
    for (var CSSRule_1 in CSSTOTailwindMap) {
        if ((command === null || command === void 0 ? void 0 : command.trim()) == CSSRule_1)
            console.log(CSSTOTailwindMap[CSSRule_1]);
    }
}
