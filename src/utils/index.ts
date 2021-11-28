import fs from "fs";
import path from "path";
import ConfigOptions from "../types/configOptions";

function isFileTypeMockJSON(fileName: string): Boolean {
  return !!fileName && fileName.endsWith(".mock.json");
}

function throughDir(source: string): Array<string> {
  const files: Array<string> = [];
  function readDirSync(sourcePath: string) {
    const filesInCurrentDir = fs.readdirSync(sourcePath);
    filesInCurrentDir.forEach((file: string) => {
      const fileWithAbsolutePath = path.join(sourcePath, file);
      if (isDirectory(fileWithAbsolutePath)) readDirSync(fileWithAbsolutePath);
      else if (isFileTypeMockJSON(fileWithAbsolutePath)) files.push(fileWithAbsolutePath);
    });
  }
  readDirSync(source);
  return files;
}

function isDirectory(path: string): Boolean {
  try {
    var stat = fs.lstatSync(path);
    return stat.isDirectory();
  } catch (e) {
    return false;
  }
}

function isFile(path: string): Boolean {
  try {
    var stat = fs.lstatSync(path);
    return stat.isFile();
  } catch (e) {
    return false;
  }
}

function readFile(path: string): string | undefined {
  if (!isFile(path)) return;
  const data = fs.readFileSync(path);
  return data.toString();
}

const toJSON: Function = JSON.parse;

function splitAndTakeLast(item: string, delimiter: string): string {
  return item.split(`/${delimiter}/`)[1];
}

function generateRouteFromFile(item: string, sourceFolderName: string): string {
  return splitAndTakeLast(item, sourceFolderName).replace(".mock.json", "");
}

function objToArray(obj: { [key: string]: any }): Array<string> {
  const headerKey = Object.keys(obj)[0];
  const headerValue = obj[headerKey];
  return [headerKey, headerValue];
}

function setRelativePath(fileName: string): string {
  return path.join(__dirname, "../..", fileName);
}

function addSlashAtFirst(str: string): string {
  return "/" + str;
}

function validateMethod(methodName: string): string {
  methodName = (methodName && methodName.toLocaleLowerCase()) || "get";
  const methods = ["post", "get", "put", "delete", "head", "options"];
  if (methods.includes(methodName)) {
    return methodName;
  }
  return "get";
}

function getConfig(rootDir: string): ConfigOptions {
  const configFilePath = path.join(rootDir, "..", ".mockrc");
  if (!isFile(configFilePath)) return {};
  const config = toJSON(readFile(configFilePath));
  return config;
}

function getExtensionFrom(url: string): string {
  return url.includes(".") ? url.substring(url.lastIndexOf(".") + 1) : "";
}

export {
  readFile,
  isFile,
  isDirectory,
  toJSON,
  throughDir,
  generateRouteFromFile,
  objToArray,
  setRelativePath,
  addSlashAtFirst,
  validateMethod,
  getConfig,
  getExtensionFrom,
};
