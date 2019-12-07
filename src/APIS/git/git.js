import * as git from "isomorphic-git";
import fs from "../../Storage/fakeFS";

export default class GIT_API {
  constructor(token) {
    this.gitclient = git;
    this.gitclient.plugins.set("fs", fs);
  }
  async clone(dir, url, ref = "master") {
    await this.gitclient.clone({
      dir,
      corsProxy: "https://cors.isomorphic-git.org",
      url: url,
      ref: "master",
      singleBranch: true,
      depth: 1
    });
  }
}
