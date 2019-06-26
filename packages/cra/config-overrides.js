const path = require("path");

module.exports = function override(config, env) {
  // https://github.com/facebook/create-react-app/blob/a88a4c3af6b6b8557845f147604a098d2857a91a/packages/react-scripts/config/webpack.config.js#L356-L404
  const tsConfig = config.module.rules[2].oneOf[1];

  const packagesDir = path.resolve(__dirname, "..");
  const srcDir = path.resolve(__dirname, "./src");

  tsConfig.include = [srcDir, packagesDir];

  return config;
};
