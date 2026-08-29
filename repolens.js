import path from "node:path";
import fs from "node:fs";

import {
  getRootDirectories,
  getRootFiles,
  scanDirectory,
} from "./src/scanner/scanner.js";
import { printReport } from "./src/reporter/console.js";
import { analyzeStatistics } from "./src/analyzer/statistics.js";
import { detectLanguages } from "./src/analyzer/language.js";
import { findStructureSignals } from "./src/analyzer/structure.js";
import {
  getPackageConfiguration,
  readPackageJson,
} from "./src/analyzer/package.js";
import {
  detectCppEcosystem,
  detectJavaEcosystem,
  detectJavaScriptEcosystem,
  detectPythonEcosystem,
} from "./src/analyzer/ecosystem.js";
import { findEntryPoints } from "./src/analyzer/entryPoint.js";
import { analyzePythonFiles } from "./src/analyzer/python.js";
import { analyzeCppFiles } from "./src/analyzer/cpp.js";
import { analyzeJavaScriptFiles } from "./src/analyzer/imports.js";

const repositoryInput = process.argv[2]; // Get the repository path from the command line

if (!repositoryInput) {
  console.error("Please provide a repository path.");
  process.exit(1);
}

const repositoryPath = path.resolve(repositoryInput);
console.log("Repository:", repositoryPath);

// existsync check the path is exist or not it return true or false
if (!fs.existsSync(repositoryPath)) {
  console.error("Repository path does not exist.");
  process.exit(1);
}

// Check if the repository path is a directory
const repositoryStats = fs.statSync(repositoryPath);

if (!repositoryStats.isDirectory()) {
  console.error("Repository path must be a directory.");
  process.exit(1);
}

// get from from scanner.js scan directory
const scanResult = scanDirectory(repositoryPath, repositoryPath);
const files = scanResult.files;
const directoryCount = scanResult.directoryCount;
const rootDirectories = getRootDirectories(repositoryPath);
const rootFiles = getRootFiles(repositoryPath);

// for statistics comes from statistics.js
const statistics = analyzeStatistics(files);
const extensionCounts = statistics.extensionCounts;
const totalSize = statistics.totalSize;
const totalLines = statistics.totalLines;
const largestFiles = statistics.largestFiles;

// for language detect language.js
const languageResult = detectLanguages(files);
const languageCounts = languageResult.languageCounts;
const unknownFileCount = languageResult.unknownFileCount;

// check what is language
const hasJavaScript = languageCounts.JavaScript > 0;
const hasPython = languageCounts.Python > 0;
const hasCpp = languageCounts["C++"] > 0 || languageCounts.C > 0;

// get from from structure.js
const detectedStructureSignals = findStructureSignals(
  repositoryPath,
  repositoryPath,
);

// for package.json extract
const packageJson = readPackageJson(repositoryPath);
const packageConfig = getPackageConfiguration(packageJson);
const startCommand = packageConfig.startCommand;
const configuredEntryPoint = packageConfig.configuredEntryPoint;

// ecosystems
const javascriptEcosystem = detectJavaScriptEcosystem(packageJson);
const pythonEcosystem = hasPython
  ? detectPythonEcosystem(repositoryPath)
  : {
      frameworks: [],
      packageFiles: [],
    };
const javaEcosystem = detectJavaEcosystem(repositoryPath);
const cppEcosystem = detectCppEcosystem(repositoryPath);

// for entry point comes from entryPoint.js
const possibleEntryPoints = findEntryPoints(
  files,
  configuredEntryPoint,
  javascriptEcosystem,
);

// Lightweight parsing
const javascriptAnalysis = hasJavaScript
  ? analyzeJavaScriptFiles(files, repositoryPath)
  : [];

const pythonAnalysis = hasPython
  ? analyzePythonFiles(files, repositoryPath)
  : [];

const cppAnalysis = hasCpp ? analyzeCppFiles(files, repositoryPath) : [];

// output
printReport({
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
});
