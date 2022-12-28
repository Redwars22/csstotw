var reader = require('prompt-sync')();
var term = require('terminal-kit').terminal;
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
var justify = {
    "flex-start": "start",
    "flex-end": "end",
    "center": "center",
    "space-between": "between",
    "space-around": "around",
    "space-evenly": "evenly"
};
var CSSTOTailwindMap = {
    "display: flex": "flex",
    "margin-top": "mt-",
    "margin-bottom": "mb-",
    "margin-left": "ml-",
    "margin-right": "mr-",
    "margin": "m-",
    "padding-top": "pt-",
    "padding-bottom": "pb-",
    "padding-left": "pl-",
    "padding-right": "pr-",
    "padding": "p-",
    "width: 100%": "w-full",
    "font-size": "text-",
    "font-weight": "font-",
    "justify-content": "justify-"
};
function parseTokens(tokens) {
    var tokensArr = tokens;
    for (var token = 0; token < tokensArr.length; token++) {
        if (CSSTOTailwindMap[tokensArr[token].trim()]) {
            tokensArr[token] = CSSTOTailwindMap[tokensArr[token].trim()];
            continue;
        }
        if (tokensArr[token].trim().includes(units.px)) {
            var utils = new Tools();
            tokensArr[token] = tokensArr[token].replace(units.px, "");
            tokensArr[token] = "[".concat(utils.transformToRem(Number(tokensArr[token]))).concat(units.rem, "]");
            continue;
        }
        if (tokensArr[token].trim() == "justify-content") {
            tokensArr[token] = CSSTOTailwindMap["justify-content"];
            tokensArr[token + 1] = justify[tokensArr[token + 1].trim()];
            break;
        }
        if (!CSSTOTailwindMap[tokensArr[token].trim()]) {
            if (Number(tokensArr[token]))
                tokensArr[token] = "[".concat(tokensArr[token].trim(), "]");
            continue;
            //if(isNaN(Number(tokensArr[token]))) tokensArr[token] = `"${tokensArr[token]}"`;
        }
    }
    return tokensArr.join("").replace(' ', '');
}
function init() {
    console.clear();
    term.windowTitle("CSSToTW - criado por @AndrewNation");
    term.bold.red('🦸️ 🤝️ 🍃️ CSSToTW - Conversor de declarações CSS para classes Tailwind 🌬️ 🛠️ ⚙️\n\n');
    term.bold.red("📚️ COMO USAR?\n");
    term.blue("Insira uma declaração CSS (por exemplo: 'margin-top: 16px;') para obter seu equivalente em classes Tailwind. ");
    term.blue("Por favor reportar bugs abrindo um issue no repositório do projeto.\n\n");
}
init();
while (true) {
    var command = reader("CSStoTW: ");
    if (command.includes(';')) {
        var statements = command.split(';');
        var parsedTW = void 0;
        parsedTW = "\"";
        for (var statement = 0; statement < statements.length; statement++) {
            if (statements[statement].match(/.*[A-Za-z\-]: .*[0-9A-Za-z\-](px)?/)) {
                parsedTW += parseTokens(statements[statement].split(":")) + (statement < statements.length - 1 ? " " : "");
                continue;
            }
            for (var CSSRule_1 in CSSTOTailwindMap)
                if (statements[statement].trim() == CSSRule_1)
                    parsedTW += CSSTOTailwindMap[CSSRule_1] + (statement < statements.length - 1 ? " " : "");
        }
        parsedTW = parsedTW.trim() + "\"";
        term.yellow("\n\n(CSS): class=" + parsedTW);
        term.blue("\n\n(ReactJS): className=" + parsedTW + "\n\n");
        continue;
    }
    // if(command?.trim().match(/margin-top: .*/)){
    //     const statement = command.split(':');
    //     console.log(parseTokens(statement));
    // }
    if (command.trim() == "exit")
        break;
    // for(const CSSRule in CSSTOTailwindMap)
    //     if(command?.trim() == CSSRule)
    //         console.log(CSSTOTailwindMap[CSSRule])
}
