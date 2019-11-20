import _ from "lodash";

class StorageManager {
  constructor(name) {
    this.name = name;
    this.FilesArray = JSON.parse(localStorage.getItem(name)) || [];
  }
  addFile(fileName) {
    if (!this.FilesArray.contains(fileName)) {
      this.FilesArray.pop(fileName);
      return ["success", "file was writed successfully"];
    } else {
      return ["fail", "file exist"];
    }
  }
  removeFile(fileName) {
    _.remove(this.FilesArray, i => {
      return n == fileName;
    });
  }
  updateLocalStorage = () => {
    localStorage.setItem(name, JSON.stringify(this.FilesArray));
  };
}
