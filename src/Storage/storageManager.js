import * as BrowserFS from "browserfs/dist/node/core/browserfs";
import { ErrorCode } from "browserfs/dist/node/core/api_error";

import sjcl from "sjcl";
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
  setEditor(path, editor) {
    this.getFile(path, editorDataDir, editorDataDefualtValue).then(
      editorData => {
        let editorDataObject = JSON.parse(editorData);
        editorDataObject.editor = editor;
        this.updateFile(path, false, editorDataObject);
      }
    );
  }
  setFile(path, data, storage) {
    return new Promise((resolve, reject) => {
      this.fileSystem.writeFile(storage + path, data, e => {
        if (e) {
          if (e.errno === ErrorCode.ENOENT) {
            this.createDirectory(path.slice(0, path.lastIndexOf("/")), storage)
              .then(() => {
                this.fileSystem.writeFile(storage + path, data, e => {
                  if (e) {
                    reject(e);
                  } else {
                    resolve();
                  }
                });
              })
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
    try {
      return new this.fileSystem.writeFileSync(storage + path, data);
    } catch (e) {
      if (e.errno === ErrorCode.ENOENT) {
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
      this.createDirectory(path, codeDir),
      this.createDirectory(path, editorDataDir)
    ]);
  }
  createDirectory(path, storage) {
    return new Promise((resolve, reject) => {
      this.fileSystem.mkdir(storage + path, e => {
        if (e) {
          switch (e.errno) {
            case ErrorCode.EEXIST: {
              //folder exist fine
              resolve();
              break;
            }
            case ErrorCode.ENOENT: {
              this.createDirectory(
                path.slice(0, path.lastIndexOf("/")),
                storage
              )
                .then(() => {
                  this.createDirectory(path, storage)
                    .then(() => {
                      resolve();
                    })
                    .catch(reject);
                })
                .catch(reject);
              break;
            }
            default: {
              reject(e);
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
        default: {
        }
      }
    }
  }

  //delete file
  removeDocument(path) {
    return Promise.all([
      this.removeFile(path, codeDir),
      this.removeFile(path, editorDataDir)
    ]);
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

  //delete folder
  removeDocumentDirectory(path) {
    return Promise.all([
      this.removeDirectory(path, codeDir),
      this.removeDirectory(path, editorDataDir)
    ]);
  }
  removeDirectory(path, storage) {
    return new Promise((resolve, reject) => {
      this.fileSystem.rmdir(storage + path, e => {
        if (e) {
          reject(e);
        } else {
          resolve();
        }
      });
    });
  }

  //list dir
  syncListDirectory(
    path,
    storage,
    fullPath = true,
    includeStorageInPath = false
  ) {
    const folder = this.fileSystem.readdirSync(storage + path);
    if (fullPath) {
      if (includeStorageInPath) {
        return folder.map(r => storage + path + r);
      } else {
        return folder.map(r => path + r);
      }
    } else {
      return folder;
    }
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
  syncListDirectoryToCategories(path, storage, fullPath = true) {
    return this.syncListDirectory(path, storage, false).map(file => {
      return {
        path: fullPath ? path + file : file,
        isDirectory: this.syncGetFileState(path + file, storage).isDirectory()
      };
    });
  }
  listDirectoryToCategories(path, storage, fullPath = true) {
    return new Promise((resolve, reject) => {
      this.listDirectory(path, storage, false).then(files => {
        const filesProms = files.map(file => {
          return new Promise((res, rej) => {
            this.getFileState(path + file, storage)
              .then(stat =>
                res({
                  path: fullPath ? path + file : file,
                  isDirectory: stat.isDirectory()
                })
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
  syncGetFileState(path, storage = "") {
    return this.fileSystem.statSync(storage + path);
  }
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
    this.syncRename(path, newPath, editorDataDir);
    this.syncRename(path, newPath, codeDir);
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

  //ZIP
  syncZipFolder(path, storage = "") {
    const zip = new JSZip();
    const makeLevel = (path, storage) => {
      this.syncListDirectoryToCategories(path, storage).forEach(file => {
        if (file.isDirectory) {
          makeLevel(file.path + "/", storage);
        } else {
          zip.file(storage + file.path, this.syncGetFile(file.path, storage));
        }
      });
    };
    makeLevel(path, storage);
    return zip;
  }

  //exists
  syncExists(path, storage = "") {
    return this.fileSystem.existsSync(storage + path);
  }
  syncFolderExists(path, storage = "") {
    if (this.fileSystem.existsSync(storage + path)) {
      return this.syncGetFileState(path, storage).isDirectory();
    }
    return false;
  }
  syncFileExists(path, storage = "") {
    if (this.fileSystem.existsSync(storage + path)) {
      return !this.syncGetFileState(path, storage).isDirectory();
    }
    return false;
  }

  downloadCode() {
    this.syncZipFolder("", codeDir)
      .generateAsync({ type: "blob" })
      .then(v => fileDownload(v, "project.zip"));
  }
  download() {
    const code = this.syncZipFolder("", codeDir);
    const editorData = this.syncZipFolder("", editorDataDir);
    fileDownload(
      JSON.stringify({ code: code, editorData: editorData }),
      Date.now() + "-notnotepad.nnpjs"
    );
  }
}
