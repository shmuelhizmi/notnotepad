import { UniversalBlockMaker } from "../../../blockly/blockMaker";

export const makeTagBlock = block => {
  const type = block.name;
  const name = block.displayName || block.name;
  const color = 100;
  const tooltip = block.description;
  const isCustom = block.custom == false ? false : true;
  const noPerent = block.custom.noPerent || false;
  let args = [
    {
      type: "input_dummy"
    }
  ];
  if (isCustom == false || block.custom.noAttributes == null) {
    args.push({ type: "input_value", name: "attribute" });
  }
  if (isCustom == false || block.custom.nobody == null) {
    args.push({ type: "input_statement", name: "tag_body" });
  }
  return UniversalBlockMaker(
    type,
    name,
    args,
    color,
    tooltip,
    "",
    true,
    !noPerent
  );
};
