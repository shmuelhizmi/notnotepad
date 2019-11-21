import { UniversalBlockMaker } from "../../../blockMaker";

const makeBlock = block => {
  const type = block.name;
  const name = block.displayName || block.name;
  const color = 100;
  const tooltip = block.description;
  const helpURL = block.helpURL || "";
  const haveMetadata = block.hasOwnProperty("metadata");
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
    helpURL,
    true,
    !noPerent,
    haveMetadata ? block.metadata : {}
  );
};
export default makeBlock;
