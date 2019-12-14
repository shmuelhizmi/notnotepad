import * as BrowserFS from "browserfs/dist/node/core/browserfs";
import { FSModule } from "browserfs/dist/node/core/FS";

export const filesSystems = {
  code: "/code",
  editorData: "/savedata",
  encriptedData: "/secret"
};

export default (
  callback: (
    e: BrowserFS.Errors.ApiError | null | undefined,
    fs: FSModule
  ) => void
) => {
  BrowserFS.FileSystem.IndexedDB.Create({}, (e, code) => {
    if (code) {
      BrowserFS.FileSystem.LocalStorage.Create({}, (e, editorData) => {
        if (editorData) {
          BrowserFS.FileSystem.InMemory.Create({}, (e, codeMemory) => {
            if (codeMemory) {
              BrowserFS.FileSystem.AsyncMirror.Create(
                { sync: codeMemory, async: code },
                (e, syncCode) => {
                  if (syncCode) {
                    BrowserFS.FileSystem.IndexedDB.Create(
                      {},
                      (e, encriptedData) => {
                        if (encriptedData) {
                          BrowserFS.FileSystem.MountableFileSystem.Create(
                            {
                              "/code": syncCode,
                              "/editorData": editorData,
                              "/secret": encriptedData
                            },
                            (e, fs) => {
                              if (fs) {
                                BrowserFS.initialize(fs);
                                callback(e, BrowserFS.BFSRequire("fs"));
                              }
                            }
                          );
                        }
                      }
                    );
                  }
                }
              );
            }
          });
        }
      });
    }
  });
};
