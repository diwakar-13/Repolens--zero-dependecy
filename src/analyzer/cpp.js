import fs from "node:fs";
import path from "node:path";

function extractCppIncludes(content) {
  const includes = [];

  const pattern = /^\s*#include\s*[<"]([^>"]+)[>"]/gm;

  for (const match of content.matchAll(pattern)) {
    includes.push(match[1]);
  }

  return includes;
}

function analyzeCppFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");

  return extractCppIncludes(content);
}

function analyzeCppFiles(files, repositoryPath) {
  const results = [];

  for (const file of files) {
    if (
      file.extension === ".cpp" ||
      file.extension === ".c" ||
      file.extension === ".h" ||
      file.extension === ".hpp"
    ) {
      const fullPath = path.join(repositoryPath, file.path);

      const includes = analyzeCppFile(fullPath);

      results.push({
        path: file.path,
        includes,
      });
    }
  }

  return results;
}

export { extractCppIncludes, analyzeCppFile, analyzeCppFiles };
