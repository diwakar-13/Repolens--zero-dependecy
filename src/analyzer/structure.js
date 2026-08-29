import fs from "node:fs";
import path from "node:path";

const ignoredDirectories = new Set([".git", "node_modules", ".next"]);

const structureSignals = {
  src: "Source code",
  test: "Testing",
  tests: "Testing",
  utils: "Utility functions",
  controllers: "Possible controller layer",
  services: "Possible service layer",
  models: "Possible data/model layer",
  routes: "Possible routing layer",
  components: "Possible UI component layer",
};

// get folder possbile entry points mean what is does
function findStructureSignals(directoryPath, repositoryPath) {
  const signals = [];

  const entries = fs.readdirSync(directoryPath);

  for (const entry of entries) {
    const fullPath = path.join(directoryPath, entry);

    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      if (ignoredDirectories.has(entry)) {
        continue;
      }
      const signal = structureSignals[entry];

      if (signal) {
        const relativePath = path
          .relative(repositoryPath, fullPath)
          .split(path.sep)
          .join("/");

        signals.push({
          path: relativePath,
          signal,
        });
      }

      const nestedSignals = findStructureSignals(fullPath, repositoryPath);
      signals.push(...nestedSignals);
    }
  }

  return signals;
}

export { findStructureSignals };
