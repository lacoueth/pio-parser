const parse = require("./parser").parse;

const inputText = `
{
	"firstName": "John",
	"lastName": "Smith",
	"isAlive": true,
	"age": 25
}`;
// step into the parse function to debug the full flow
parse(inputText);

// no output here so nothing to show...
