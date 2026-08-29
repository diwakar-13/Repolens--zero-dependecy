import fs from "node:fs";
import path from "node:path";
import { resolveImport } from "./resolver.js";

function extractJavaScriptImports(content) {
  const imports = [];

  const fromPattern = /from\s+["'](.+?)["']/g;
  const sideEffectPattern = /import\s+["'](.+?)["']/g;
  const requirePattern = /require\s*\(\s*["'](.+?)["']\s*\)/g;

  for (const match of content.matchAll(fromPattern)) {
    imports.push(match[1]);
  }

  for (const match of content.matchAll(sideEffectPattern)) {
    imports.push(match[1]);
  }

  for (const match of content.matchAll(requirePattern)) {
    imports.push(match[1]);
  }

  return imports;
}

function extractJavaScriptExports(content) {
  const exports = [];

  const functionPattern =
    /export\s+(?:async\s+)?function\s+([A-Za-z_$][\w$]*)/g;

  for (const match of content.matchAll(functionPattern)) {
    exports.push(match[1]);
  }

  const namedExportPattern = /export\s*\{\s*([^}]+)\s*\}/g;

  for (const match of content.matchAll(namedExportPattern)) {
    const names = match[1].split(",");

    for (const name of names) {
      exports.push(name.trim());
    }
  }

  const moduleExportPattern = /module\.exports\s*=\s*([A-Za-z_$][\w$]*)/g;

  for (const match of content.matchAll(moduleExportPattern)) {
    exports.push(match[1]);
  }

  const exportsPattern = /exports\.([A-Za-z_$][\w$]*)\s*=/g;

  for (const match of content.matchAll(exportsPattern)) {
    exports.push(match[1]);
  }

  const defaultExportPattern = /export\s+default\s+([A-Za-z_$][\w$]*)/g;

  for (const match of content.matchAll(defaultExportPattern)) {
    exports.push(`default:${match[1]}`);
  }

  return exports;
}

function analyzeJavaScriptFile(filePath, repositoryPath) {
  const content = fs.readFileSync(filePath, "utf8");

  const imports = extractJavaScriptImports(content);
  const exports = extractJavaScriptExports(content);

  const resolvedImports = imports.map((importPath) => {
    const resolvedPath = resolveImport(filePath, importPath, repositoryPath);

    return {
      importPath,
      resolvedPath: resolvedPath
        ? path.relative(repositoryPath, resolvedPath).split(path.sep).join("/")
        : null,
    };
  });

  return {
    imports: resolvedImports,
    exports,
  };
}

function analyzeJavaScriptFiles(files, repositoryPath) {
  const results = [];

  for (const file of files) {
    if (file.extension !== ".js" && file.extension !== ".jsx") {
      continue;
    }

    const fullPath = path.join(repositoryPath, file.path);

    const analysis = analyzeJavaScriptFile(fullPath, repositoryPath);

    results.push({
      path: file.path,
      imports: analysis.imports,
      exports: analysis.exports,
    });
  }

  return results;
}

export {
  extractJavaScriptImports,
  analyzeJavaScriptFile,
  analyzeJavaScriptFiles,
  extractJavaScriptExports,
};
