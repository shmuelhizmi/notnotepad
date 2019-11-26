import React from "react";

import Blockly from "blockly";

//blockly rederer
import ReactBlocklyComponent from "react-blockly";
import parseWorkspaceXml from "react-blockly/src/BlocklyHelper";
import CodeEditor from "../../CodeEditor";

export default class BlocklyEditor extends CodeEditor {
  constructor(props) {
    super(props);
    this.init = this.initializationFileToData(props.name);
    this.blockData = this.getBlocksDataFromInitializationData(this.init);
    this.toolboxCategories = makeToolboxCategories(this.blockData); //toolblox categories for reinitialization
    this.generator = new Blockly.Generator(props.name);
    this.generator.ORDER_ATOMIC = 0;
    this.generator.ORDER_NONE = 0;
    this.toolbox = genarateToolboxFromCategories(this.toolboxCategories);
    this.Initial_xml = this.getEditorData().saveData;
    this.makeBlocksByCategory(this.init, this.blockData);
    this.initializeHotkeys();
    this.theme = this.getThemeFromInitializationData();
    this.theme.setComponentStyle("toolbox", "#293742");
    this.lastWorkspace = null;
    this.theme.setComponentStyle("workspace", "#293742");
    //this.theme.setComponentStyle("flyoutOpacity", "0");
  }
  componentDidMount = () => {
    this.loop();
  };
  loop = async () => {
    if (this.lastWorkspace) {
      Blockly.svgResize(this.lastWorkspace);
    }

    setTimeout(() => {
      this.loop();
    }, 200);
  };
  //workspace updated
  workspaceDidChange = workspace => {
    this.lastWorkspace = workspace;
    if (this.state.newDocument) {
      Blockly.Xml.textToDom(this.state.saveData);
    }
    this.setState({
      code: this.generator.workspaceToCode(workspace),
      saveData: Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(workspace))
    });
    this.saveEditorData();
  };

  //render
  render() {
    return (
      <div>
        <ReactBlocklyComponent.BlocklyEditor
          toolboxCategories={parseWorkspaceXml(this.toolbox)}
          workspaceConfiguration={{
            theme: this.theme
          }}
          initialXml={this.Initial_xml}
          wrapperDivClassName="fill-height"
          workspaceDidChange={this.workspaceDidChange}
        ></ReactBlocklyComponent.BlocklyEditor>
      </div>
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
  getThemeFromInitializationData = () => {
    const theme = require("./blockly_files_editors/" +
      this.init.name +
      "/" +
      this.init.dataDir +
      "/theme.json");
    return new Blockly.Theme(theme.blocks, theme.categories);
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
      let makeBlock = () => {}; //empty void
      makeBlock = BlockMakers[block.type]; //load function
      registerBlock(makeBlock(block));
    });

    blocks.forEach(block => {
      let makeBlockCode = () => {}; //empty void
      makeBlockCode = BlockCodeMakers[block.type]; //load function
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
      if (blockData.nextStatement.exist) {
        const nextBlockCode = this.generator.blockToCode(block.getNextBlock());
        resultCode = replace(
          resultCode,
          "%" + blockData.nextStatement.str + "%",
          nextBlockCode != "" ? "\n" + nextBlockCode : ""
        );
      }
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
    results +=
      ' <category name="' +
      category.name +
      '" categorystyle="' +
      category.name +
      '" >\n';
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
