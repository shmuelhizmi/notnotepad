import GIT_API from "../APIS/git/git";
import { codeDir } from "../Storage/storageManager";
const gitAPI = new GIT_API();
export default (startObject, out) => {
  console.log(startObject);
  if (startObject.fullArgs < 0) {
    out(help);
  } else {
    switch (startObject.fullArgs[0]) {
      case "clone": {
        if (startObject.strings.length >= 2) {
          gitAPI.clone(
            codeDir + startObject.location + startObject.strings[0],
            startObject.strings[1]
          );
          out("remember to reload the file browser to see changes");
        } else if (startObject.strings.length >= 1) {
          gitAPI.clone(codeDir + startObject.location, startObject.strings[0]);
          out("remember to reload the file browser to see changes");
        } else {
          out(help);
        }
        break;
      }
      default: {
        out(help);
      }
    }
  }
};
const help = `
clone -- clone git reposetory 
exmple : git clone "./cloneFolder/" "https://github.com/facebook/react" -> clone react to cloneFolder
exmple : git clone "https://github.com/facebook/react" -> clone react to current folder

`;
