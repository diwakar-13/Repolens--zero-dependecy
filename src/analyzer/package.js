import fs from "node:fs";
import path from "node:path";

// extract package.json
function readPackageJson(repositoryPath) {
  const packageJsonPath = path.join(repositoryPath, "package.json");

  if (!fs.existsSync(packageJsonPath)) {
    return null;
  }

  const content = fs.readFileSync(packageJsonPath, "utf8");

  return JSON.parse(content);
}

function getPackageConfiguration(packageJson) {
  let startCommand = null;
  let configuredEntryPoint = null;

  if (packageJson?.scripts?.start) {
    startCommand = packageJson.scripts.start;
  }

  if (startCommand) {
    const parts = startCommand.split(" ");
    configuredEntryPoint = parts[parts.length - 1];
  }

  return {
    startCommand,
    configuredEntryPoint,
  };
}

export { readPackageJson, getPackageConfiguration };
