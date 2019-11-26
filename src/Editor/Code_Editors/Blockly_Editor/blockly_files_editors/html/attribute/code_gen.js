export const makeBlockCode = block => {
  const type = block.name;
  const name = block.displayName || block.name;
  const haveValueList = block.metadata.hasOwnProperty("valueList") || false;
  const fieldName = haveValueList
    ? block.metadata.valueList.name
    : "attribute_value_input";
  const next_attrinute = "next_attrinute";
  let field_inputs = [fieldName];
  let statement_inputs = [next_attrinute];

  return {
    name: name,
    blockText: `${type}="%${fieldName}%"%${next_attrinute}%`,
    value_inputs: [],
    statement_inputs: statement_inputs,
    field_values: field_inputs,
    nextStatement: { exist: false, str: null }
  };
};
export default makeBlockCode;
