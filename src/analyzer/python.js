import fs from "node:fs";
import path from "node:path";

function extractPythonImports(content) {
  const imports = [];

  const importPattern = /^\s*import\s+(.+)/gm;
  const fromPattern = /^\s*from\s+([A-Za-z_][\w.]*)\s+import\s+/gm;

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

function analyzePythonFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");

  return extractPythonImports(content);
}

function analyzePythonFiles(files, repositoryPath) {
  const results = [];

  for (const file of files) {
    if (file.extension === ".py") {
      const fullPath = path.join(repositoryPath, file.path);

      const imports = analyzePythonFile(fullPath);

      results.push({
        path: file.path,
        imports,
      });
    }
  }

  return results;
}
export { extractPythonImports, analyzePythonFile, analyzePythonFiles };
