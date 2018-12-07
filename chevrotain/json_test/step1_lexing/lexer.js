"use strict";
// Written Docs for this tutorial step can be found here:
// https://github.com/SAP/chevrotain/blob/master/docs/tutorial/step1_lexing.md

// Tutorial Step 1:
// Implementation of A lexer for a simple SELECT statement grammar
const chevrotain = require("chevrotain");
const Lexer = chevrotain.Lexer;
const createToken = chevrotain.createToken;

// the vocabulary will be exported and used in the Parser definition.
const tokenVocabulary = {};

// createToken is used to create a TokenType
// The Lexer's output will contain an array of token Objects created by metadata

// In ES6, custom inheritance implementation
// (such as the one above) can be replaced
// with a more simple: "class X extends Y"...
const True = createToken({ name: "True", pattern: /true/ });
const False = createToken({ name: "False", pattern: /false/ });
const Null = createToken({ name: "Null", pattern: /null/ });
const LCurly = createToken({ name: "LCurly", pattern: /{/ });
const RCurly = createToken({ name: "RCurly", pattern: /}/ });
const LSquare = createToken({ name: "LSquare", pattern: /\[/ });
const RSquare = createToken({ name: "RSquare", pattern: /]/ });
const Comma = createToken({ name: "Comma", pattern: /,/ });
const Colon = createToken({ name: "Colon", pattern: /:/ });
const StringLiteral = createToken({
  name: "StringLiteral",
  pattern: /"(:?[^\\"\n\r]+|\\(:?[bfnrtv"\\/]|u[0-9a-fA-F]{4}))*"/
});
const NumberLiteral = createToken({
  name: "NumberLiteral",
  pattern: /-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?/
});
const WhiteSpace = createToken({
  name: "WhiteSpace",
  pattern: /\s+/,
  group: Lexer.SKIPPED
});

// The order of tokens is important
const jsonTokens = [
  WhiteSpace,
  NumberLiteral,
  StringLiteral,
  RCurly,
  LCurly,
  LSquare,
  RSquare,
  Comma,
  Colon,
  True,
  False,
  Null
];

const JsonLexer = new Lexer(jsonTokens);

jsonTokens.forEach(tokenType => {
  tokenVocabulary[tokenType.name] = tokenType;
});

module.exports = {
  tokenVocabulary: tokenVocabulary,

  lex: function(inputText) {
    const lexingResult = JsonLexer.tokenize(inputText);

    if (lexingResult.errors.length > 0) {
      throw Error("Sad Sad Panda, lexing errors detected");
    }

    return lexingResult;
  }
};
