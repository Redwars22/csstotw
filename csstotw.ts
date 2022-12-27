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

const justify = {
    "flex-start": "start",
    "flex-end": "end",
    "center": "center",
    "space-between": "between",
    "space-around": "around",
    "space-evenly": "evenly",
}

const CSSTOTailwindMap = {
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
    "justify-content": "justify-",
}

function parseTokens(tokens: string[]): string {
    let tokensArr: string[] = tokens;

    for(let token = 0; token < tokensArr.length; token++){
        if(CSSTOTailwindMap[tokensArr[token].trim()]){
            tokensArr[token] = CSSTOTailwindMap[tokensArr[token].trim()];
            continue;
        }

        if(tokensArr[token].trim().includes(units.px)){
            const utils = new Tools();

            tokensArr[token] = tokensArr[token].replace(units.px, "");
            tokensArr[token] = `[${utils.transformToRem(Number(tokensArr[token]))}${units.rem}]`;
            continue;
        }

        if(tokensArr[token].trim() == "justify-content"){
            tokensArr[token] = CSSTOTailwindMap["justify-content"];
            tokensArr[token + 1] = justify[tokensArr[token + 1].trim()];
            break;
        }
        
        if(!CSSTOTailwindMap[tokensArr[token].trim()]) {
            if(Number(tokensArr[token])) tokensArr[token] = `[${tokensArr[token].trim()}]`;
            continue;
            //if(isNaN(Number(tokensArr[token]))) tokensArr[token] = `"${tokensArr[token]}"`;
        }
    }

    return tokensArr.join("").replace(' ', '');
}

while(true){
    const command = reader("CSStoTW: ");

    if(command.includes(';')){
        const statements: string[] = command.split(';');
        let parsedTW : string;

        parsedTW = "\"";

        for(let statement = 0; statement < statements.length; statement++){
            if(statements[statement].match(/.*[A-Za-z\-]: .*[0-9A-Za-z\-](px)?/)){        
                parsedTW += parseTokens(statements[statement].split(":")) + (statement < statements.length - 1 ? " " : "");
                continue;
            }

            for(const CSSRule in CSSTOTailwindMap)
                if(statements[statement].trim() == CSSRule)
                    parsedTW += CSSTOTailwindMap[CSSRule] + (statement < statements.length - 1 ? " " : "");
        }  

        parsedTW += "\"";

        console.log("class=" + parsedTW);
        console.log("className=" + parsedTW);
        continue;
    }
    // if(command?.trim().match(/margin-top: .*/)){
    //     const statement = command.split(':');

    //     console.log(parseTokens(statement));
    // }

    // if(command.trim() == "exit")
    //     break;

    // for(const CSSRule in CSSTOTailwindMap)
    //     if(command?.trim() == CSSRule)
    //         console.log(CSSTOTailwindMap[CSSRule])
}