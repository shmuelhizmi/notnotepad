import React from "react";

import Blockly from "blockly";

//blockly rederer=
import ReactBlocklyComponent from "react-blockly";
import parseWorkspaceXml from "react-blockly/src/BlocklyHelper";

//block gen
import { makeTagBlock } from "../html_editor/blockly_html/tags/tag_block_gen";
import { FakeAtt as makeAttBlock } from "../html_editor/blockly_html/attributes/attribute_block_gen";

//code gen
import { makeTagBlockCode } from "../html_editor/blockly_html/tags/tag_code_gen";

export default class BlocklyEditor extends React.Component {
  constructor(props) {
    super(props);
    this.toolboxCategories = makeToolboxCategories(props.data); //toolblox categories for reinitialization
    this.state = {
      toolbox: genarateToolboxFromCategories(this.toolboxCategories),
      Initial_xml: props.INITIAL_XML
    };
    this.generator = new Blockly.Generator(props.name);
    this.registerBlocksFromData(props.data); //build blocks from data
    this.registerBlocksCodeFromData(props.data);
  }

  registerBlocksFromData = data => {
    data.forEach(block => {
      registerBlock(makeBlockByCategory(block));
    });
  };

  registerBlocksCodeFromData = data => {
    //make code genarator from data
    data.forEach(blockData => {
      this.generator[blockData.name] = block => {
        const preConstractBlock = makeBlockCodeByCategory(block, blockData);
        let resultCode = preConstractBlock.blockText;
        preConstractBlock.statement_inputs.forEach(statement => {
          resultCode = replace(
            resultCode,
            "%" + statement + "%",
            this.generator.statementToCode(block, statement) || ""
          );
        });
        preConstractBlock.value_inputs.forEach(vlaue => {
          resultCode = replace(
            resultCode,
            "%" + vlaue + "%",
            this.generator.valueToCode(block, vlaue, 1) || ""
          );
        });
        return resultCode;
      };
    });
  };

  workspaceDidChange = workspace => {
    const newXml = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(workspace));
    const code = this.generator.workspaceToCode(workspace);
    console.log("code : " + code + "\nsave data : " + newXml);
  };

  render() {
    return (
      <ReactBlocklyComponent.BlocklyEditor
        toolboxCategories={parseWorkspaceXml(this.state.toolbox)}
        workspaceConfiguration={{
          grid: {
            spacing: 20,
            length: 3,
            colour: "#ccc",
            snap: true
          }
        }}
        initialXml={this.state.Initial_xml}
        wrapperDivClassName="fill-height"
        workspaceDidChange={this.workspaceDidChange}
      ></ReactBlocklyComponent.BlocklyEditor>
    );
  }
}

const registerBlock = block => {
  Blockly.Blocks[block.type] = {
    init: function() {
      this.jsonInit(block);
    }
  };
};

const makeBlockByCategory = block => {
  switch (block.type) {
    case "tag": {
      return makeTagBlock(block);
    }
    case "attribute": {
      return makeAttBlock(block);
    }
    case "text": {
      return makeAttBlock(block);
    }
  }
};

const makeBlockCodeByCategory = (block, blockData) => {
  switch (blockData.type) {
    case "tag": {
      return makeTagBlockCode(block, blockData);
    }
    case "attribute": {
      return " ";
    }
    case "text": {
      return " ";
    }
  }
};

//TOOLBOX
const makeToolboxCategories = (data, categories = []) => {
  let categoriesArray = categories;
  data.forEach(element => {
    if (element.tags != null) {
      //check for tags
      element.tags.forEach(tag => {
        //if tags found go over each tag
        let categoryFound = false;
        categoriesArray.forEach(category => {
          //and go over every category to...
          if (category.name === tag) {
            // check for match
            categoryFound = true; //let know that a match was found
            category.elements.push(element.name); //add the match to the categories array
          }
        });
        if (categoryFound === false) {
          //if no match was found create a new category with the tag
          categoriesArray.push({
            name: tag,
            elements: [element.name]
          });
        }
      });
    }
  });
  return categoriesArray;
};

const genarateToolboxFromCategories = categories => {
  let results = `<xml xmlns="http://www.w3.org/1999/xhtml" id="toolbox" style="display: none;">\n`;
  categories.forEach(category => {
    results += ` <category name="${category.name}" >\n`;
    category.elements.forEach(element => {
      results += `    <block type="${element}" ></block>\n`;
    });
    results += ` </category>\n`;
  });
  results += `</xml>`;
  return results;
};

const replace = (str, oldS, newS) => {
  return str.replace(oldS, newS);
};
