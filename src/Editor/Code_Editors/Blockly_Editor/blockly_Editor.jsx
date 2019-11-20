import React from "react";

import Blockly from "blockly";

//blockly rederer
import ReactBlocklyComponent from "react-blockly";
import parseWorkspaceXml from "react-blockly/src/BlocklyHelper";

export default class BlocklyEditor extends React.Component {
  constructor(props) {
    super(props);
    //ID KEY
    this.IDkey = props.IDkey;

    //
    this.init = this.initializationFileToData(props.name);
    this.blockData = this.getBlocksDataFromInitializationData(this.init);
    this.toolboxCategories = makeToolboxCategories(this.blockData); //toolblox categories for reinitialization
    this.Initial_xml = this.getEditorData(this.IDkey);
    this.generator = new Blockly.Generator(props.name);
    this.state = {
      documentName: props.documentName,
      code: "",
      savedData: "",
      toolbox: genarateToolboxFromCategories(this.toolboxCategories)
    };
    this.makeBlocksByCategory(this.init, this.blockData);
  }

  //workspace updated
  workspaceDidChange = workspace => {
    this.setState({
      code: this.generator.workspaceToCode(workspace),
      savedData: Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(workspace))
    });
    this.saveEditorData();
    console.log(
      "code : \n" + this.state.code + "\nsave data : " + this.state.savedData
    );
  };

  saveEditorData = () => {
    localStorage.setItem(
      this.state.documentName,
      JSON.stringify({ saveData: this.state.savedData, code: this.state.code })
    );
  };
  getEditorData = Key => {
    return JSON.parse(localStorage.getItem(Key)).saveData;
  };

  //render
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
        initialXml={this.Initial_xml}
        wrapperDivClassName="fill-height"
        workspaceDidChange={this.workspaceDidChange}
      ></ReactBlocklyComponent.BlocklyEditor>
    );
  }

  //data initialization
  initializationFileToData = name => {
    return require("./blockly_files_editors/" + name + "/init.json");
  };

  getBlocksDataFromInitializationData = init => {
    return require("./blockly_files_editors/" +
      init.name +
      "/" +
      init.dataDir +
      "/blockDatabase.json");
  };

  makeBlocksByCategory = (
    init,
    blocks = this.getBlocksDataFromInitializationData(init)
  ) => {
    let BlockMakers = {};
    let BlockCodeMakers = {};

    init.blocksDir.forEach(category => {
      const makeBlock = require("./blockly_files_editors/" +
        init.name +
        "/" +
        category +
        "/block_gen.js").default;
      BlockMakers[category] = makeBlock;
    });

    init.blocksDir.forEach(category => {
      const makeBlockCode = require("./blockly_files_editors/" +
        init.name +
        "/" +
        category +
        "/" +
        "code_gen.js").default;
      BlockCodeMakers[category] = makeBlockCode;
    });

    blocks.forEach(block => {
      let makeBlock = () => {};
      makeBlock = BlockMakers[block.type];
      registerBlock(makeBlock(block));
    });

    blocks.forEach(block => {
      let makeBlockCode = () => {};
      makeBlockCode = BlockCodeMakers[block.type];
      this.registerBlockCodeFromData(makeBlockCode(block));
    });
  };

  registerBlockCodeFromData = blockData => {
    this.generator[blockData.name] = block => {
      let resultCode = blockData.blockText;
      blockData.statement_inputs.forEach(statement => {
        resultCode = replace(
          resultCode,
          "%" + statement + "%",
          this.generator.statementToCode(block, statement) || ""
        );
      });
      blockData.value_inputs.forEach(value => {
        resultCode = replace(
          resultCode,
          "%" + value + "%",
          this.generator.valueToCode(block, value, 1) || ""
        );
      });
      blockData.field_values.forEach(value => {
        resultCode = replace(
          resultCode,
          "%" + value + "%",
          block.getFieldValue(value)
        );
      });
      return resultCode;
    };
  };
}

const registerBlock = block => {
  Blockly.Blocks[block.type] = {
    init: function() {
      this.jsonInit(block);
    }
  };
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
