import fs from "node:fs";
import path from "node:path";

const nodeEntryNames = ["index.js", "main.js", "app.js", "server.js"];

const pythonEntryNames = ["main.py", "app.py", "server.py", "manage.py"];

const javaEntryNames = ["Main.java", "Application.java"];

function findEntryPoints(files, configuredEntryPoint, ecosystem) {
  const possibleEntryPoints = [];

  const frameworks = ecosystem?.frameworks || [];
  const repositoryPath = ecosystem?.repositoryPath || "";

  const isNextJs = frameworks.includes("Next.js");

  for (const file of files) {
    const fileName = path.basename(file.path);

    // Next.js
    if (isNextJs) {
      if (/^(.+\/)?app\/page\.(js|jsx|ts|tsx)$/.test(file.path)) {
        possibleEntryPoints.push({
          path: file.path,
          score: 10,
        });
        continue;
      }

      if (/^(.+\/)?app\/layout\.(js|jsx|ts|tsx)$/.test(file.path)) {
        possibleEntryPoints.push({
          path: file.path,
          score: 9,
        });
        continue;
      }

      if (/^(.+\/)?app\/.*\/route\.(js|jsx|ts|tsx)$/.test(file.path)) {
        possibleEntryPoints.push({
          path: file.path,
          score: 8,
        });
        continue;
      }

      if (/^(.+\/)?middleware\.(js|ts)$/.test(file.path)) {
        possibleEntryPoints.push({
          path: file.path,
          score: 7,
        });
        continue;
      }
    }

    // Python
    if (file.extension === ".py" && pythonEntryNames.includes(fileName)) {
      let score = 5;

      if (file.depth === 0) {
        score += 2;
      }

      if (fileName === "manage.py") {
        score += 2;
      }

      if (file.path === configuredEntryPoint) {
        score += 3;
      }

      possibleEntryPoints.push({
        path: file.path,
        score,
      });

      continue;
    }

    // Java
    if (file.extension === ".java" && javaEntryNames.includes(fileName)) {
      let score = 5;

      if (file.depth === 0) {
        score += 2;
      }

      if (file.path === configuredEntryPoint) {
        score += 3;
      }

      possibleEntryPoints.push({
        path: file.path,
        score,
      });

      continue;
    }

    // C / C++
    if (
      file.extension === ".c" ||
      file.extension === ".cpp" ||
      file.extension === ".cc" ||
      file.extension === ".cxx"
    ) {
      const fullPath = path.join(repositoryPath, file.path);

      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, "utf8");

        if (/\bmain\s*\([^)]*\)/.test(content)) {
          possibleEntryPoints.push({
            path: file.path,
            score: 6,
          });

          continue;
        }
      }
    }

    // Generic Node.js
    if (file.extension === ".js" && nodeEntryNames.includes(fileName)) {
      let score = 2;

      if (file.depth === 0) {
        score += 2;
      } else if (file.depth === 1) {
        score += 1;
      }

      if (file.path === configuredEntryPoint) {
        score += 3;
      }

      possibleEntryPoints.push({
        path: file.path,
        score,
      });
    }
  }

  possibleEntryPoints.sort((a, b) => b.score - a.score);

  return possibleEntryPoints;
}

export { findEntryPoints };
