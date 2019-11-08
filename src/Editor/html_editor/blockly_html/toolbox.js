import {
  htmlMetadataBlocks,
  htmlBasicElementsBlocks,
  htmlStylingElements,
  htmlAttributes
} from "./html_blocks";

const toolboxCategoryGen = (Blocks, name, searchKey = "") => {
  let res = "";
  res += `  <category name="${name}" >\n`;
  Blocks.forEach(element => {
    if (searchKey !== "") {
      if (element.type.includes(searchKey))
        res += `     <block type="${element.type}"></block>\n`;
    } else {
      res += `     <block type="${element.type}"></block>\n`;
    }
  });
  res += `  </category>\n`;
  return res;
};

const INITIAL_XML =
  '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="comment" x="70" y="30"></block></xml>';

const INITIAL_TOOLBOX_XML =
  '<xml xmlns="http://www.w3.org/1999/xhtml" id="toolbox" style="display: none;">\n' +
  toolboxCategoryGen(htmlMetadataBlocks, "document") +
  toolboxCategoryGen(htmlBasicElementsBlocks, "basics") +
  toolboxCategoryGen(htmlAttributes, "attribute") +
  toolboxCategoryGen(htmlStylingElements, "styling") +
  "</xml>";

export const SEARCH_TOOLBOX_XML = searchKey => {
  console.log("search start");
  return (
    '<xml xmlns="http://www.w3.org/1999/xhtml" id="toolbox" style="display: none;">\n' +
    toolboxCategoryGen(htmlMetadataBlocks, "document", searchKey) +
    toolboxCategoryGen(htmlBasicElementsBlocks, "basics", searchKey) +
    toolboxCategoryGen(htmlAttributes, "attribute", searchKey) +
    toolboxCategoryGen(htmlStylingElements, "styling", searchKey) +
    "</xml>"
  );
};
const initConfigFiles = {
  INITIAL_XML,
  INITIAL_TOOLBOX_XML
};

export default initConfigFiles;
