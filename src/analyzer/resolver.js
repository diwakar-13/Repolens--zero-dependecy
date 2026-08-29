import fs from "node:fs";
import path from "node:path";

const javascriptExtensions = [".js", ".jsx", ".ts", ".tsx"];
const pythonExtensions = [".py"];
const cppExtensions = [".cpp", ".c", ".h", ".hpp"];

/* ---------------- JavaScript ---------------- */

function resolveJavaScriptFile(candidatePath) {
  if (isFile(candidatePath)) {
    return candidatePath;
  }

  for (const extension of javascriptExtensions) {
    const filePath = candidatePath + extension;

    if (isFile(filePath)) {
      return filePath;
    }
  }

  return null;
}

/* ---------------- Python ---------------- */

function resolvePythonFile(candidatePath) {
  if (isFile(candidatePath)) {
    return candidatePath;
  }

  const pythonFile = candidatePath + ".py";

  if (isFile(pythonFile)) {
    return pythonFile;
  }

  return resolvePythonDirectory(candidatePath);
}

function resolvePythonDirectory(candidatePath) {
  if (!isDirectory(candidatePath)) {
    return null;
  }

  const initPath = path.join(candidatePath, "__init__.py");

  if (isFile(initPath)) {
    return initPath;
  }

  return null;
}

function resolvePythonImport(importerPath, importPath, repositoryPath) {
  // Only relative Python imports are local dependencies.
  if (!importPath.startsWith(".")) {
    return null;
  }

  const importerDirectory = path.dirname(importerPath);

  let dots = 0;

  while (dots < importPath.length && importPath[dots] === ".") {
    dots++;
  }

  let baseDirectory = importerDirectory;

  // "." = current package
  // ".." = parent package
  // "..." = two levels up
  for (let i = 1; i < dots; i++) {
    baseDirectory = path.dirname(baseDirectory);
  }

  const modulePart = importPath.slice(dots);

  const candidatePath = modulePart
    ? path.resolve(baseDirectory, modulePart.replace(/\./g, path.sep))
    : baseDirectory;

  const resolved = resolvePythonFile(candidatePath);

  return normalizeRepositoryPath(resolved, repositoryPath);
}

/* ---------------- C / C++ ---------------- */

function resolveCppInclude(importerPath, includePath, repositoryPath) {
  // We only resolve quoted includes.
  // <iostream>, <vector>, etc. are external/system headers.
  if (!includePath || includePath.startsWith("<")) {
    return null;
  }

  const importerDirectory = path.dirname(importerPath);

  const candidatePath = path.resolve(importerDirectory, includePath);

  const resolved = resolveCppFile(candidatePath);

  return normalizeRepositoryPath(resolved, repositoryPath);
}

function resolveCppFile(candidatePath) {
  if (isFile(candidatePath)) {
    return candidatePath;
  }

  for (const extension of cppExtensions) {
    const filePath = candidatePath + extension;

    if (isFile(filePath)) {
      return filePath;
    }
  }

  return null;
}

/* ---------------- Generic helpers ---------------- */

function resolveFile(candidatePath) {
  if (isFile(candidatePath)) {
    return candidatePath;
  }

  const extensions = [
    ...javascriptExtensions,
    ...pythonExtensions,
    ...cppExtensions,
  ];

  for (const extension of extensions) {
    const filePath = candidatePath + extension;

    if (isFile(filePath)) {
      return filePath;
    }
  }

  return null;
}

function resolveDirectory(candidatePath) {
  if (!isDirectory(candidatePath)) {
    return null;
  }

  const indexExtensions = [
    ...javascriptExtensions,
    ...pythonExtensions,
    ...cppExtensions,
  ];

  for (const extension of indexExtensions) {
    const indexPath = path.join(candidatePath, `index${extension}`);

    if (isFile(indexPath)) {
      return indexPath;
    }
  }

  const pythonInit = path.join(candidatePath, "__init__.py");

  if (isFile(pythonInit)) {
    return pythonInit;
  }

  return null;
}

/* ---------------- Existing JavaScript resolver ---------------- */

function resolveImport(importerPath, importPath) {
  if (!importPath.startsWith(".")) {
    return null;
  }

  const importerDirectory = path.dirname(importerPath);

  const candidatePath = path.resolve(importerDirectory, importPath);

  const file = resolveJavaScriptFile(candidatePath);

  if (file) {
    return file;
  }

  return resolveDirectory(candidatePath);
}

/* ---------------- Helpers ---------------- */

function isFile(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  } catch {
    return false;
  }
}

function isDirectory(directoryPath) {
  try {
    return fs.statSync(directoryPath).isDirectory();
  } catch {
    return false;
  }
}

function normalizeRepositoryPath(filePath, repositoryPath) {
  if (!filePath) {
    return null;
  }

  return path.relative(repositoryPath, filePath).split(path.sep).join("/");
}

export {
  resolveFile,
  resolveDirectory,
  resolveImport,
  resolvePythonImport,
  resolveCppInclude,
};
