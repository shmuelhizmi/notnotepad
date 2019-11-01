import Blockly from "blockly";

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
  let value_parameters = HtmlGenerator.valueToCode(
    block,
    "parameters",
    HtmlGenerator.ORDER_ATOMIC
  );
  let statements_body = HtmlGenerator.statementToCode(block, "body");

  let code =
    "<" +
    name +
    value_parameters +
    ">\n" +
    statements_body +
    "<" +
    name +
    "/>\n";
  return code;
};

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
