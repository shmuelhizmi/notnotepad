import GIT_API from "../APIS/git/git";
import { codeDir } from "../Storage/storageManager";
import {
  consoleControls,
  startObject
} from "../LayoutComponents/console/terminal";
import { makeIcon } from "./terminalComponents";
const gitAPI = new GIT_API();
export default (
  startObject: startObject,
  out: (output: string) => void,
  consoleControls: consoleControls
) => {
  if (startObject.fullArgs.length < 0) {
    out(help);
  } else {
    switch (startObject.fullArgs[0]) {
      case "clone": {
        if (startObject.strings.length >= 2) {
          out("cloning start");
          consoleControls.setAllowInput(false);
          gitAPI
            .clone(
              codeDir + startObject.location + startObject.strings[0],
              startObject.strings[1]
            )
            .then(v => {
              consoleControls.setAllowInput(true);
              out("clone finished");
            })
            .catch(e => {
              out(
                makeIcon("error") + " cloning falid with error code : " + e.code
              );
              consoleControls.setAllowInput(true);
            });
          out(
            makeIcon("warning-sign") +
              " remember to reload the file browser to see changes"
          );
        } else if (startObject.strings.length >= 1) {
          gitAPI.clone(codeDir + startObject.location, startObject.strings[0]);
          out(
            makeIcon("warning-sign") +
              " remember to reload the file browser to see changes"
          );
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
