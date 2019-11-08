import React from "react"; //+

import Blockly from "blockly"; //+

//blockly rederer=
import ReactBlocklyComponent from "react-blockly";
import parseWorkspaceXml from "react-blockly/src/BlocklyHelper";

//block gen
import { makeTagBlock } from "../html_editor/blockly_html/tags/tag_block_gen";
import { FakeAtt as makeAttBlock } from "../html_editor/blockly_html/attributes/attribute_block_gen";

//code gen

export default class BlocklyEditor extends React.Component {
  constructor(props) {
    super(props);

    this.toolboxCategories = makeToolboxCategories(props.data);
    this.state = {
      generator: this.dataToEditor(props.data, props.name),
      toolbox: genarateToolboxFromCategories(this.toolboxCategories),
      Initial_xml: props.INITIAL_XML
    };
    this.dataToBlocks(props.data);
  }
  dataToEditor = (data, EditorName) => {
    const Generator = new Blockly.Generator(EditorName);
    return Generator;
  };
  dataToBlocks = data => {
    data.forEach(block => {
      makeBlock(makeBlockByCategory(block));
    });
  };
  workspaceDidChange = workspace => {
    const newXml = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(workspace));
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

const makeBlock = block => {
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
          if (category.name == tag) {
            // check for match
            categoryFound = true; //let know that a match was found
            category.elements.push(element.name); //add the match to the categories array
          }
        });
        if (categoryFound == false) {
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
