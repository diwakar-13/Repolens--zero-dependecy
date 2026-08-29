import path from "node:path";

const languageMap = {
  ".js": "JavaScript",
  ".jsx": "JavaScript",
  ".ts": "TypeScript",
  ".tsx": "TypeScript",
  ".py": "Python",
  ".java": "Java",
  ".cpp": "C++",
  ".c": "C",
  ".go": "Go",
  ".rs": "Rust",
  ".css": "CSS",
  ".html": "HTML",
  ".md": "Markdown",
  ".h": "C/C++",
  ".hpp": "C++",
};
const specialFiles = {
  Dockerfile: "Docker",
  Makefile: "Make",
  Jenkinsfile: "Jenkins",
  ".env": "Environment",
  ".json": "JSON",
};

function detectLanguages(files) {
  const languageCounts = {};
  let unknownFileCount = 0;

  for (const file of files) {
    const fileName = path.basename(file.path); // give file name of current position directory
    let language = languageMap[file.extension];

    // if it not match language then check for special files
    if (!language && specialFiles[fileName]) {
      language = specialFiles[fileName];
    }

    if (language) {
      if (languageCounts[language]) {
        languageCounts[language]++;
      } else {
        languageCounts[language] = 1;
      }
    } else {
      unknownFileCount++;
    }
  }
  return {
    languageCounts,
    unknownFileCount,
  };
}
export { detectLanguages };
