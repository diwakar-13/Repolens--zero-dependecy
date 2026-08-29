import fs from "node:fs";
import path from "node:path";

const extensions = [".js", ".jsx", ".ts", ".tsx", ".py", ".java", ".cpp", ".c"];

function resolveFile(candidatePath) {
  if (fs.existsSync(candidatePath) && fs.statSync(candidatePath).isFile()) {
    return candidatePath;
  }

  for (const extension of extensions) {
    const filePath = candidatePath + extension;

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      return filePath;
    }
  }

  return null;
}

function resolveDirectory(candidatePath) {
  if (
    !fs.existsSync(candidatePath) ||
    !fs.statSync(candidatePath).isDirectory()
  ) {
    return null;
  }

  for (const extension of extensions) {
    const indexPath = path.join(candidatePath, `index${extension}`);

    if (fs.existsSync(indexPath) && fs.statSync(indexPath).isFile()) {
      return indexPath;
    }
  }

  return null;
}

function resolveImport(importerPath, importPath) {
  if (!importPath.startsWith(".")) {
    return null;
  }

  const importerDirectory = path.dirname(importerPath);

  const candidatePath = path.resolve(importerDirectory, importPath);

  const file = resolveFile(candidatePath);

  if (file) {
    return file;
  }

  return resolveDirectory(candidatePath);
}

export { resolveImport };
