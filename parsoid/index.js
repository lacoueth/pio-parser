const str = "{{template | param=cont | param2=cniei | content id here}}";

// var Promise = require('prfun');
var Parsoid = require("parsoid-jsapi");

const real_w_text = require('../input-tests').real_w_text;
const template_in_plain = require('../input-tests').template_in_plain;
const template_in_template = require('../input-tests').template_in_template;
const template_in_template_in_plain = require('../input-tests').template_in_template_in_plain;
// import { real_w_text } from '../input-tests';

/* var main = Promise.async(function*() {
	var text = "I love wikitext!";
	var pdoc = yield Parsoid.parse(text, { pdoc: true });
	console.log(pdoc.document.outerHTML);
});

// start me up!
main().done(); */

// import * as par from 'parsoid-jsapi';

async function test(input) {
    const res = await Parsoid.parse(input, { pdoc: true });
    // console.log(await res.toWikitext());

    const templates = await res.filterTemplates({ recursive: false });

    const template = templates[0];

    for (const temp of templates) {
        console.log(await temp.toWikitext())
        console.log(await parseTemplate(temp));
    }
}

async function getTree(input) {
    const res = await Parsoid.parse(input);
    return res.get_tree();
}

async function parseTemplate(template) {
    const result = { name: template.name, params: {} };

    const params = await Promise.all(
        template.params.map(async e => {
            return { name: e.name, value: e.value };
        })
    );

    for (const param of params) {
        if (param.name != 1 && param.name !== 'content') {
            result.params[param.name] = await param.value.toWikitext();
        } else {
            const content = param.value.filterTemplates({ recursive: false });
            const text = param.value.filterText();
            console.log(await Promise.all(
                text.map(async e => await e.value)
            ));

            if (content.length) {
                // result.content = parseTemplate(content);
                result.content = await Promise.all(
                    content.map(async e => await parseTemplate(e))
                );
            } else {
                result.content = await param.value.toWikitext();

            }
            // console.log(await content.toWikitext());
        }
    }

    return result;
}

let text = "{{foo|bar={{baz|ibni  {{spam }}}}}}";

console.log(getTree(text));

function preProcess(txt) {
    return txt
        .replace(/\n/g, '')
        .replace(/\t/g, '')
        .replace(/\|\|/g, '|content=')
        .replace(/(\s)*\|(\s)*/g, '|')
        .replace(/(\s)*\{\{(\s)*/g, ' {{')
        .replace(/(\s)*\}\}/g, '}} ');
}

// test(preProcess(real_w_text));

// test(text);
// console.log(real_w_text);
