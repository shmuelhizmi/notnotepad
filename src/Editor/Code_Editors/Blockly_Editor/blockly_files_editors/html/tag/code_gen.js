const makeBlockCode = block => {
  const TagName = block.name;
  const attribute = "attribute_input";
  const body = "tag_body_input";
  const haveMetadata = block.hasOwnProperty("metadata");
  const attributeExist =
    haveMetadata === false || block.metadata.noAttributes === null;
  const bodyExist = haveMetadata === false || block.metadata.nobody === null;
  let statement_inputs = [];
  let value_inputs = [];
  if (attributeExist) statement_inputs.push(attribute);
  if (bodyExist) statement_inputs.push(body);
  return {
    name: TagName,
    blockText:
      "<" +
      (block.metadata.openTag || TagName) +
      (attributeExist ? "%" + attribute + "%" : "") +
      ">\n" +
      (bodyExist ? "%" + body + "%" : "") +
      "\n</" +
      (block.metadata.closeTag || TagName) +
      ">\n",
    statement_inputs: statement_inputs,
    value_inputs: value_inputs,
    field_values: []
  };
};
export default makeBlockCode;
