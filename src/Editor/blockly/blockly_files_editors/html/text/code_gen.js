const makeBlockCode = block => {
  return {
    name: "text",

    blockText: "%text_input%",
    statement_inputs: [],
    value_inputs: ["text_input"]
  };
};
export default makeBlockCode;
