import path from "node:path";

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
