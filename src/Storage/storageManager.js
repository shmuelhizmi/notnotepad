import fileDownload from "js-file-download";

class StorageManager {
  constructor(name) {
    this.id = Math.random();
    this.name = name;
    this.InitFilesArray();
    this.downloadTimeout = false;
  }
  setDownloadTimeout = async () => {
    this.downloadTimeout = true;
    setTimeout(() => {
      this.downloadTimeout = false;
    }, 1500);
  };
  InitFilesArray = (value = { files: ["index.html"] }) => {
    if (!this.FileArrayExist()) {
      localStorage.setItem(this.name, JSON.stringify(value));
    }
    value.files.forEach(file => {
      localStorage.setItem(file, '{"saveData":"","code":""}');
    });
  };
  getFilesArray = () => {
    return JSON.parse(localStorage.getItem(this.name)).files;
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
    if (!this.fileExist(fileName)) {
      let arr = this.getFilesArray();
      arr.push(fileName);
      this.setFilesArray(arr);
      console.log(arr);
      localStorage.setItem(fileName, JSON.stringify(fileValue));
    }
  };
  getFile = fileName => {
    if (this.fileExist(fileName)) {
      return JSON.parse(localStorage.getItem(fileName));
    }
    return null;
  };
  downloadFile = (fileName, exportFileName, objectPath = null) => {
    if (!this.downloadTimeout) {
      console.log(this.id);
      const data =
        objectPath !== null
          ? this.getFile(fileName)[objectPath]
          : JSON.stringify(this.getFile(fileName));
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
}
export default StorageManager;
