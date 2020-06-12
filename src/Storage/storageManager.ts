import * as BrowserFS from "browserfs/dist/node/core/browserfs";
import { ErrorCode } from "browserfs/dist/node/core/api_error";

//exports
import fileDownload from "js-file-download";
import JSZip from "jszip";
import { FSModule } from "browserfs/dist/node/core/FS";
import Stats from "browserfs/dist/node/core/node_fs_stats";

export const action = {
  byPathOnly: 0,
  codeOnly: 1,
  editorDataOnly: 2,
  codeAndEditorData: 3,
};
export interface editorDataObjectInterface {
  editor: string;
  editorData: string;
}
export const secretDir = "/secret/";
export const configDir = "/conf/";
export const codeDir = "/code/";
export const editorDataDir = "/editorData/";
export const editorDataDefualtValue = '{"editor":"","editorData":""}';
export default class StorageManager {
  fileSystem: FSModule;
  constructor() {
    this.fileSystem = BrowserFS.BFSRequire("fs");
  }

  //readFile
  getDocument(path: string) {
    return new Promise(async (resolve, reject) => {
      try {
        resolve({
          code: await this.getFile(path, codeDir),
          editorData: await this.getFileEditorData(path),
        });
      } catch (e) {
        reject(e);
      }
    });
  }
  syncGetDocument(path: string) {
    return {
      code: this.syncGetFile(path, codeDir),
      editorData: this.syncGetFileEditorData(path),
    };
  }
  getFileEditorData(path: string, defaultValue = editorDataDefualtValue) {
    return new Promise((resolve, reject) => {
      this.getFile(path, editorDataDir, defaultValue).then((editorData) => {
        const editorDataObject = JSON.parse(editorData);
        if (editorDataObject) {
          resolve(editorDataObject);
        } else {
          reject();
        }
      });
    });
  }
  syncGetFileEditorData(
    path: string,
    defaultValue = editorDataDefualtValue,
    onError?: (error: Error) => void
  ) {
    try {
      return JSON.parse(this.syncGetFile(path, editorDataDir, defaultValue));
    } catch (e) {
      if (onError) {
        onError(e);
      }
    }
  }
  getFile(path: string, storage = "", defaultValue = "") {
    return new Promise(
      (resolve: (fileData: string | undefined) => void, reject) => {
        this.fileSystem.readFile(storage + path, "utf8", (e, res) => {
          if (e) {
            if (e.errno === ErrorCode.ENOENT) {
              this.setFile(path, defaultValue, storage).then(() => {
                this.fileSystem.readFile(storage + path, "utf8", (e, res) => {
                  if (e) {
                    reject(e);
                  } else {
                    resolve(res);
                  }
                });
              });
            }
            reject(e);
          } else {
            resolve(res);
          }
        });
      }
    );
  }

