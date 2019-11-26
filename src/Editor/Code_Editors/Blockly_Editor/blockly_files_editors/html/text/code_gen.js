const makeBlockCode = block => {
  return {
    name: "text",
    blockText: "%text_input%",
    statement_inputs: [],
    value_inputs: [],
    field_values: ["text_input"],
    nextStatement: { exist: false, str: null }
  };
};
export default makeBlockCode;
