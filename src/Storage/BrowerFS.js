import * as BrowserFS from "browserfs/dist/node/core/browserfs";

export const filesSystems = {
  code: "/code",
  editorData: "/savedata",
  encriptedData: "/secret"
};

export default callback => {
  BrowserFS.FileSystem.IndexedDB.Create({}, (e, code) => {
    BrowserFS.FileSystem.LocalStorage.Create((e, editorData) => {
      BrowserFS.FileSystem.InMemory.Create((e, codeMemory) => {
        BrowserFS.FileSystem.AsyncMirror.Create(
          { sync: codeMemory, async: code },
          (e, syncCode) => {
            BrowserFS.FileSystem.IndexedDB.Create({}, (e, encriptedData) => {
              BrowserFS.FileSystem.MountableFileSystem.Create(
                {
                  "/code": syncCode,
                  "/editorData": editorData,
                  "/secret": encriptedData
                },
                (e, fs) => {
                  BrowserFS.initialize(fs);
                  callback(e, BrowserFS.BFSRequire("fs"));
                }
              );
            });
          }
        );
      });
    });
  });
};

export const testBrowserFS = () => {
  console.log(window.fs);
};
