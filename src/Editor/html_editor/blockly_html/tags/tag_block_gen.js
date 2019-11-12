import { UniversalBlockMaker } from "../../../blockly/blockMaker";

export const makeTagBlock = block => {
  const type = block.name;
  const name = block.displayName || block.name;
  const color = 100;
  const tooltip = block.description;
  const haveMetadata = block.metadata == false ? false : true;
  const noPerent = block.metadata.noPerent || false;

  let args = [
    {
      type: "input_dummy"
    }
  ];
  if (haveMetadata == false || block.metadata.noAttributes == null) {
    args.push({ type: "input_value", name: "attribute_input" });
  }
  if (haveMetadata == false || block.metadata.nobody == null) {
    args.push({ type: "input_statement", name: "tag_body_input" });
  }
  return UniversalBlockMaker(
    type,
    name,
    args,
    color,
    tooltip,
    "",
    true,
    !noPerent,
    haveMetadata ? block.metadata : {}
  );
};
