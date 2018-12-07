"use strict";
// Written Docs for this tutorial step can be found here:
// https://github.com/SAP/chevrotain/blob/master/docs/tutorial/step3b_adding_actions_embedded.md

// Tutorial Step 3:

// Adding a actions(semantics) embedded in the grammar.
// This is the highest performance approach, but its also verbose and none modular
// Therefore using the CST Visitor is the recommended approach:
// https://github.com/SAP/chevrotain/blob/master/docs/tutorial/src/step3a_actions_visitor.js

const jsonLexer = require("../step1_lexing/lexer");
const Parser = require("chevrotain").Parser;
const tokenVocabulary = jsonLexer.tokenVocabulary;

// individual imports, prefer ES6 imports if supported in your runtime/transpiler...
const True = tokenVocabulary.True;
const False = tokenVocabulary.False;
const Null = tokenVocabulary.Null;
const LCurly = tokenVocabulary.LCurly;
const RCurly = tokenVocabulary.RCurly;
const LSquare = tokenVocabulary.LSquare;
const RSquare = tokenVocabulary.RSquare;
const Comma = tokenVocabulary.Comma;
const Colon = tokenVocabulary.Colon;
const StringLiteral = tokenVocabulary.StringLiteral;
const NumberLiteral = tokenVocabulary.NumberLiteral;

// ----------------- parser -----------------
class JsonParserEmbedded extends Parser {
  constructor() {
    super(tokenVocabulary, { recoveryEnabled: true, outputCst: false });

    const $ = this;

    $.RULE("json", () =>
      $.OR([
        { ALT: () => $.SUBRULE($.object) },
        { ALT: () => $.SUBRULE($.array) }
      ])
    );

    $.RULE("object", () => {
      // uncomment the debugger statement and open dev tools in chrome/firefox
      // to debug the parsing flow.
      // debugger;
      const obj = {};

      $.CONSUME(LCurly);
      $.MANY_SEP({
        SEP: Comma,
        DEF: () => {
          _.assign(obj, $.SUBRULE($.objectItem));
        }
      });
      $.CONSUME(RCurly);

      return obj;
    });

    $.RULE("objectItem", () => {
      let lit, key, value;
      const obj = {};

      lit = $.CONSUME(StringLiteral);
      $.CONSUME(Colon);
      value = $.SUBRULE($.value);

      // an empty json key is not valid, use "BAD_KEY" instead
      key = lit.isInsertedInRecovery
        ? "BAD_KEY"
        : lit.image.substr(1, lit.image.length - 2);
      obj[key] = value;
      return obj;
    });

    $.RULE("array", () => {
      const arr = [];
      $.CONSUME(LSquare);
      $.MANY_SEP({
        SEP: Comma,
        DEF: () => {
          arr.push($.SUBRULE($.value));
        }
      });
      $.CONSUME(RSquare);

      return arr;
    });
    $.RULE("value", () =>
      $.OR([
        {
          ALT: () => {
            const stringLiteral = $.CONSUME(StringLiteral).image;
            // chop of the quotation marks
            return stringLiteral.substr(1, stringLiteral.length - 2);
          }
        },
        { ALT: () => Number($.CONSUME(NumberLiteral).image) },
        { ALT: () => $.SUBRULE($.object) },
        { ALT: () => $.SUBRULE($.array) },
        {
          ALT: () => {
            $.CONSUME(True);
            return true;
          }
        },
        {
          ALT: () => {
            $.CONSUME(False);
            return false;
          }
        },
        {
          ALT: () => {
            $.CONSUME(Null);
            return null;
          }
        }
      ])
    );

    // very important to call this after all the rules have been setup.
    // otherwise the parser may not work correctly as it will lack information
    // derived from the self analysis.
    this.performSelfAnalysis();
  }
}

// We only ever need one as the parser internal state is reset for each new input.
const parserInstance = new JsonParserEmbedded();

module.exports = {
  toAst: function(inputText) {
    const lexResult = jsonLexer.lex(inputText);

    // ".input" is a setter which will reset the parser's internal's state.
    parserInstance.input = lexResult.tokens;

    // No semantic actions so this won't return anything yet.
    const ast = parserInstance.json();

    if (parserInstance.errors.length > 0) {
      throw Error(
        "Sad sad panda, parsing errors detected!\n" +
          parserInstance.errors[0].message
      );
    }

    return ast;
  }
};
