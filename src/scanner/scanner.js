import fs from "node:fs";
import path from "node:path";

const ignoredDirectories = new Set([".git", "node_modules", ".next"]);
function scanDirectory(directoryPath, repositoryPath) {
  const files = [];
  let directoryCount = 0;
  const entries = fs.readdirSync(directoryPath); // give file and folder name of current position directory

  for (const entry of entries) {
    const fullPath = path.join(directoryPath, entry);

    const stats = fs.statSync(fullPath); // Get information about the file or directory
    if (stats.isDirectory()) {
      if (ignoredDirectories.has(entry)) {
        continue;
      }
      const nestedResult = scanDirectory(fullPath, repositoryPath);

      files.push(...nestedResult.files);
      directoryCount += 1 + nestedResult.directoryCount;
    } else if (stats.isFile()) {
      const relativePath = path
        .relative(repositoryPath, fullPath)
        .split(path.sep)
        .join("/"); // Get the relative path

      const depth = relativePath.split("/").length - 1; // Get the depth of the file in the repository

      const content = fs.readFileSync(fullPath, "utf8"); // for read file
      const lineCount = content.split("\n").length; //a basic physical line count.It counts: blank lines, comments, code as line

      files.push({
        path: relativePath,
        extension: path.extname(fullPath),
        size: stats.size,
        depth,
        lineCount,
      });
    }
  }
  return {
    files,
    directoryCount,
  };
}

// function that for find main folder means root folder
function getRootDirectories(directoryPath) {
  const directories = [];
  const entries = fs.readdirSync(directoryPath);

  for (const entry of entries) {
    const fullPath = path.join(directoryPath, entry);

    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      if (ignoredDirectories.has(entry)) {
        continue;
      }
      directories.push(entry);
    }
  }
  return directories;
}

// get root files
function getRootFiles(directoryPath) {
  const files = [];

  const entries = fs.readdirSync(directoryPath);

  for (const entry of entries) {
    const fullPath = path.join(directoryPath, entry);

    const stats = fs.statSync(fullPath);

    if (stats.isFile()) {
      files.push(entry);
    }
  }

  return files;
}

export { scanDirectory, getRootDirectories, getRootFiles };
