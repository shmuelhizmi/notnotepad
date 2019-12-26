import StorageManager, { codeDir } from "../Storage/storageManager";
import { makeTable } from "./terminalComponents";
const storage = new StorageManager();
export const rm = (startObject, out) => {
  const help = ` rm - remove
    exmple file : rm "file.c"
    exmple folder : rm -d "folder"  `;
  if (startObject.strings.length >= 1) {
    if (
      startObject.options.includes("-d") ||
      startObject.options.includes("--dir")
    ) {
      if (startObject.sudo) {
        storage
          .removeDocumentDirectory(
            startObject.location + startObject.strings[0]
          )
          .then(() => out("success"))
          .catch(e => {
            out("error : " + e.code + "\n" + help);
          });
      } else {
        out("sudo require to delete folder");
      }
    } else {
      storage
        .removeDocument(startObject.location + startObject.strings[0], codeDir)
        .then(() => out("success"))
        .catch(e => {
          out("error : " + e.code + "\n" + help);
        });
    }
  } else {
    out(help);
  }
};
export const cat = (startObject, out) => {
  const help = ` cat - print file to console
    exmple file : cat "file.c"`;
  if (startObject.strings.length >= 1) {
    storage
      .getFile(startObject.location + startObject.strings[0], codeDir)
      .then(v => {
        out(v);
      });
  } else {
    out(help);
  }
};
export const ls = (startObject, out) => {
  const help = ` ls - list file in current directory
    exmple file : ls -> file.c,file.js,file.nnp`;
  storage.listDirectory(startObject.location, codeDir).then(res => {
    out(makeTable([res], "#0f0"));
  });

  if (startObject.fullArgs.length > 0) {
    out(help);
  }
};
export const touch = (startObject, out) => {
  const help = ` 
  WARNING FOR NOW USING TOUCH ON EXISTING DOCS WILL DELETE THME
  touch - create
  exmple file : touch "file.c"
  exmple folder : touch -d "folder"`;
  if (startObject.strings.length >= 1) {
    storage
      .MakeDocument(startObject.location + startObject.strings[0], codeDir)
      .then(out);
  } else {
    out(help);
  }
};
