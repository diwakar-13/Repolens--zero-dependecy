import fs from "node:fs";
import path from "node:path";
import { resolveCppInclude } from "./resolver.js";

function extractCppIncludes(content) {
  const includes = [];

  const pattern =
    /^\s*#include\s*([<"])([^>"]+)[>"]/gm;

  for (const match of content.matchAll(pattern)) {
    includes.push({
      includePath: match[2],
      local: match[1] === '"',
    });
  }

  return includes;
}

function analyzeCppFile(filePath, repositoryPath) {
  const content = fs.readFileSync(filePath, "utf8");

  const includes = extractCppIncludes(content);

  return includes.map((item) => ({
    includePath: item.includePath,
    resolvedPath: item.local
      ? resolveCppInclude(
          filePath,
          item.includePath,
          repositoryPath,
        )
      : null,
  }));
}

function analyzeCppFiles(files, repositoryPath) {
  const results = [];

  for (const file of files) {
    if (
      file.extension !== ".cpp" &&
      file.extension !== ".c" &&
      file.extension !== ".h" &&
      file.extension !== ".hpp"
    ) {
      continue;
    }

    const fullPath = path.join(repositoryPath, file.path);

    const includes = analyzeCppFile(
      fullPath,
      repositoryPath,
    );

    results.push({
      path: file.path,
      includes,
    });
  }

  return results;
}

export {
  extractCppIncludes,
  analyzeCppFile,
  analyzeCppFiles,
};