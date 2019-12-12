import * as git from "isomorphic-git";
import * as BrowserFS from "browserfs/dist/node/core/browserfs";

export default class GIT_API {
  constructor(token) {
    this.fileSystem = BrowserFS.BFSRequire("fs");
    this.gitclient = git;
    this.gitclient.plugins.set("fs", this.fileSystem);
  }
  clone(dir, url, ref = "master") {
    this.gitclient.clone({
      dir,
      corsProxy: "https://cors.isomorphic-git.org",
      url: url,
      ref: ref,
      singleBranch: true,
      depth: 1
    });
  }
}
