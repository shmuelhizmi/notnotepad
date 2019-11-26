import { UniversalBlockMaker } from "../../../blockMaker";

const makeBlock = block => {
  const type = block.name;
  const name = block.displayName || block.name;
  const color = 230;
  const tooltip = block.description;
  const haveMetadata = block.hasOwnProperty("metadata");
  const haveValueList = block.metadata.hasOwnProperty("valueList") || false;
  const helpURL = block.hasOwnProperty("helpURL") || "";
  let args = [];
  if (haveValueList) {
    let dropDownValues = [];
    block.metadata.valueList.values.forEach(element => {
      dropDownValues.push([element, element]);
    });
    args.push({
      type: "field_dropdown",
      name: block.metadata.valueList.name,
      option: dropDownValues
    });
  } else {
    args.push({
      type: "field_input",
      name: "attribute_value_input",
      text: ""
    });
  }
  args.push({ type: "input_value", name: "next_attrinute" });
  return UniversalBlockMaker(
    type,
    name,
    args,
    color,
    tooltip,
    helpURL,
    false,
    false,
    haveMetadata ? block.metadata : {},
    block.hasOwnProperty("tags") ? block.tags[0] : "default",
    true
  );
};
export default makeBlock;
