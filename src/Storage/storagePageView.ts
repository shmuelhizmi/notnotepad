import StorageManager, { codeDir } from "../Storage/storageManager";

export default class PageView {
  storage: StorageManager;
  pageName: string;
  constructor(pageName: string) {
    this.storage = new StorageManager();
    this.pageName = pageName;
  }
  start() {
    this.updatePage();
  }
  updatePage = () => {
    const div = document.getElementById("pageView");
    if (div) {
      div.innerHTML = this.storage.syncGetFile(this.pageName, codeDir);
    }
  };
}
