import * as BrowserFS from "browserfs/dist/node/core/browserfs";
import { ErrorCode } from "browserfs/dist/node/core/api_error";

import sjcl from "sjcl";
import { getDocumentLanguage } from "./fileutils";
//exports
import fileDownload from "js-file-download";
import JSZip from "jszip";

export const action = {
  byPathOnly: 0,
  codeOnly: 1,
  editorDataOnly: 2,
  codeAndEditorData: 3
};
export const codeDir = "/code/";
export const editorDataDir = "/editorData/";
export const editorDataDefualtValue = '{"editor":"","editorData":""}';
export default class StorageManager {
  constructor() {
    this.fileSystem = BrowserFS.BFSRequire("fs");
  }

  //readFile
  getFile(path, storage = "", defaultValue = "") {
    return new Promise((resolve, reject) => {
      this.fileSystem.readFile(storage + path, "utf8", (e, res) => {
        if (e) {
          if (e.errno === ErrorCode.ENOENT) {
            this.setFile(path, defaultValue, storage).then(
              this.fileSystem.readFile(storage + path, "utf8", (e, res) => {
                if (e) {
                  reject(e);
                } else {
                  resolve();
                }
              })
            );
          }
          reject(e);
        } else {
          resolve(res);
        }
      });
    });
  }

  syncGetFile(path, storage = "", defaultValue = "") {
    try {
      return this.fileSystem.readFileSync(storage + path, "utf8");
    } catch (e) {
      if (e.errno === ErrorCode.ENOENT) {
        console.log("file not exist creating : " + defaultValue);
        this.syncSetFile(path, defaultValue, storage);
        return this.fileSystem.readFileSync(storage + path, "utf8");
      }
      throw e;
    }
  }

  //write file
  syncMakeDocument(
    path,
    code = "",
    editorDataObject = { editor: "", editorData: "" },
    onErorr
  ) {
    this.syncSetFile(path, code, codeDir);
    this.syncSetFile(path, JSON.stringify(editorDataObject), editorDataDir);
  }
  MakeDocument(
    path,
    code = "",
    editorDataObject = { editor: "", editorData: "" }
  ) {
    return Promise.all([
      this.setFile(path, code, codeDir),
      this.setFile(path, JSON.stringify(editorDataObject), editorDataDir)
    ]);
  }
  updateFile(path, code, editorDataObject, onErorr) {
    if (code) {
      this.setFile(path, code, codeDir).catch(e => {
        if (onErorr) {
          onErorr(e);
        }
      });
    }
    if (editorDataObject) {
      this.setFile(path, JSON.stringify(editorDataObject), editorDataDir).catch(
        e => {
          if (onErorr) {
            onErorr(e);
          }
        }
      );
    }
  }
  setFile(path, data, storage) {
    return new Promise((resolve, reject) => {
      this.fileSystem.writeFile(storage + path, data, e => {
        if (e) {
          if (e.errno === ErrorCode.ENOENT) {
            this.createDirectory(path.slice(0, path.lastIndexOf("/")), storage)
              .then(
                this.fileSystem.writeFile(storage + path, data, e => {
                  if (e) {
                    reject(e);
                  } else {
                    resolve();
                  }
                })
              )
              .catch(reject);
          } else {
            reject(e);
          }
        }
        resolve();
      });
    });
  }
  syncSetFile(path, data, storage) {
    console.log("creating : " + path);
    try {
      return new this.fileSystem.writeFileSync(storage + path, data);
    } catch (e) {
      if (e.errno === ErrorCode.ENOENT) {
        console.log(
          "folder no exist creating : " + path.slice(0, path.lastIndexOf("/"))
        );
        this.syncCreateDirectory(path.slice(0, path.lastIndexOf("/")), storage);
        return new this.fileSystem.writeFileSync(storage + path, data);
      }
    }
  }
  //make directory
  syncMakeDirectory(path) {
    this.syncCreateDirectory(path, codeDir);
    this.syncCreateDirectory(path, editorDataDir);
  }
  makeDirectory(path) {
    return Promise.all([
      this.CreateDirectory(path, codeDir),
      this.CreateDirectory(path, editorDataDir)
    ]);
  }
  createDirectory(path, storage) {
    return new Promise((resolve, reject) => {
      this.fileSystem.mkdir(storage + path, e => {
        if (e) {
          switch (e.errno) {
            case ErrorCode.EEXIST: {
              //folder exist fine
              console.log("res");
              resolve();
              break;
            }
            case ErrorCode.ENOENT: {
              this.createDirectory(
                path.slice(0, path.lastIndexOf("/")),
                storage
              ).then(() => {
                this.createDirectory(path, storage)
                  .then(resolve)
                  .catch(reject);
              });
              break;
            }
          }
        } else {
          resolve();
        }
      });
    });
  }
  syncCreateDirectory(path, storage = "") {
    try {
      this.fileSystem.mkdirSync(storage + path);
    } catch (e) {
      switch (e.errno) {
        case ErrorCode.EEXIST: {
          //fine folder just exist
          break;
        }
        case ErrorCode.ENOENT: {
          this.syncCreateDirectory(
            path.slice(0, path.lastIndexOf("/")),
            storage
          );
          this.syncCreateDirectory(path, storage);
          break;
        }
      }
    }
  }

