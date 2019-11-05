import Blockly from "blockly";

import {
  htmlMetadataBlocks,
  htmlBasicElementsBlocks,
  htmlStylingElements,
  htmlAttributes
} from "./html_blocks";
const HtmlGenerator = new Blockly.Generator("HTML");

HtmlGenerator.ORDER_ATOMIC = 0;
HtmlGenerator.ORDER_NONE = 0;

HtmlGenerator.init = workspace => {};
HtmlGenerator.finish = code => {
  return code;
};

HtmlGenerator.scrub_ = (block, code) => {
  var nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  var nextCode = HtmlGenerator.blockToCode(nextBlock);
  return code + nextCode;
};

const autoGenElement = (
  name,
  block,
  haveParameters = true,
  haveBody = true
) => {
  const value_body = HtmlGenerator.statementToCode(block, "input_body");
  const value_attributes = HtmlGenerator.statementToCode(
    block,
    "input_attributes"
  );

  let code = "<" + name;
  if (value_attributes != "" || value_attributes != null) {
    code += ` ${value_attributes}`;
    console.log(value_attributes);
  }
  code += ">\n" + value_body + "\n</" + name + ">\n";
  return code;
};

const autoGenElementArray = elementArray => {
  elementArray.forEach(element => {
    HtmlGenerator[element.type] = block => {
      return autoGenElement(element.type, block);
    };
  });
};

const autoGenAttribute = (name, block, last = false) => {
  const value = block.getFieldValue("attribute_value");
  const attributes = HtmlGenerator.statementToCode(block, "input_attributes");
  let code = `${block.type} = "${value}"${
    attributes != "" && attributes != null ? ` ${attributes}` : ""
  }`;
  return code;
};

const autoGenAttributeArray = elementArray => {
  elementArray.forEach(element => {
    HtmlGenerator[element.type] = block => {
      return autoGenAttribute(element.type, block);
    };
  });
};

autoGenAttributeArray(htmlAttributes);

//value
HtmlGenerator["text"] = block => {
  return block.getFieldValue("value") + "\n";
};

//document elements
HtmlGenerator["html"] = block => {
  let statements_content = HtmlGenerator.statementToCode(block, "content");
  let code = "<!DOCTYPE HTML>\n<html>\n" + statements_content + "</html>\n";
  return code;
};

HtmlGenerator["head"] = block => {
  return autoGenElement("head", block);
};

HtmlGenerator["body"] = block => {
  return autoGenElement("body", block);
};

HtmlGenerator["meta"] = block => {
  return autoGenElement("meta", block);
};
//basic elements
HtmlGenerator["p"] = block => {
  return autoGenElement("p", block);
};
HtmlGenerator["h1"] = block => {
  return autoGenElement("h1", block);
};
HtmlGenerator["h2"] = block => {
  return autoGenElement("h2", block);
};
HtmlGenerator["h3"] = block => {
  return autoGenElement("h3", block);
};
HtmlGenerator["h4"] = block => {
  return autoGenElement("h4", block);
};
HtmlGenerator["h5"] = block => {
  return autoGenElement("h5", block);
};
HtmlGenerator["h6"] = block => {
  return autoGenElement("h6", block);
};
HtmlGenerator["br"] = block => {
  return autoGenElement("br", block);
};
HtmlGenerator["hr"] = block => {
  return autoGenElement("hr", block);
};
//styling
HtmlGenerator["div"] = block => {
  return autoGenElement("div", block);
};

HtmlGenerator["link"] = block => {
  return autoGenElement("link", block, true, false);
};
export default HtmlGenerator;
