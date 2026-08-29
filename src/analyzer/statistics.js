function analyzeStatistics(files) {
  // Count how many files have each extension.
  const extensionCounts = {};
  let totalSize = 0;
  let totalLines = 0;

  for (const file of files) {
    const extension = file.extension || file.path;
    if (extensionCounts[extension]) {
      extensionCounts[extension]++;
    } else {
      extensionCounts[extension] = 1;
    }

    totalSize += file.size; // Add the size of all files to get the total repository size.
    totalLines += file.lineCount; // count total lines
  }

  const largestFiles = [...files].sort((a, b) => b.size - a.size).slice(0, 3); //  3 top Largest files

  return {
    extensionCounts,
    totalSize,
    totalLines,
    largestFiles,
  };
}

export { analyzeStatistics };
