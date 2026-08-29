function printReport({
  files,
  directoryCount,
  totalSize,
  totalLines,
  extensionCounts,
  largestFiles,
  languageCounts,
  unknownFileCount,
  rootDirectories,
  rootFiles,
  detectedStructureSignals,
  startCommand,
  javascriptEcosystem,
  pythonEcosystem,
  javaEcosystem,
  cppEcosystem,
  possibleEntryPoints,
  javascriptAnalysis,
  pythonAnalysis,
  cppAnalysis,
}) {
  const hasEcosystem =
    javascriptEcosystem.frameworks.length > 0 ||
    javascriptEcosystem.libraries.length > 0 ||
    pythonEcosystem.frameworks.length > 0 ||
    javaEcosystem.frameworks.length > 0 ||
    javaEcosystem.buildTools.length > 0 ||
    cppEcosystem.buildTools.length > 0;

  // repo summary
  console.log("\nRepository Summary");
  console.log("------------------");

  console.log("Files:", files.length);
  console.log("Directories:", directoryCount);
  console.log("Total size:", totalSize, "bytes");
  console.log("Total lines:", totalLines);

  // extension count with sorted
  console.log("\nFile Types");
  console.log("----------");
  const sortedExtension = Object.entries(extensionCounts).sort(
    (a, b) => b[1] - a[1],
  );
  for (const [extension, count] of sortedExtension) {
    console.log(`${extension}: ${count}`);
  }

  // for sorted language and unknown files
  console.log("\nLanguages");
  console.log("---------");

  const sortedLanguage = Object.entries(languageCounts).sort(
    (a, b) => b[1] - a[1],
  );
  for (const [language, count] of sortedLanguage) {
    console.log(`${language}: ${count}`);
  }

  console.log("\nUnknown Files");
  console.log("-------------");
  console.log("Unknown:", unknownFileCount);

  // get root direcroris and files
  console.log("\nRoot Directories");
  console.log("----------------");
  for (const directory of rootDirectories) {
    console.log(directory);
  }

  console.log("\nRoot Files");
  console.log("----------");
  for (const file of rootFiles) {
    console.log(file);
  }

  // for strucuture signal
  console.log("\nStructure Signals");
  console.log("-----------------");

  for (const item of detectedStructureSignals) {
    console.log(`${item.path} → ${item.signal}`);
  }

  // project configuration
  console.log("\nProject Configuration");
  console.log("---------------------");

  if (startCommand) {
    console.log("Start command:", startCommand);
  } else {
    console.log("Start command: Not found");
  }

  // ecosystem
  if (hasEcosystem) {
    console.log("\nProject Ecosystem");
    console.log("-----------------");

    if (javascriptEcosystem.frameworks.length > 0) {
      console.log(
        "JavaScript Framework:",
        javascriptEcosystem.frameworks.join(", "),
      );
    }

    if (javascriptEcosystem.libraries.length > 0) {
      console.log(
        "JavaScript Libraries:",
        javascriptEcosystem.libraries.join(", "),
      );
    }

    if (pythonEcosystem.frameworks.length > 0) {
      console.log("Python Framework:", pythonEcosystem.frameworks.join(", "));
    }

    if (javaEcosystem.frameworks.length > 0) {
      console.log("Java Framework:", javaEcosystem.frameworks.join(", "));
    }

    if (javaEcosystem.buildTools.length > 0) {
      console.log("Java Build Tool:", javaEcosystem.buildTools.join(", "));
    }

    if (cppEcosystem.buildTools.length > 0) {
      console.log("C/C++ Build Tool:", cppEcosystem.buildTools.join(", "));
    }
  }

  // for entry points
  if (possibleEntryPoints.length > 0) {
    console.log("\nPossible Entry Points");
    console.log("---------------------");

    for (const entry of possibleEntryPoints) {
      console.log(`${entry.path} - score: ${entry.score}`);
    }
  }

  // analysis
  if (javascriptAnalysis.length > 0) {
    console.log("\nJavaScript Analysis");
    console.log("-------------------");

    for (const file of javascriptAnalysis) {
      console.log(`\n${file.path}`);

      console.log("  Imports:");
      if (file.imports.length > 0) {
        for (const item of file.imports) {
          console.log(`    - ${item}`);
        }
      } else {
        console.log("    None");
      }

      console.log("  Exports:");
      if (file.exports.length > 0) {
        for (const item of file.exports) {
          console.log(`    - ${item}`);
        }
      } else {
        console.log("    None");
      }
    }
  }

  if (pythonAnalysis.length > 0) {
    console.log("\nPython Analysis");
    console.log("----------------");

    for (const file of pythonAnalysis) {
      console.log(`\n${file.path}`);

      console.log("  Imports:");

      if (file.imports.length > 0) {
        for (const item of file.imports) {
          console.log(`    - ${item}`);
        }
      } else {
        console.log("    None");
      }
    }
  }
  if (cppAnalysis.length > 0) {
    console.log("\nC/C++ Analysis");
    console.log("----------------");

    for (const file of cppAnalysis) {
      console.log(`\n${file.path}`);

      console.log("  Includes:");

      if (file.includes.length > 0) {
        for (const item of file.includes) {
          console.log(`    - ${item}`);
        }
      } else {
        console.log("    None");
      }
    }
  }

  // largest file
  console.log("\nLargest Files");
  console.log("-------------");

  for (const file of largestFiles) {
    console.log(`${file.path} - ${file.size} bytes`);
  }
}

export { printReport };
