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
}) {
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

  // largest file
  console.log("\nLargest Files");
  console.log("-------------");

  for (const file of largestFiles) {
    console.log(`${file.path} - ${file.size} bytes`);
  }
}

export { printReport };
