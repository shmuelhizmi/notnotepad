import Blockly from "blockly";
export const FakeAtt = block => {
  return {
    type: block.type,
    message0: "name =  %1 %2",
    args0: [
      {
        type: "field_input",
        name: "input",
        text: "default"
      },
      {
        type: "input_value",
        name: "NAME"
      }
    ],
    output: null,
    colour: 230,
    tooltip: "",
    helpUrl: ""
  };
};
