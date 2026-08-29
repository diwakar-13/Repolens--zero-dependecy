import { resolveRelativeImport } from "./src/analyzer/resolver.js";

const result = resolveRelativeImport(
  "C:/Users/diwak/Desktop/Next.js/socially/src/app/page.js",
  "../actions/postAction.js",
);

console.log(result);