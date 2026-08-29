import fs from "node:fs";
import path from "node:path";

function detectJavaScriptEcosystem(packageJson) {
  if (!packageJson) {
    return {
      frameworks: [],
      libraries: [],
    };
  }

  const dependencies = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };

  const frameworks = [];
  const libraries = [];

  if (dependencies.next) {
    frameworks.push("Next.js");
  }

  if (dependencies.express) {
    frameworks.push("Express");
  }

  if (dependencies["@nestjs/core"]) {
    frameworks.push("NestJS");
  }

  if (dependencies["@angular/core"]) {
    frameworks.push("Angular");
  }

  if (dependencies.vue) {
    frameworks.push("Vue");
  }

  if (dependencies.react) {
    libraries.push("React");
  }

  return {
    frameworks,
    libraries,
  };
}

function detectPythonEcosystem(repositoryPath) {
  const frameworks = [];
  const packageFiles = [];

  const requirementsPath = path.join(repositoryPath, "requirements.txt");

  const pyprojectPath = path.join(repositoryPath, "pyproject.toml");

  let content = "";

  if (fs.existsSync(requirementsPath)) {
    packageFiles.push("requirements.txt");
    content += fs.readFileSync(requirementsPath, "utf8");
  }

  if (fs.existsSync(pyprojectPath)) {
    packageFiles.push("pyproject.toml");
    content += fs.readFileSync(pyprojectPath, "utf8");
  }

  if (content.includes("django")) {
    frameworks.push("Django");
  }

  if (content.includes("flask")) {
    frameworks.push("Flask");
  }

  if (content.includes("fastapi")) {
    frameworks.push("FastAPI");
  }

  return {
    frameworks,
    packageFiles,
  };
}

function detectJavaEcosystem(repositoryPath) {
  const frameworks = [];
  const buildTools = [];

  const pomPath = path.join(repositoryPath, "pom.xml");
  const gradlePath = path.join(repositoryPath, "build.gradle");
  const gradleKtsPath = path.join(repositoryPath, "build.gradle.kts");

  let content = "";

  if (fs.existsSync(pomPath)) {
    buildTools.push("Maven");
    content += fs.readFileSync(pomPath, "utf8").toLowerCase();
  }

  if (fs.existsSync(gradlePath)) {
    buildTools.push("Gradle");
    content += fs.readFileSync(gradlePath, "utf8").toLowerCase();
  }

  if (fs.existsSync(gradleKtsPath)) {
    buildTools.push("Gradle");
    content += fs.readFileSync(gradleKtsPath, "utf8").toLowerCase();
  }

  if (
    content.includes("spring-boot") ||
    content.includes("springframework.boot")
  ) {
    frameworks.push("Spring Boot");
  }

  return {
    frameworks,
    buildTools,
  };
}
function detectCppEcosystem(repositoryPath) {
  const buildTools = [];

  const cmakePath = path.join(repositoryPath, "CMakeLists.txt");
  const makefilePath = path.join(repositoryPath, "Makefile");

  if (fs.existsSync(cmakePath)) {
    buildTools.push("CMake");
  }

  if (fs.existsSync(makefilePath)) {
    buildTools.push("Make");
  }

  return {
    buildTools,
  };
}
export {
  detectJavaScriptEcosystem,
  detectPythonEcosystem,
  detectJavaEcosystem,
  detectCppEcosystem,
};
