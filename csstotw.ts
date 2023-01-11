const reader = require("prompt-sync")();
const term = require("terminal-kit").terminal;

class Tools {
  transformToRem(value: number): number {
    return value / 16;
  }
}

const units = {
  px: "px",
  rem: "rem",
};

const justify = {
  "flex-start": "start",
  "flex-end": "end",
  "center": "center",
  "space-between": "between",
  "space-around": "around",
  "space-evenly": "evenly",
};

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
  "height": "h-",
  "width": "w-",
};

const flexbox = {
  "column": "flex-col",
  "row": "flex-row"
}

function parseTokens(tokens: string[]): string {
  let tokensArr: string[] = tokens;

  for (let token = 0; token < tokensArr.length; token++) {
    if(tokensArr[token] == "flex-direction"){
      tokensArr[token] = "";
      tokensArr[token + 1] = flexbox[tokensArr[token + 1].trim()]
      continue;
    }

    if (CSSTOTailwindMap[tokensArr[token].trim()]) {
      tokensArr[token] = CSSTOTailwindMap[tokensArr[token].trim()];
      continue;
    }

    if (tokensArr[token].trim().includes(units.px)) {
      const utils = new Tools();

      tokensArr[token] = tokensArr[token].replace(units.px, "");
      tokensArr[token] = `[${utils.transformToRem(Number(tokensArr[token]))}${
        units.rem
      }]`;
      continue;
    }

    if (tokensArr[token].trim() == "justify-content") {
      tokensArr[token] = CSSTOTailwindMap["justify-content"];
      tokensArr[token + 1] = justify[tokensArr[token + 1].trim()];
      break;
    }

    if (!CSSTOTailwindMap[tokensArr[token].trim()]) {
      if (Number(tokensArr[token]))
        tokensArr[token] = `[${tokensArr[token].trim()}]`;
      continue;
      //if(isNaN(Number(tokensArr[token]))) tokensArr[token] = `"${tokensArr[token]}"`;
    }
  }

  return tokensArr.join("").replace(" ", "");
}

function init() {
  console.clear();
  term.windowTitle("CSSToTW - criado por @AndrewNation");
  term.bold.red(
    "🦸️ 🤝️ 🍃️ CSSToTW - Conversor de declarações CSS para classes Tailwind 🌬️ 🛠️ ⚙️\n\n"
  );
  term.bold.red("📚️ COMO USAR?\n");
  term.blue(
    "Insira uma declaração CSS (por exemplo: 'margin-top: 16px;') para obter seu equivalente em classes Tailwind. "
  );
  term.blue(
    "Por favor reportar bugs abrindo um issue no repositório do projeto.\n\n"
  );
}

init();

while (true) {
  const command = reader("CSStoTW: ");

  if (command.includes(";")) {
    const statements: string[] = command.split(";");
    let parsedTW: string;

    parsedTW = '"';

    for (let statement = 0; statement < statements.length; statement++) {
      if (statements[statement].match(/.*[A-Za-z\-]: .*[0-9A-Za-z\-](px)?/)) {
        parsedTW +=
          parseTokens(statements[statement].split(":")) +
          (statement < statements.length - 1 ? " " : "");
        continue;
      }

      for (const CSSRule in CSSTOTailwindMap)
        if (statements[statement].trim() == CSSRule)
          parsedTW +=
            CSSTOTailwindMap[CSSRule] +
            (statement < statements.length - 1 ? " " : "");
    }

    parsedTW = parsedTW.trim() + '"';

    term.yellow("\n\n(CSS): class=" + parsedTW);
    term.blue("\n\n(ReactJS): className=" + parsedTW + "\n\n");
    continue;
  }

  if (command.trim() == "exit") break;
}
