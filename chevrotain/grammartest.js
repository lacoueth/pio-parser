(function jsonExample() {
  // ----------------- Lexer -----------------
  const createToken = chevrotain.createToken;
  const Lexer = chevrotain.Lexer;

  // In ES6, custom inheritance implementation
  // (such as the one above) can be replaced
  // with a more simple: "class X extends Y"...
  const LCurly = createToken({ name: "LCurly", pattern: /{{/ });
  const RCurly = createToken({ name: "RCurly", pattern: /}}/ });
  const Comma = createToken({ name: "Comma", pattern: /\|/ });
  const Colon = createToken({ name: "Colon", pattern: /=/ });

  const StringLiteral = createToken({
    name: "StringLiteral",
    pattern: /"(:?[^\\"]+|\\(:?[bfnrtv"\\/]|u[0-9a-fA-F]{4}))*"/
  });

  const SimpleWord = createToken({
    name: "SimpleWord",
    pattern: /\w+/
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

  const jsonTokens = [
    WhiteSpace,
    NumberLiteral,
    StringLiteral,
    SimpleWord,
    RCurly,
    LCurly,
    Comma,
    Colon
  ];

  const JsonLexer = new Lexer(jsonTokens);

  // Labels only affect error messages and Diagrams.
  LCurly.LABEL = "'{{'";
  RCurly.LABEL = "'}}'";
  Comma.LABEL = "'|'";
  Colon.LABEL = "'='";

  // ----------------- parser -----------------
  const Parser = chevrotain.Parser;

  class JsonParser extends Parser {
    constructor() {
      super(jsonTokens, { recoveryEnabled: true, outputCst: false });

      const $ = this;

      $.RULE("plain", () => {
        let nodes = [];

        $.MANY({
          DEF: () =>
            $.OR([
              {
                ALT: () => {
                  const obj = $.SUBRULE($.template);
                  nodes.push({ type: "template", value: obj });
                }
              },
              {
                ALT: () => {
                  const stringLiteral = $.CONSUME(StringLiteral).image;
                  // chop of the quotation marks
                  const str = stringLiteral.substr(1, stringLiteral.length - 2);
                  nodes.push({ type: "plain", value: str });
                }
              }
            ])
        });

        return nodes;
      });

      $.RULE("template", () => {
        // uncomment the debugger statement and open dev tools in chrome/firefox
        // to debug the parsing flow.
        // debugger;
        const obj = {};

        $.CONSUME(LCurly);

        //let tempName = $.SUBRULE($.value);
        let tempName = $.CONSUME(SimpleWord).image;

        $.MANY({
          DEF: () => {
            $.CONSUME(Comma);
            _.assign(obj, $.SUBRULE($.templateParam));
          }
        });

        let content = $.SUBRULE($.templateContent);

        $.CONSUME(RCurly);

        return { template: tempName, params: obj, content: content };
      });

      $.RULE("templateContent", () => {
        $.CONSUME(Comma);
        let value = $.SUBRULE($.plain);
        return value;
      });

      $.RULE("templateParam", () => {
        let paramName = $.CONSUME(SimpleWord).image;
        $.CONSUME(Colon);
        let value = $.SUBRULE($.value);
        return { [paramName]: value };
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
          { ALT: () => $.SUBRULE($.template) }
        ])
      );

      // very important to call this after all the rules have been setup.
      // otherwise the parser may not work correctly as it will lack information
      // derived from the self analysis.
      this.performSelfAnalysis();
    }
  }

  // for the playground to work the returned object must contain these fields
  return {
    lexer: JsonLexer,
    parser: JsonParser,
    defaultRule: "plain"
  };
})();
