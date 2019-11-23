export const UniversalBlockMaker = (
  type,
  name,
  inputArguments,
  color = 200,
  tooltip = "",
  helpUrl = "",
  inputsInline = false,
  hasPerent = false,
  metadata = {},
  style = "default",
  leftOutput = false
) => {
  let message0 = name;
  for (let count = 1; count <= inputArguments.length; count++) {
    message0 += " %" + count;
  }
  let result = {
    type: type,
    message0: message0,
    args0: inputArguments,
    inputsInline: inputsInline,
    tooltip: tooltip,
    helpUrl: helpUrl,
    metadata: metadata,
    style: style
  };
  if (hasPerent) {
    result.nextStatement = null;
    result.previousStatement = null;
  }
  if (leftOutput) {
    result.output = null;
  }
  return result;
};
