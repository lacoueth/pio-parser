const str = "{{template | param=cont | param2=cniei | content id here}}";

// var Promise = require('prfun');
var Parsoid = require("parsoid-jsapi");

/* var main = Promise.async(function*() {
	var text = "I love wikitext!";
	var pdoc = yield Parsoid.parse(text, { pdoc: true });
	console.log(pdoc.document.outerHTML);
});

// start me up!
main().done(); */

// import * as par from 'parsoid-jsapi';

async function test(input) {
    const res = await Parsoid.parse(input, {pdoc: true});
    // console.log(await res.toWikitext());

    const templates = await res.filterTemplates({ recursive: false });
    

    console.log(templates[0].name);
}

const text = `
{{
    templateName
    | param1=je suis content
    | param2=align-left
    |
    Bonjour voici le contenu des tmeplates avec un sub templare {{
        inlinemaths
        | color=blue
        | formule compliquée
    }} avec du display après :
    {{
        image
        | url=cinicrnicr
        | title=image du contenu pour voir plus
    }}
}}
`;

test(text);
