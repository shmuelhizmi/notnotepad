import axios, { AxiosResponse } from "axios";

export default class Now {
  token: string;
  constructor(token: string) {
    this.token = token;
  }
  setToken = (token: string) => {
    this.token = token;
  };
  requestLogin = (email: string, tokenName: string) => {
    return new Promise((resolve: (res: Login) => void, reject) => {
      axios({
        url: "https://api.vercel.com/now/registration",
        method: "POST",
        headers: ["Content-Type: application/json"],
        data: {
          email,
          tokenName
        }
      })
        .then((res: AxiosResponse<Login>) => resolve(res.data))
        .catch(reject);
    });
  };
  verifyLogin = (email: string, token: string) => {
    return new Promise((resolve: (token: string) => void, reject) => {
      axios({
        url:
          "https://api.vercel.com/now/registration/verify",
        params: { email, token }
      })
        .then((res: AxiosResponse<{ token: string }>) =>
          resolve(res.data.token)
        )
        .catch(reject);
    });
  };
  deploy(files: { file: string; data: string }[], name: string) {
    return new Promise((resolve: (url: string) => void, reject) => {
      axios
        .post(
          "https://api.vercel.com/v11/now/deployments",
          { name, version: 2, files },
          { headers: { Authorization: "bearer " + this.token } }
        )
        .then(res => resolve(res.data.url))
        .catch(e => reject(e));
    });
  }
}

export interface Login {
  token: string;
  securityCode: string;
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
