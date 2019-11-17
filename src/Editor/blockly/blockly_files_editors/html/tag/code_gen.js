const makeBlockCode = block => {
  const TagName = block.name;
  const attributeExist = !block.metadata.noAttributes;
  const bodyExist = !block.metadata.noBody;
  const attribute = "attribute_input";
  const body = "tag_body_input";
  let statement_inputs = [];
  let value_inputs = [];
  if (attributeExist) value_inputs.push(attribute);
  if (bodyExist) statement_inputs.push(body);
  return {
    name: TagName,
    blockText:
      "<" +
      (block.metadata.openTag || TagName) +
      (attributeExist ? " " + "%" + attribute + "%" : "") +
      ">\n" +
      (bodyExist ? "%" + body + "%" : "") +
      "\n</" +
      (block.metadata.closeTag || TagName) +
      ">\n",
    statement_inputs: statement_inputs,
    value_inputs: value_inputs
  };
};
export default makeBlockCode;
