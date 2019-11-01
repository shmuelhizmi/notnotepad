const INITIAL_XML =
  '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="text" x="70" y="30"><field name="TEXT"></field></block></xml>';

const INITIAL_TOOLBOX_XML =
  '<xml xmlns="http://www.w3.org/1999/xhtml" id="toolbox" style="display: none;">\n' +
  '  <category name="document" >\n' +
  '     <block type="html"></block>\n' +
  '     <block type="head"></block>\n' +
  '     <block type="body"></block>\n' +
  "</category>\n" +
  '  <category name="basics" >\n' +
  '     <block type="text"></block>\n' +
  '     <block type="div"></block>\n' +
  '     <block type="p"></block>\n' +
  '     <block type="h1"></block>\n' +
  '     <block type="h2"></block>\n' +
  '     <block type="h3"></block>\n' +
  '     <block type="h4"></block>\n' +
  '     <block type="h5"></block>\n' +
  '     <block type="h6"></block>\n' +
  "</category>\n" +
  "</xml>";
const ConfigFiles = {
  INITIAL_XML,
  INITIAL_TOOLBOX_XML
};

export default ConfigFiles;
