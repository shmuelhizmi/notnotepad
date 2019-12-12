import StorageManager, { codeDir } from "../Storage/storageManager";

export default class PageView {
  constructor(pageName) {
    this.storage = new StorageManager();
    this.pageName = pageName;
  }
  start() {
    this.updatePage();
  }
  updatePage = () => {
    document.getElementById("pageView").innerHTML = this.storage.syncGetFile(
      this.pageName,
      codeDir
    );
  };
}
