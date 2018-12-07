// const assert = require("assert")
// const toAstVisitor = require("./step3a_actions_visitor").toAst
const toAstEmbedded = require("./embed").toAst;

const inputText = `
{
	"firstName": "John",
	"lastName": "Smith",
	"isAlive": true,
	"age": 25
}`;

let astFromEmbedded = toAstEmbedded(inputText);

// console.log(JSON.stringify(astFromEmbedded, null, "\t"));
