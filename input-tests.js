"use strict";
exports.__esModule = true;
var simple_template = "\n{{ image | size = medium | url = https://blable.com/rootToImage.jpeg | title = Chat sur un canap\u00E9 | description = bobalba bla }}\n";
var template_with_content = "\n{{\n    text\n    | box = note\n    | background = warning\n    | Ici se trouve une note encadr\u00E9e dans une box jaune\n}}\n";
exports.template_in_plain = "\nJe suis du plain text et au milieu {{ text | j'ai un template }} \u00E0 d\u00E9tecter.\n";
exports.template_in_template = "\n{{ text | j'ai un template {{ text | a l'interieur de moi-m\u00EAme }} a montrer en hover }}\n";
exports.template_in_template_in_plain = "\nJe suis du plain text et au milieu {{ text | param=par | content=j'ai un template {{ text | param=p | a l'interieur de moi-m\u00EAme }} a montrer en hover }} \u00E0 d\u00E9tecter.\n";
exports.real_w_text = "\n{{\n    templateName\n    | param1 = je suis content\n    | param2 = align-left\n    ||\n    Bonjour voici le contenu des tmeplates avec un sub templare {{\n        inlinemaths\n        | color=blue\n        || formule compliqu\u00E9e\n    }} avec du display apr\u00E8s :\n    {{\n        image\n        | url=cinicrnicr\n        | title=image du contenu pour voir plus\n    }}\n}}\n";