  //delete file
  async syncRemoveFile(path) {
    let errors = [];
    await this.removeCodeFile(path).catch(e => errors.push(e));
    await this.removeEditorDataFile(path).catch(e => errors.push(e));
    return { errors: errors };
  }
  removeFile(path, storage) {
    return new Promise((resolve, reject) => {
      this.fileSystem.unlink(storage + path, e => {
        if (e) {
          reject(e);
        } else {
          resolve();
        }
      });
    });
  }
  async syncListDirectory(path, storage, fullPath = true) {
    return await this.listDirectory;
  }
  listDirectory(path, storage, fullPath = true, includeStorageInPath = false) {
    return new Promise((resolve, reject) => {
      this.fileSystem.readdir(storage + path, (e, res) => {
        if (e) {
          reject(e);
        }
        if (fullPath) {
          if (includeStorageInPath) {
            resolve(res.map(r => storage + path + r));
          } else {
            resolve(res.map(r => path + r));
          }
        } else {
          resolve(res);
        }
      });
    });
  }
  listDirectoryToCategories(path, storage) {
    return new Promise((resolve, reject) => {
      this.listDirectory(path, storage, true).then(files => {
        const filesProms = files.map(file => {
          return new Promise((res, rej) => {
            this.getFileState(file, storage)
              .then(stat =>
                res({ path: file, isDirectory: stat.isDirectory() })
              )
              .catch(rej);
          });
        });
        Promise.all(filesProms)
          .then(res => resolve(res))
          .catch(reject);
      });
    });
  }
  //stat
  getFileState(path, storage = "") {
    return new Promise((resolve, reject) => {
      this.fileSystem.stat(storage + path, (e, state) => {
        if (e) {
          reject(e);
        } else {
          resolve(state);
        }
      });
    });
  }
  //rename
  renameDocument(path, newPath) {
    return Promise.all([
      this.renameFile(path, newPath, editorDataDir),
      this.renameFile(path, newPath, codeDir)
    ]);
  }
  syncRenameDocument(path, newPath) {
    this.syncRenameFile(path, newPath, editorDataDir);
    this.syncRenameFile(path, newPath, codeDir);
  }

  renameFile(path, newPath, storage) {
    return new Promise((res, rej) => {
      this.fileSystem.rename(storage + path, storage + newPath, e => {
        if (e) {
          rej();
        } else {
          res();
        }
      });
    });
  }
  syncRename(path, newPath, storage) {
    this.fileSystem.renameSync(storage + path, storage + newPath);
  }
}
