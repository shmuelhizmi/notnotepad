import axios, { AxiosResponse } from "axios";

export default class now {
  token: string;
  constructor(token: string) {
    this.token = token;
  }
  deploy(files: { file: string; data: string }[], projectName: string) {
    return new Promise((resolve, reject) => {
      axios({
        url: "https://api.zeit.co/v11/now/deployments",
        method: "POST",
        headers: [
          "Authorization: Bearer " + this.token,
          "Content-Type: application/json"
        ],
        responseType: "json"
      })
        .then((res: AxiosResponse<DeployResponse>) => resolve(res.data.url))
        .catch(reject);
    });
  }
}
export interface DeployResponse {
  id: string;
  url: string;
  name: string;
  meta: Meta;
  plan: string;
  public: boolean;
  ownerId: string;
  readyState: string;
  createdAt: number;
  createdIn: string;
  regions: string[];
  functions: Functions;
  routes: null;
  env: any[];
  build: Build;
  target: null;
  alias: any[];
  aliasError: null;
  aliasAssigned: boolean;
}

export interface Build {
  env: any[];
}

export interface Functions {
  "api/test.js": APITestJS;
}

export interface APITestJS {
  memory: number;
}

export interface Meta {}
