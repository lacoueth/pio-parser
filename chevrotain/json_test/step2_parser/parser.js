"use strict";
// Written Docs for this tutorial step can be found here:
// https://github.com/SAP/chevrotain/blob/master/docs/tutorial/step2_parsing.md

// Tutorial Step 2:

// Adding a Parser (grammar only, only reads the input without any actions).
// Using the Token Vocabulary defined in the previous step.

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
class JsonParser extends Parser {
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

      $.CONSUME(LCurly);
      $.MANY_SEP({
        SEP: Comma,
        DEF: () => {
          $.SUBRULE($.objectItem);
        }
      });
      $.CONSUME(RCurly);
    });

    $.RULE("objectItem", () => {
      $.CONSUME(StringLiteral);
      $.CONSUME(Colon);
      $.SUBRULE($.value);
    });

    $.RULE("array", () => {
      $.CONSUME(LSquare);
      $.MANY_SEP({
        SEP: Comma,
        DEF: () => {
          $.SUBRULE($.value);
        }
      });
      $.CONSUME(RSquare);
    });

    $.RULE("value", () =>
      $.OR([
        {
          ALT: () => {
            $.CONSUME(StringLiteral);
          }
        },
        { ALT: () => $.CONSUME(NumberLiteral) },
        { ALT: () => $.SUBRULE($.object) },
        { ALT: () => $.SUBRULE($.array) },
        {
          ALT: () => {
            $.CONSUME(True);
          }
        },
        {
          ALT: () => {
            $.CONSUME(False);
          }
        },
        {
          ALT: () => {
            $.CONSUME(Null);
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
const parserInstance = new JsonParser();

module.exports = {
  parserInstance: parserInstance,

  JsonParser: JsonParser,

  parse: function(inputText) {
    const lexResult = jsonLexer.lex(inputText);

    // ".input" is a setter which will reset the parser's internal's state.
    parserInstance.input = lexResult.tokens;

    // No semantic actions so this won't return anything yet.
    parserInstance.json();

    if (parserInstance.errors.length > 0) {
      throw Error(
        "Sad sad panda, parsing errors detected!\n" +
          parserInstance.errors[0].message
      );
    }
  }
};
