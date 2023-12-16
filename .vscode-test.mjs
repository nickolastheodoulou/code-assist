import { defineConfig } from "@vscode/test-cli";

export default defineConfig({
  mocha: {
    ui: 'bdd',
    timeout: 20000
  },
  files: "out/integration-tests/**/*.test.js",
});
