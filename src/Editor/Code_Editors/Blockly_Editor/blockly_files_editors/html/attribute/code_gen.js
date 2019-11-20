export const makeBlockCode = block => {
  const type = block.name;
  const name = block.displayName || block.name;
  const haveValueList = block.metadata.hasOwnProperty("valueList") || false;
  const fieldName = haveValueList
    ? block.metadata.valueList.name
    : "attribute_value_input";
  let field_inputs = [fieldName];

  return {
    name: name,
    blockText: `${type}="%${fieldName}%"`,
    value_inputs: [],
    statement_inputs: [],
    field_values: field_inputs
  };
};
export default makeBlockCode;
