import * as git from "isomorphic-git";

export default class GIT_API {
  constructor(token) {
    this.gitclient = git;
    this.gitclient.plugins.set("fs", window.fs);
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
