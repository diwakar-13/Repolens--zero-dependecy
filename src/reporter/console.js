function printReport({
  files,
  directoryCount,
  totalSize,
  totalLines,
  languageCounts,
  unknownFileCount,
  rootDirectories,
  detectedStructureSignals,
  startCommand,
  javascriptEcosystem,
  pythonEcosystem,
  javaEcosystem,
  cppEcosystem,
  possibleEntryPoints,
  largestFiles,
  javascriptAnalysis,
  pythonAnalysis,
  cppAnalysis,
}) {
  console.log("\nRepository Summary");
  console.log("------------------");

  console.log("Files:", files.length);
  console.log("Directories:", directoryCount);
  console.log("Total size:", formatBytes(totalSize));
  console.log("Total lines:", totalLines);

  // Languages
  console.log("\nLanguages");
  console.log("---------");

  const sortedLanguages = Object.entries(languageCounts).sort(
    (a, b) => b[1] - a[1],
  );

  for (const [language, count] of sortedLanguages) {
    console.log(`${language}: ${count}`);
  }

  if (unknownFileCount > 0) {
    console.log("Unknown files:", unknownFileCount);
  }

  // Project Structure
  console.log("\nProject Structure");
  console.log("-----------------");

  if (rootDirectories.length > 0) {
    console.log("Root directories:", rootDirectories.join(", "));
  }

  for (const item of detectedStructureSignals.slice(0, 5)) {
    console.log(`${item.path} → ${item.signal}`);
  }

  // Project Configuration
  if (startCommand) {
    console.log("\nProject Configuration");
    console.log("---------------------");
    console.log("Start command:", startCommand);
  }

  // Project Ecosystem
  const frameworks = [
    ...javascriptEcosystem.frameworks,
    ...pythonEcosystem.frameworks,
    ...javaEcosystem.frameworks,
  ];

  const libraries = [...javascriptEcosystem.libraries];

  const buildTools = [...javaEcosystem.buildTools, ...cppEcosystem.buildTools];

  if (frameworks.length > 0 || libraries.length > 0 || buildTools.length > 0) {
    console.log("\nProject Ecosystem");
    console.log("-----------------");

    if (frameworks.length > 0) {
      console.log("Frameworks:", frameworks.join(", "));
    }

    if (libraries.length > 0) {
      console.log("Libraries:", libraries.join(", "));
    }

    if (buildTools.length > 0) {
      console.log("Build Tools:", buildTools.join(", "));
    }
  }

  // Entry Points
  if (possibleEntryPoints.length > 0) {
    console.log("\nEntry Points");
    console.log("------------");

    for (const entry of possibleEntryPoints.slice(0, 5)) {
      console.log(`${entry.path} - score: ${entry.score}`);
    }

    if (possibleEntryPoints.length > 5) {
      console.log(`... and ${possibleEntryPoints.length - 5} more`);
    }
  }

  // Language Analysis
  if (
    javascriptAnalysis.length > 0 ||
    pythonAnalysis.length > 0 ||
    cppAnalysis.length > 0
  ) {
    console.log("\nLanguage Analysis");
    console.log("-----------------");

    if (javascriptAnalysis.length > 0) {
      const importCount = javascriptAnalysis.reduce(
        (total, file) => total + file.imports.length,
        0,
      );

      const exportCount = javascriptAnalysis.reduce(
        (total, file) => total + file.exports.length,
        0,
      );

      const resolvedCount = javascriptAnalysis.reduce(
        (total, file) =>
          total + file.imports.filter((item) => item.resolvedPath).length,
        0,
      );

      const unresolvedCount = importCount - resolvedCount;

      console.log("JavaScript");
      console.log("  Files analyzed:", javascriptAnalysis.length);
      console.log("  Imports:", importCount);
      console.log("  Resolved:", resolvedCount);
      console.log("  Unresolved:", unresolvedCount);
      console.log("  Exports:", exportCount);
    }

    if (pythonAnalysis.length > 0) {
      const importCount = pythonAnalysis.reduce(
        (total, file) => total + file.imports.length,
        0,
      );

      const resolvedCount = pythonAnalysis.reduce(
        (total, file) =>
          total + file.imports.filter((item) => item.resolvedPath).length,
        0,
      );

      const unresolvedCount = importCount - resolvedCount;

      console.log("Python");
      console.log("  Files analyzed:", pythonAnalysis.length);
      console.log("  Imports:", importCount);
      console.log("  Resolved:", resolvedCount);
      console.log("  Unresolved:", unresolvedCount);
    }

    if (cppAnalysis.length > 0) {
      const includeCount = cppAnalysis.reduce(
        (total, file) => total + file.includes.length,
        0,
      );

      const resolvedCount = cppAnalysis.reduce(
        (total, file) =>
          total + file.includes.filter((item) => item.resolvedPath).length,
        0,
      );

      const unresolvedCount = cppAnalysis.reduce(
        (total, file) =>
          total + file.includes.filter((item) => !item.resolvedPath).length,
        0,
      );

      console.log("C/C++");
      console.log("  Files analyzed:", cppAnalysis.length);
      console.log("  Includes:", includeCount);
      console.log("  Resolved:", resolvedCount);
      console.log("  Unresolved:", unresolvedCount);
    }
  }
  // Largest Files
  if (largestFiles.length > 0) {
    console.log("\nLargest Files");
    console.log("-------------");

    for (const file of largestFiles.slice(0, 3)) {
      console.log(`${file.path} - ${formatBytes(file.size)}`);
    }
  }
}

function formatBytes(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export { printReport };
