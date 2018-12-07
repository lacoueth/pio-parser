const toAstEmbedded = require("./embed").toAst;

/* const real_w_quotes = require("../../input-tests").real_w_text_w_quotes;
let inputText = real_w_quotes;

let astFromEmbedded = toAstEmbedded(inputText);

console.log(JSON.stringify(astFromEmbedded, null, "  ")); */

export function Parse(input) {
  return toAstEmbedded(input);
}
