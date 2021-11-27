const fs = require("fs");
const p = require("path");
// const commandLineArgs = require('command-line-args')

function isFileTypeJSON(fileName){
    return fileName && fileName.endsWith(".json")
}

function throughDir(source) {
  const files = [];
  function readDirSync(sourcePath) {
    const filesInCurrentDir = fs.readdirSync(sourcePath);
    filesInCurrentDir.forEach((item) => {
      const itemWithAbsolutePath = p.join(sourcePath, item);
      if (isDir(itemWithAbsolutePath)) readDirSync(itemWithAbsolutePath);
      else if(isFileTypeJSON(itemWithAbsolutePath))files.push(itemWithAbsolutePath);
    });
  }
  readDirSync(source)
  return files
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
    return stat.isDirectory();
  } catch (e) {
    return false;
  }
}

function readFile(path) {
  if (!isFile(path)) return;
  const data = fs.readFileSync(path);
  return data.toString();
}

const toJSON = JSON.stringify;

// function getArgs () {
// return commandLineArgs([{
//     name: 'port', type: Number, defaultOption: 8080
// },{
//     name: 'source', type: String, defaultOption: '.', alias: 'sourceFile'
// }])
// }

module.exports = {
  // getArgs,
  readFile,
  isFile,
  isDir,
  toJSON,
  throughDir,
};