  syncGetFile(path: string, storage = "", defaultValue = "") {
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
    path: string,
    code = "",
    editorDataObject = { editor: "", editorData: "" }
  ) {
    this.syncSetFile(path, code, codeDir);
    this.syncSetFile(path, JSON.stringify(editorDataObject), editorDataDir);
  }
  MakeDocument(
    path: string,
    code = "",
    editorDataObject = { editor: "", editorData: "" }
  ) {
    return Promise.all([
      this.setFile(path, code, codeDir),
      this.setFile(path, JSON.stringify(editorDataObject), editorDataDir),
    ]);
  }
  updateFile(
    path: string,
    code?: string,
    editorDataObject?: editorDataObjectInterface,
    onErorr?: (error: BrowserFS.Errors.ApiError) => void
  ) {
    if (code) {
      this.setFile(path, code, codeDir).catch((e) => {
        if (onErorr) {
          onErorr(e);
        }
      });
    }
    if (editorDataObject) {
      this.setFile(path, JSON.stringify(editorDataObject), editorDataDir).catch(
        (e) => {
          if (onErorr) {
            onErorr(e);
          }
        }
      );
    }
  }
  setEditor(path: string, editor: string) {
    this.getFile(path, editorDataDir, editorDataDefualtValue).then(
      (editorData) => {
        let editorDataObject: editorDataObjectInterface = JSON.parse(
          editorData
        );
        editorDataObject.editor = editor;
        this.updateFile(path, undefined, editorDataObject);
      }
    );
  }
  setFile(path: string, data: string, storage: string) {
    return new Promise((resolve: () => void, reject) => {
      this.fileSystem.writeFile(storage + path, data, (e) => {
        if (e) {
          if (e.errno === ErrorCode.ENOENT) {
            this.createDirectory(path.slice(0, path.lastIndexOf("/")), storage)
              .then(() => {
                this.fileSystem.writeFile(storage + path, data, (e) => {
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
  syncSetFile(path: string, data: string, storage: string) {
    try {
      return this.fileSystem.writeFileSync(storage + path, data);
    } catch (e) {
      if (e.errno === ErrorCode.ENOENT) {
        this.syncCreateDirectory(path.slice(0, path.lastIndexOf("/")), storage);
        return this.fileSystem.writeFileSync(storage + path, data);
      }
    }
  }
  //make directory
  syncMakeDirectory(path: string) {
    this.syncCreateDirectory(path, codeDir);
    this.syncCreateDirectory(path, editorDataDir);
  }
  makeDirectory(path: string) {
    return Promise.all([
      this.createDirectory(path, codeDir),
      this.createDirectory(path, editorDataDir),
    ]);
  }
  createDirectory(path: string, storage = "") {
    return new Promise((resolve: () => void, reject) => {
      this.fileSystem.mkdir(storage + path, (e: BrowserFS.Errors.ApiError) => {
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
  syncCreateDirectory(path: string, storage = "") {
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
  removeDocument(path: string) {
    return Promise.all([
      this.removeFile(path, codeDir),
      this.removeFile(path, editorDataDir),
    ]);
  }

  removeFile(path: string, storage = "") {
    return new Promise((resolve: () => void, reject) => {
      this.fileSystem.unlink(storage + path, (e) => {
        if (e) {
          reject(e);
        } else {
          resolve();
        }
      });
    });
  }

  //delete folder
  removeDocumentDirectory(path: string) {
    return Promise.all([
      this.removeDirectory(path, codeDir),
      this.removeDirectory(path, editorDataDir),
    ]);
  }
  removeDirectory(path: string, storage = "") {
    return new Promise((resolve: () => void, reject) => {
      this.fileSystem.rmdir(storage + path, (e) => {
        if (e) {
          if (e.errno === ErrorCode.ENOTEMPTY) {
            this.listDirectoryToCategories(path + "/", storage, true).then(
              (files) => {
                const promises: Promise<unknown>[] = [];
                files.forEach((file) => {
                  if (file.isDirectory) {
                    promises.push(this.removeDirectory(file.path, storage));
                  } else {
                    promises.push(this.removeFile(file.path, storage));
                  }
                });
                Promise.all(promises)
                  .then(() => {
                    this.removeDirectory(path, storage).then(resolve);
                  })
                  .catch(reject);
              }
            );
          } else if (e.errno === ErrorCode.ENOENT) {
            resolve();
          } else {
            reject(e);
          }
        } else {
          resolve();
        }
      });
    });
  }

  //list dir
  syncListDirectory(
    path: string,
    storage = "",
    fullPath = true,
    includeStorageInPath = false
  ) {
    const folder = this.fileSystem.readdirSync(storage + path);
    if (fullPath) {
      if (includeStorageInPath) {
        return folder.map((r) => storage + path + r);
      } else {
        return folder.map((r) => path + r);
      }
    } else {
      return folder;
    }
  }
  listDirectory(
    path: string,
    storage = "",
    fullPath = true,
    includeStorageInPath = false
  ) {
    return new Promise(
      (resolve: (files: string[] | undefined) => void, reject) => {
        this.fileSystem.readdir(storage + path, (e, res) => {
          if (e) {
            reject(e);
          }
          if (fullPath && res) {
            if (includeStorageInPath) {
              resolve(res.map((r) => storage + path + r));
            } else {
              resolve(res.map((r) => path + r));
            }
          } else {
            resolve(res);
          }
        });
      }
    );
  }
  syncListDirectoryToCategories(
    path: string,
    storage = "",
    fullPath = true,
    includeStrage = false
  ): { path: string; isDirectory: boolean }[] {
    return this.syncListDirectory(path, storage, false, includeStrage).map(
      (file) => {
        return {
          path: fullPath ? path + file : file,
          isDirectory: this.syncGetFileState(
            path + file,
            storage
          ).isDirectory(),
        };
      }
    );
  }
  listDirectoryToCategories(path: string, storage = "", fullPath = true) {
    return new Promise(
      (
        resolve: (files: { path: string; isDirectory: boolean }[]) => void,
        reject
      ) => {
        this.listDirectory(path, storage, false).then((files) => {
          if (files) {
            const filesProms = files.map((file) => {
              return new Promise(
                (
                  res: (file: { path: string; isDirectory: boolean }) => void,
                  rej
                ) => {
                  this.getFileState(path + file, storage)
                    .then((stat) =>
                      res({
                        path: fullPath ? path + file : file,
                        isDirectory: stat.isDirectory(),
                      })
                    )

                    .catch(rej);
                }
              );
            });
            Promise.all(filesProms)
              .then((res) => resolve(res))
              .catch(reject);
          }
        });
      }
    );
  }
  syncListFilesToFilesArray(path: string, storage = "") {
    const filesArray: { file: string; data: string }[] = [];
    const makeLevel = (path: string, storage: string) => {
      this.syncListDirectoryToCategories(path, storage).forEach((file) => {
        if (file.isDirectory) {
          makeLevel(file.path + "/", storage);
        } else {
          filesArray.push({
            file: file.path,
            data: this.syncGetFile(file.path, storage),
          });
        }
      });
    };
    makeLevel(path, storage);
    return filesArray;
  }
  //stat
  syncGetFileState(path: string, storage = "") {
    return this.fileSystem.statSync(storage + path);
  }
  getFileState(path: string, storage = "") {
    return new Promise(
      (resolve: (state: Stats | undefined) => void, reject) => {
        this.fileSystem.stat(storage + path, (e, state) => {
          if (e) {
            reject(e);
          } else {
            resolve(state);
          }
        });
      }
    );
  }
  //rename
  renameDocument(path: string, newPath: string) {
    return Promise.all([
      this.renameFile(path, newPath, editorDataDir),
      this.renameFile(path, newPath, codeDir),
    ]);
  }
  syncRenameDocument(path: string, newPath: string) {
    this.syncRename(path, newPath, editorDataDir);
    this.syncRename(path, newPath, codeDir);
  }

  renameFile(path: string, newPath: string, storage = "") {
    return new Promise((res, rej) => {
      this.fileSystem.rename(storage + path, storage + newPath, (e) => {
        if (e) {
          rej();
        } else {
          res();
        }
      });
    });
  }
  syncRename(path: string, newPath: string, storage = "") {
    this.fileSystem.renameSync(storage + path, storage + newPath);
  }

  //ZIP
  syncZipFolder(path: string, storage = "") {
    const zip = new JSZip();
    const makeLevel = (path: string, storage: string) => {
      this.syncListDirectoryToCategories(path, storage).forEach((file) => {
        if (file.isDirectory) {
          makeLevel(file.path + "/", storage);
        } else {
          zip.file(file.path, this.syncGetFile(file.path, storage));
        }
      });
    };
    makeLevel(path, storage);
    return zip;
  }

  //exists
  syncExists(path: string, storage = "") {
    return this.fileSystem.existsSync(storage + path);
  }
  syncFolderExists(path: string, storage = "") {
    if (this.fileSystem.existsSync(storage + path)) {
      return this.syncGetFileState(path, storage).isDirectory();
    }
    return false;
  }
  syncFileExists(path: string, storage = "") {
    if (this.fileSystem.existsSync(storage + path)) {
      return !this.syncGetFileState(path, storage).isDirectory();
    }
    return false;
  }

  downloadCode() {
    this.syncZipFolder("", codeDir)
      .generateAsync({ type: "blob" })
      .then((v) => fileDownload(v, "project.zip"));
  }

  downloadProject() {
    const code = this.syncZipFolder("", codeDir);
    const editorData = this.syncZipFolder("", editorDataDir);
    fileDownload(
      JSON.stringify({ code: code, editorData: editorData }),
      Date.now() + "-notnotepad.nnpjs"
    );
  }
  getPathToFileName = (fullPath: string) => fullPath.replace(/^.*[\\/]/, "");

  downloadFile(path: string, storage = codeDir) {
    const file = this.syncGetFile(path, storage);
    fileDownload(file, this.getPathToFileName(path));
  }
}
