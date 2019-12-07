import StorageManager from "./storageManager";
import _ from "lodash";
import utf8 from "utf8";
import isBuffer from "is-buffer";
const root = path => "/" + path;
const endroot = path => path + "/";
const unroot = path => path.substring(1);

const makeCallback = (cb, opts) => {
  if (typeof opts === "function") {
    cb = opts;
  }
  return cb;
};

export default class fs {
  static Storage = new StorageManager("Storage Manager");

  static readFile(path, options, callback) {
    console.log([path, options, callback]);
    let resualt;
    let error;
    const cb = makeCallback(callback, options);
    try {
      resualt = this.Storage.lgetFile(unroot(path)).code;
      if (cb == callback || options.encoding == "utf8") {
        resualt = utf8.encode(resualt);
      }
    } catch (err) {
      error = err;
    }
    console.log([error, resualt]);
    cb(error, resualt);
  }
  static writeFile(file, data, options, callback) {
    console.log([file, data, options, callback]);

    const cb = makeCallback(callback, options);
    let error;
    try {
      let WriteData = data;
      if (cb == callback || options.encoding == "utf8") {
        WriteData = utf8.encode(WriteData);
      }
      if (this.Storage.fileExist(unroot(file))) {
        this.Storage.lsafeWriteCodeToFile(unroot(file), WriteData);
      } else {
        this.Storage.createFile(unroot(file), { code: WriteData });
      }
    } catch (err) {
      error = err;
    }
    console.log([error]);

    cb(error);
  }

  static unlink(path, callback) {
    console.log([path, callback]);

    let error;
    try {
      this.Storage.deleteFile(unroot(path));
    } catch (err) {
      error = err;
    }
    console.log([error]);

    callback(error);
  }
  static readdir = (path, options, callback) => {
    console.log([path, options, callback]);

    const cb = makeCallback(callback, options);
    let filePath = path;
    if (filePath.charAt(filePath.length - 1) != "/") {
      filePath = endroot(filePath);
    }
    const makeParts = fileName => {
      let parts = [];
      let cutIndex = 0;
      for (let index = 0; index < fileName.length; index++) {
        if (fileName.charAt(index) == "/") {
          parts.push(fileName.substring(cutIndex, index + 1));
          cutIndex = index + 1;
        }
      }
      return parts;
    };
    let error;
    let resualt = [];
    try {
      let files = this.Storage.getFilesArray().map(v => root(v));
      let filesPathParts = files.map(file => makeParts(file));
      let readPathParts = makeParts(filePath);
      filesPathParts.forEach(pathParts => {
        if (_.isEqual(pathParts, readPathParts)) {
          resualt.push(unroot(files[pathParts.length - 1]));
        }
      });
    } catch (err) {
      error = err;
    }
    console.log([error, resualt]);

    cb(error, resualt);
  };
  static mkdir(path, options, callback) {
    callback(null);
  }
  static rmdir(path, options, callback) {
    callback(null);
  }
  static stat(path, options, callback) {
    const cb = makeCallback(callback, options);
    let stats;
    let error;
    try {
      stats = new Stats(unroot(path));
    } catch (err) {
      error = err;
    }
    if (callback) {
      cb(error, stats);
    }
  }

  static lstat(path, options, callback) {
    const cb = makeCallback(callback, options);
    let stats;
    let error;
    try {
      stats = new Stats(unroot(path), true);
    } catch (err) {
      error = err;
    }
    if (callback) {
      cb(error, stats);
    }
  }

  static readlink(path, options, callback) {
    const cb = makeCallback(callback, options);
    let resualt;
    let error;
    try {
      resualt = this.Storage.getFile(unroot(path)).code;
      if ((options.encoding = "utf8")) {
        resualt = utf8.encode(resualt);
      }
    } catch (err) {
      error = err;
    }
    cb(error, resualt);
  }
  static symlink(target, path, type, callback) {
    let error;
    try {
      this.Storage.createLink(unroot(path), unroot(target));
    } catch (err) {
      error = err;
    }
    callback(error);
  }
}
export class Stats {
  constructor(path, ignoreLinks = true) {
    this.Storage = new StorageManager("Storage Manager");
    this.path = path;
    this.pathExist = this.Storage.fileExist(this.path);
    this.file = this.pathExist
      ? ignoreLinks
        ? this.Storage.lgetFile(path)
        : this.Storage.lgetFile(path).code
      : "";
    this.dev = 1;
    this.ino = 1;
    this.mode = 1;
    this.nlink = 1;
    this.uid = 1;
    this.gid = 1;
    this.rdev = 1;
    this.size = this.file.length;
    this.blksize = 1;
    this.blocks = 1;
    this.atimeMs = 1;
    this.mtimeMs = 1;
    this.ctimeMs = 1;
    this.birthtimeMs = 1;
    this.atimeNs = 1318289051000000000;
    this.mtimeNs = 1318289051000000000;
    this.ctimeNs = 1318289051000000000;
    this.birthtimeNs = 1318289051000000000;
    this.atime = Date.now();
    this.mtime = Date.now();
    this.ctime = Date.now();
    this.birthtime = Date.now();
  }
  isFile = () => {
    if (this.pathExist) {
      return true;
    }
    return false;
  };
  isDirectory = () => {
    if (this.pathExist) {
      return false;
    }
    return true;
  };
  isBlockDevice = () => false;
  isCharacterDevice = () => {
    if (this.pathExist) {
      return true;
    }
    return false;
  };
  isSymbolicLink = () => false;
  isFIFO = () => false;
  isSocket = () => false;
}

export class lstat {
  constructor(path) {
    this.Storage = new StorageManager("Storage Manager");
    this.path = path;
    this.pathExist = this.Storage.fileExist(this.path);
    this.file = this.pathExist ? this.Storage.getFile(path).code : "";
    this.dev = 1;
    this.ino = 1;
    this.mode = 1;
    this.nlink = 1;
    this.uid = 1;
    this.gid = 1;
    this.rdev = 1;
    this.size = this.file.length;
    this.blksize = 1;
    this.blocks = 1;
    this.atimeMs = 1;
    this.mtimeMs = 1;
    this.ctimeMs = 1;
    this.birthtimeMs = 1;
    this.atimeNs = 1318289051000000000;
    this.mtimeNs = 1318289051000000000;
    this.ctimeNs = 1318289051000000000;
    this.birthtimeNs = 1318289051000000000;
    this.atime = Date.now();
    this.mtime = Date.now();
    this.ctime = Date.now();
    this.birthtime = Date.now();
  }
  isFile = () => {
    if (this.pathExist) {
      return true;
    }
    return false;
  };
  isDirectory = () => {
    if (this.pathExist) {
      return false;
    }
    return true;
  };
  isBlockDevice = () => false;
  isCharacterDevice = () => {
    if (this.pathExist) {
      return true;
    }
    return false;
  };
  isSymbolicLink = () => false;
  isFIFO = () => false;
  isSocket = () => false;
}
