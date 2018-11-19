import { AST, Block, Template } from "./models/ast.model";

// import * as _ from 'lodash';

function render(block: Block): string {
    if (block.type === 'plain') {
        let res = '\n<Markdown>\n';
        res += block.value;
        res += '\n</Markdown>\n';
        return res;
    } else {
        const templateName = (block.value as Template).template;
        const params = (block.value as Template).params;
        const content = (block.value as Template).content;

        let res = `\n<${templateName}`;
        Object.keys(params).forEach(key => {
            res += ` ${key}="${params[key]}"`;
        });
        res += '>\n';

        content.forEach(block => {
            res += render(block);
        });

        res += `\n</${templateName}>\n`;
        return res;
    }
}

function ast2ml(ast: AST): string {
    let result = '';

    const blockArray = ast.ast;

    blockArray.forEach(block => {
        result += render(block);
    });

    return result;
}

const test: Block[] = [
    {
        "type": "plain",
        "value": "\n# Un titre h1\n\nOn *commence* avec du plain texte\n\nUne liste :\n- un\n- deux\n\n"
    },
    {
        "type": "template",
        "value": {
            "template": "templateName",
            "params": {
                "param1": "je suis content",
                "param2": "align-left"
            },
            "content": [
                {
                    "type": "plain",
                    "value": "Bonjour voici le contenu des tmeplates avec un sub templare"
                },
                {
                    "type": "template",
                    "value": {
                        "template": "inlinemaths",
                        "params": {
                            "color": "blue"
                        },
                        "content": [
                            {
                                "type": "plain",
                                "value": "formule compliquée"
                            }
                        ]
                    }
                },
                {
                    "type": "plain",
                    "value": "avec du display après :"
                },
                {
                    "type": "template",
                    "value": {
                        "template": "image",
                        "params": {
                            "url": "cinicrnicr"
                        },
                        "content": [
                            {
                                "type": "plain",
                                "value": "image du contenu pour voir plus"
                            }
                        ]
                    }
                }
            ]
        }
    },
    {
        "type": "plain",
        "value": "\nPuis du texte encore pour continuer\n"
    }
];

console.log(ast2ml({ ast: test }));