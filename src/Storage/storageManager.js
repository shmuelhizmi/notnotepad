class StorageManager {
  constructor(name) {
    this.name = name;
    this.InitFilesArray();
  }
  InitFilesArray = (value = []) => {
    if (!this.FileArrayExist()) {
      localStorage.setItem(this.name, JSON.stringify(value));
    }
  };
  getFilesArray = () => {
    return JSON.parse(localStorage.getItem(this.name));
  };
  setFilesArray = newArray => {
    localStorage.setItem(this.name, JSON.stringify(newArray));
  };
  FileArrayExist = () => {
    if (
      localStorage.getItem(this.name) != null &&
      localStorage.getItem(this.name) !== "undefined"
    ) {
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
