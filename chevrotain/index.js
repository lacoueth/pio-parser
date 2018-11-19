"use strict";
exports.__esModule = true;
function render(block) {
    if (block.type === 'plain') {
        var res = '\n<Markdown>\n';
        res += block.value;
        res += '\n</Markdown>\n';
        return res;
    }
    else {
        var templateName = block.value.template;
        var params_1 = block.value.params;
        var content = block.value.content;
        var res_1 = "\n<" + templateName;
        Object.keys(params_1).forEach(function (key) {
            res_1 += " " + key + "=\"" + params_1[key] + "\"";
        });
        res_1 += '>\n';
        content.forEach(function (block) {
            res_1 += render(block);
        });
        res_1 += "\n</" + templateName + ">\n";
        return res_1;
    }
}
function ast2ml(ast) {
    var result = '';
    var blockArray = ast.ast;
    blockArray.forEach(function (block) {
        result += render(block);
    });
    return result;
}
var test = [
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
