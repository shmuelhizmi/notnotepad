export const makeTagBlockCode = (block, blockData) => {
  const TagName = block.type;
  const attributeExist = !blockData.metadata.noAttributes;
  const bodyExist = !blockData.metadata.noBody;
  const attribute = "attribute_input";
  const body = "tag_body_input";
  let statement_inputs = [];
  let value_inputs = [];
  if (attributeExist) value_inputs.push(attribute);
  if (bodyExist) statement_inputs.push(body);
  return {
    blockText:
      "<" +
      (blockData.metadata.openTag || TagName) +
      (attributeExist ? " " + "%" + attribute + "%" : "") +
      ">\n" +
      (bodyExist ? "%" + body + "%" : "") +
      "\n</" +
      (blockData.metadata.closeTag || TagName) +
      ">\n",
    statement_inputs: statement_inputs,
    value_inputs: value_inputs
  };
};
