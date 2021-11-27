const fs = require("fs");
const path = require("path");
// const commandLineArgs = require('command-line-args')

function isFileTypeMockJSON(fileName) {
  return fileName && fileName.endsWith(".mock.json");
}

function throughDir(source) {
  const files = [];
  function readDirSync(sourcePath) {
    const filesInCurrentDir = fs.readdirSync(sourcePath);
    filesInCurrentDir.forEach((item) => {
      const itemWithAbsolutePath = path.join(sourcePath, item);
      if (isDir(itemWithAbsolutePath)) readDirSync(itemWithAbsolutePath);
      else if (isFileTypeMockJSON(itemWithAbsolutePath))
        files.push(itemWithAbsolutePath);
    });
  }
  readDirSync(source);
  return files;
}

function isDir(path) {
  try {
    var stat = fs.lstatSync(path);
    return stat.isDirectory();
  } catch (e) {
    return false;
  }
}

function isFile(path) {
  try {
    var stat = fs.lstatSync(path);
    return stat.isFile();
  } catch (e) {
    return false;
  }
}

function readFile(path) {
  if (!isFile(path)) return;
  const data = fs.readFileSync(path);
  return data.toString();
}

const toJSON = JSON.parse;


function splitAndTakeLast(item, delimiter = "/mocks/") {
  return item.split(delimiter)[1];
}

function generateRouteFromFile(item) {
  return splitAndTakeLast(item).replace(".mock.json", "");
}

function objToArray(obj) {
  const headerKey = Object.keys(obj)[0];
  const headerValue = obj[headerKey];
  return [headerKey, headerValue];
}

function setRelativePath(fileName) {
  return path.join(__dirname, "../..", fileName);
}

function addSlashAtFirst(str) {
  return "/" + str;
}

function validateMethod(methodName) {
  methodName = (methodName && methodName.toLocaleLowerCase()) || "get";
  const methods = ["post", "get", "put", "delete", "head", "options"];
  if (methods.includes(methodName)) {
    return methodName;
  }
  return;
}



function getConfig(rootDir){
  const configFilePath = path.join(rootDir, "..", ".mockrc")
  if(!isFile(configFilePath)) return {}
  const config = toJSON(readFile(configFilePath))
  return config
}

module.exports = {
  readFile,
  isFile,
  isDir,
  toJSON,
  throughDir,
  generateRouteFromFile,
  objToArray,
  setRelativePath,
  addSlashAtFirst,
  validateMethod,
  getConfig
};
