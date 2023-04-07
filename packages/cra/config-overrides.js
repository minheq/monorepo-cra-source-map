const path = require("path");
const { babelInclude } = require("customize-cra");

module.exports = function override(config, env) {
  const packagesDir = path.resolve(__dirname, "..");
  const srcDir = path.resolve(__dirname, "./src");

  return babelInclude([srcDir, packagesDir])(config);
};
