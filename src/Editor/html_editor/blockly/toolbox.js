import {
  htmlMetadataBlocks,
  htmlBasicElementsBlocks,
  htmlStylingElements,
  htmlAttributes
} from "./html_blocks";

const toolboxCategoryGen = (Blocks, name) => {
  let res = "";
  res += `  <category name="${name}" >\n`;
  Blocks.forEach(element => {
    res += `     <block type="${element.type}"></block>\n`;
  });
  res += `  </category>\n`;
  console.log(res);
  return res;
};

const INITIAL_XML =
  '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="text" x="70" y="30"><field name="TEXT"></field></block></xml>';

const INITIAL_TOOLBOX_XML =
  '<xml xmlns="http://www.w3.org/1999/xhtml" id="toolbox" style="display: none;">\n' +
  toolboxCategoryGen(htmlMetadataBlocks, "document") +
  toolboxCategoryGen(htmlBasicElementsBlocks, "basics") +
  toolboxCategoryGen(htmlAttributes, "attribute") +
  toolboxCategoryGen(htmlStylingElements, "styling") +
  "</xml>";
const ConfigFiles = {
  INITIAL_XML,
  INITIAL_TOOLBOX_XML
};

export default ConfigFiles;
