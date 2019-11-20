import { UniversalBlockMaker } from "../../../blockMaker";

const makeBlock = block => {
  const type = block.name;
  const name = block.displayName || block.name;
  const color = 230;
  const tooltip = block.description;
  const haveMetadata = block.hasOwnProperty("metadata");
  const haveValueList = block.metadata.hasOwnProperty("valueList") || false;
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
  return UniversalBlockMaker(
    type,
    name,
    args,
    color,
    tooltip,
    "",
    true,
    false,
    haveMetadata ? block.metadata : {},
    true
  );
};
export default makeBlock;
