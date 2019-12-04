import fileDownload from "js-file-download";
import STORAGE_RESUALT from "./storage_resualt";
import JSZip from "jszip";

class StorageManager {
  constructor(name) {
    this.id = Math.random();
    this.name = name;
    this.InitFilesArray();
    this.downloadTimeout = false;
  }
  getDocumentTemplate = () => {
    return { saveData: "", code: "" };
  };
  setDownloadTimeout = async () => {
    this.downloadTimeout = true;
    setTimeout(() => {
      this.downloadTimeout = false;
    }, 1500);
  };
  InitFilesArray = (value = { files: ["index.html"], tokens: [] }) => {
    if (!this.FileArrayExist()) {
      localStorage.setItem(this.name, JSON.stringify(value));
      value.files.forEach(file => {
        localStorage.setItem(file, '{"saveData":"","code":""}');
      });
    }
  };
  getFilesArray = () => {
    return JSON.parse(localStorage.getItem(this.name)).files;
  };
  getToken = appName => {
    return JSON.parse(localStorage.getItem(this.name)).tokens[appName];
  };
  setToken = (appName, newValue) => {
    const newStorage = JSON.parse(localStorage.getItem(this.name));
    newStorage.tokens[appName] = newValue;
    return localStorage.setItem(this.name, JSON.stringify(newStorage));
  };
  setFilesArray = newArray => {
    localStorage.setItem(this.name, JSON.stringify({ files: newArray }));
  };
  FileArrayExist = () => {
    const fileArray = localStorage.getItem(this.name);
    if (fileArray != null && fileArray !== "undefined" && fileArray !== "") {
      return true;
    } else {
      return false;
    }
  };

  createFile = (fileName, fileValue) => {
    let res;
    if (!this.fileExist(fileName) && fileName != this.name) {
      let arr = this.getFilesArray();
      arr.push(fileName);
      this.setFilesArray(arr);
      localStorage.setItem(fileName, JSON.stringify(fileValue));
      res = STORAGE_RESUALT.SUCCESS;
    } else {
      res = STORAGE_RESUALT.UNKNOWN;
    }
    return res;
  };
  deleteFile = fileName => {
    let res;
    if (this.fileExist(fileName)) {
      let arr = this.getFilesArray();
      arr = arr.filter(value => {
        if (value !== fileName) {
          res = STORAGE_RESUALT.SUCCESS;
          return true;
        } else {
          return false;
        }
      });
      this.setFilesArray(arr);
      localStorage.removeItem(fileName);
    } else {
      res = STORAGE_RESUALT.FILE_TO_FOUND;
    }
    return res;
  };
  renameFile = (originalName, newName) => {
    let res = STORAGE_RESUALT.FILE_TO_FOUND;
    let arr = this.getFilesArray();
    arr.forEach((document, index) => {
      if (document == originalName) {
        arr[index] = newName;
        localStorage.setItem(newName, localStorage.getItem(originalName));
        localStorage.removeItem(originalName);
        res = STORAGE_RESUALT.SUCCESS;
      }
    });
    this.setFilesArray(arr);
    return res;
  };
  getFile = fileName => {
    if (this.fileExist(fileName)) {
      return JSON.parse(localStorage.getItem(fileName));
    }
    return null;
  };
  downloadFile = (fileName, exportFileName, objectPath = null) => {
    if (!this.downloadTimeout) {
      const data =
        objectPath !== null
          ? this.getFile(fileName)[objectPath]
          : JSON.stringify(this.getFile(fileName));
      fileDownload(data, exportFileName);
      this.setDownloadTimeout();
    }
  };
  downloadFileCode = (fileName, exportFileName) => {
    if (!this.downloadTimeout) {
      const data = this.getFile(fileName).code;
      fileDownload(data, exportFileName);
      this.setDownloadTimeout();
    }
  };
  fileExist = fileName => {
    if (this.getFilesArray().includes(fileName)) {
      return true;
    }
    return false;
  };
  safeWriteToFile = (fileName, fileValue) => {
    if (this.fileExist(fileName)) {
      localStorage.setItem(fileName, JSON.stringify(fileValue));
    }
  };
  compileAndZipCode = (rootFolder = "project") => {
    const filesArray = this.getFilesArray();
    const files = filesArray.map(file => ({
      code: this.getFile(file).code,
      name: file
    }));
    const zip = new JSZip();
    files.forEach(file => {
      zip.file(rootFolder + "/" + file.name, file.code);
    });
    zip.generateAsync({ type: "blob" }).then(content => {
      // see FileSaver.js
      fileDownload(content, "build.zip");
    });
  };
  zipAndDwonloadData = () => {
    const filesArray = this.getFilesArray();
    const files = filesArray.map(file => ({
      data: JSON.stringify(this.getFile(file)),
      name: file
    }));
    const zip = new JSZip();
    zip.file("files.json", JSON.stringify(files));
    zip.file("filesArray.json", JSON.stringify(filesArray));

    zip.generateAsync({ type: "blob" }).then(content => {
      // see FileSaver.js
      fileDownload(content, "save.nnp");
    });
  };
}
export default StorageManager;
