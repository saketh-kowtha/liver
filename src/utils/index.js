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

// function getArgs () {
// return commandLineArgs([{
//     name: 'port', type: Number, defaultOption: 8080
// },{
//     name: 'source', type: String, defaultOption: '.', alias: 'sourceFile'
// }])
// }

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

function logger(req, res, next) {
  const end = res.end;
  res.end = function (...args) {
    console.log(`${req.url} ${req.method} ${res.statusCode}`);
    res.end = end
    res.end(...args)
  };
  next();
}

module.exports = {
  // getArgs,
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
  logger,
};
