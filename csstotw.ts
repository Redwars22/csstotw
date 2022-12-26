const reader = require('prompt-sync')();

class Tools {
    transformToRem(value: number): number {
        return value/16;
    }
}

const units = {
    px: "px",
    rem: "rem"
}

const CSSTOTailwindMap = {
    "display: flex": "flex",
    "margin-top": "mt-",
    "width: 100%": "w-full",
}

function parseTokens(tokens: string[]): string {
    let tokensArr: string[] = tokens;

    for(let token = 0; token < tokensArr.length; token++){
        if(CSSTOTailwindMap[tokensArr[token]]){
            tokensArr[token] = CSSTOTailwindMap[tokensArr[token]];
        }

        if(tokensArr[token].includes(units.px)){
            const utils = new Tools();

            tokensArr[token] = tokensArr[token].replace(units.px, "");
            tokensArr[token] = `[${utils.transformToRem(Number(tokensArr[token]))}${units.rem}]`;
        }
    }

    return tokensArr.join("");
}

while(true){
    const command = reader("CSStoTW: ");

    if(command.includes(';')){
        const statements: string[] = command.split(';');
        let parsedTW : string;

        parsedTW = "\"";

        for(let statement = 0; statement < statements.length; statement++){
            if(statements[statement].match(/margin-top: .*/)){        
                parsedTW += parseTokens(statements[statement].split(":"));
                continue;
            }

            for(const CSSRule in CSSTOTailwindMap)
                if(statements[statement].trim() == CSSRule)
                    parsedTW += CSSTOTailwindMap[CSSRule] + " ";
        }  

        parsedTW += "\"";

        console.log(parsedTW);
        continue;
    }

    if(command?.trim().match(/margin-top: .*/)){
        const statement = command.split(':');

        console.log(parseTokens(statement));
    }

    if(command.trim() == "exit")
        break;

    for(const CSSRule in CSSTOTailwindMap)
        if(command?.trim() == CSSRule)
            console.log(CSSTOTailwindMap[CSSRule])
}
