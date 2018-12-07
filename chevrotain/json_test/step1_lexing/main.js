const lex = require("./lexer").lex;

const inputText = `
{
	"firstName": "John",
	"lastName": "Smith",
	"isAlive": true,
	"age": 25
}`;

const lexingResult = lex(inputText);
console.log(JSON.stringify(lexingResult, null, "\t"));
