import Blockly from "blockly";

const htmlMetadataBlocks = [
  {
    type: "html",
    message0: "document %1 %2",
    args0: [
      {
        type: "input_dummy"
      },
      {
        type: "input_statement",
        name: "content",
        check: "document"
      }
    ],
    colour: 0,
    tooltip: "",
    helpUrl: "http://www.w3schools.com/tags/tag_html.asp"
  },
  {
    type: "head",
    message0: "head %1 %2",
    args0: [
      {
        type: "input_value",
        name: "parameters",
        check: "parameters"
      },
      {
        type: "input_statement",
        name: "head",
        align: "CENTRE"
      }
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: 20,
    tooltip: "",
    helpUrl: ""
  },
  {
    type: "body",
    message0: "body %1 %2",
    args0: [
      {
        type: "input_value",
        name: "parameters",
        check: "parameters"
      },
      {
        type: "input_statement",
        name: "body",
        align: "CENTRE"
      }
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: 20,
    tooltip: "",
    helpUrl: ""
  },
  {
    type: "text",
    message0: "text %1",
    args0: [
      {
        type: "field_input",
        name: "value",
        text: "default"
      }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 160,
    tooltip: "",
    helpUrl: ""
  }
];
const htmlBasicElementsBlocks = [
  {
    type: "h1",
    message0: "Heading level 1 %1 %2",
    args0: [
      {
        type: "input_value",
        name: "parameters",
        check: "parameters"
      },
      {
        type: "input_statement",
        name: "body",
        align: "CENTRE"
      }
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: 120,
    tooltip: "",
    helpUrl: ""
  },
  {
    type: "h2",
    message0: "Heading level 2 %1 %2",
    args0: [
      {
        type: "input_value",
        name: "parameters",
        check: "parameters"
      },
      {
        type: "input_statement",
        name: "body",
        align: "CENTRE"
      }
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: 120,
    tooltip: "",
    helpUrl: ""
  },
  {
    type: "h3",
    message0: "Heading level 3 %1 %2",
    args0: [
      {
        type: "input_value",
        name: "parameters",
        check: "parameters"
      },
      {
        type: "input_statement",
        name: "body",
        align: "CENTRE"
      }
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: 120,
    tooltip: "",
    helpUrl: ""
  },
  {
    type: "h4",
    message0: "Heading level 4 %1 %2",
    args0: [
      {
        type: "input_value",
        name: "parameters",
        check: "parameters"
      },
      {
        type: "input_statement",
        name: "body",
        align: "CENTRE"
      }
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: 120,
    tooltip: "",
    helpUrl: ""
  },
  {
    type: "h5",
    message0: "Heading level 5 %1 %2",
    args0: [
      {
        type: "input_value",
        name: "parameters",
        check: "parameters"
      },
      {
        type: "input_statement",
        name: "body",
        align: "CENTRE"
      }
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: 120,
    tooltip: "",
    helpUrl: ""
  },
  {
    type: "h6",
    message0: "Heading level 6 %1 %2",
    args0: [
      {
        type: "input_value",
        name: "parameters",
        check: "parameters"
      },
      {
        type: "input_statement",
        name: "body",
        align: "CENTRE"
      }
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: 120,
    tooltip: "",
    helpUrl: ""
  },
  {
    type: "p",
    message0: "paragraph %1 %2",
    args0: [
      {
        type: "input_value",
        name: "parameters",
        check: "parameters"
      },
      {
        type: "input_statement",
        name: "body",
        align: "CENTRE"
      }
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: 120,
    tooltip: "",
    helpUrl: ""
  },
  {
    type: "br",
    message0: "line breaker %1 %2",
    args0: [
      {
        type: "input_value",
        name: "parameters",
        check: "parameters"
      },
      {
        type: "input_statement",
        name: "body",
        align: "CENTRE"
      }
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: 120,
    tooltip: "",
    helpUrl: ""
  },
  {
    type: "hr",
    message0: "thematic break %1 %2",
    args0: [
      {
        type: "input_value",
        name: "parameters",
        check: "parameters"
      },
      {
        type: "input_statement",
        name: "body",
        align: "CENTRE"
      }
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: 120,
    tooltip: "",
    helpUrl: ""
  }
];
const htmlStylingElements = [
  {
    type: "div",
    message0: "section %1 %2",
    args0: [
      {
        type: "input_value",
        name: "parameters",
        check: "parameters"
      },
      {
        type: "input_statement",
        name: "body",
        align: "CENTRE"
      }
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: 120,
    tooltip: "",
    helpUrl: ""
  }
];
const makeBlock = json => {
  Blockly.Blocks[json.type] = {
    init: function() {
      this.jsonInit(json);
    }
  };
};
const makeBlocks = jsonArry => {
  for (let iBlock in jsonArry) {
    makeBlock(jsonArry[iBlock]);
  }
};

const registerBlocks = () => {
  makeBlocks(htmlMetadataBlocks);
  makeBlocks(htmlBasicElementsBlocks);
  makeBlocks(htmlStylingElements);
  console.log("html blocks registiration is done");
};
export default registerBlocks;
