import path from "node:path";

// Common JavaScript / Node.js entry names
const entryPointNames = ["index.js", "main.js", "app.js", "server.js"];

function findEntryPoints(files, configuredEntryPoint, ecosystem) {
  const possibleEntryPoints = [];

  for (const file of files) {
    const fileName = path.basename(file.path);

    // Generic JavaScript entry points
    if (entryPointNames.includes(fileName)) {
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

    // Next.js App Router entry point
    if (
      ecosystem?.frameworks?.includes("Next.js") &&
      (file.path.endsWith("/app/page.js") ||
        file.path.endsWith("/app/page.jsx") ||
        file.path.endsWith("/app/page.ts") ||
        file.path.endsWith("/app/page.tsx"))
    ) {
      possibleEntryPoints.push({
        path: file.path,
        score: 6,
      });
    }
  }

  possibleEntryPoints.sort((a, b) => b.score - a.score);

  return possibleEntryPoints;
}

export { findEntryPoints };
