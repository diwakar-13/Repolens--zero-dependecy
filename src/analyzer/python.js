import fs from "node:fs";
import path from "node:path";
import { resolvePythonImport } from "./resolver.js";

function extractPythonImports(content) {
  const imports = [];

  const importPattern = /^\s*import\s+(.+)/gm;
  const fromPattern = /^\s*from\s+([.A-Za-z_][\w.]*)\s+import\s+/gm;

  for (const match of content.matchAll(importPattern)) {
    const names = match[1].split(",");

    for (const name of names) {
      const moduleName = name.trim().split(/\s+as\s+/)[0];

      if (moduleName) {
        imports.push(moduleName);
      }
    }
  }

  for (const match of content.matchAll(fromPattern)) {
    imports.push(match[1]);
  }

  return imports;
}

function analyzePythonFile(filePath, repositoryPath) {
  const content = fs.readFileSync(filePath, "utf8");

  const imports = extractPythonImports(content);

  return imports.map((importPath) => ({
    importPath,
    resolvedPath: resolvePythonImport(filePath, importPath, repositoryPath),
  }));
}

function analyzePythonFiles(files, repositoryPath) {
  const results = [];

  for (const file of files) {
    if (file.extension !== ".py") {
      continue;
    }

    const fullPath = path.join(repositoryPath, file.path);

    const imports = analyzePythonFile(fullPath, repositoryPath);

    results.push({
      path: file.path,
      imports,
    });
  }

  return results;
}

export { extractPythonImports, analyzePythonFile, analyzePythonFiles };
