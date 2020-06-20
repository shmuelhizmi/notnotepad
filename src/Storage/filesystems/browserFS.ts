import * as BrowserFS from "browserfs/dist/node/core/browserfs";
import { FSModule } from "browserfs/dist/node/core/FS";
import {
  codeDir,
  configDir,
  editorDataDir,
  secretDir,
} from "../storageManager";
import { FileSystem } from "browserfs/dist/node/core/file_system";

const createFileSystem = (
  fileSystem: keyof typeof BrowserFS.FileSystem,
  args: any = {}
) => {
  return new Promise<FileSystem>((resolve, reject) => {
    BrowserFS.FileSystem[fileSystem].Create(args, (e, dir) => {
      if (e) {
        reject(e);
        return;
      }
      if (dir) {
        resolve(dir);
      } else {
        reject(new Error("FS return null"));
      }
    });
  });
};

export default async (): Promise<FileSystem> => {
  const [
    code,
    editorData,
    codeMemory,
    editorDataMemory,
    encriptedData,
    configData,
  ] = await Promise.all([
    createFileSystem("HTML5FS"),
    createFileSystem("IndexedDB"),
    createFileSystem("InMemory"),
    createFileSystem("InMemory"),
    createFileSystem("LocalStorage"),
    createFileSystem("LocalStorage"),
  ]);
  const [
    AsyncMirrorCode,
    AsyncMirrorEditorData,
  ] = await Promise.all([
    createFileSystem("AsyncMirror", { sync: codeMemory, async: code }),
    createFileSystem("AsyncMirror", { sync: editorDataMemory, async: editorData }),
  ]);
  const fs = await createFileSystem("MountableFileSystem", {
    [codeDir]: AsyncMirrorCode,
    [editorDataDir]: AsyncMirrorEditorData,
    [secretDir]: encriptedData,
    [configDir]: configData,
  });
  BrowserFS.initialize(fs);
  return fs;
};
