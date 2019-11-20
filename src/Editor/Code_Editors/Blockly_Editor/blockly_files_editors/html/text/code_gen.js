const makeBlockCode = block => {
  return {
    name: "text",

    blockText: "%text_input%",
    statement_inputs: [],
    value_inputs: [],
    field_values: ["text_input"]
  };
};
export default makeBlockCode;
