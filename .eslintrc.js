module.exports = {
   extends: ["standard"],
   plugins: ["import", "react", "prettier", "jest", "jsdoc"],
   parser: "babel-eslint",
   rules: {
      semi: ["error", "never", { beforeStatementContinuationChars: "always" }],
      "no-unused-vars": [2, { varsIgnorePattern: "h" }],
      "linebreak-style": "off",
      "max-len": [2, 100, 4, { ignoreComments: true }],
      "react/jsx-uses-vars": 2,
      "jsdoc/check-examples": 1,
      "jsdoc/check-param-names": 1,
      "jsdoc/check-tag-names": 1,
      "jsdoc/check-types": 1,
      "jsdoc/newline-after-description": 1,
      "jsdoc/no-undefined-types": 1,
      "jsdoc/require-description": 1,
      "jsdoc/require-description-complete-sentence": 1,
      "jsdoc/require-example": 1,
      "jsdoc/require-hyphen-before-param-description": 1,
      "jsdoc/require-param": 1,
      "jsdoc/require-param-description": 1,
      "jsdoc/require-param-name": 1,
      // 'jsdoc/require-param-type': 1,
      // 'jsdoc/require-returns': 1,
      // 'jsdoc/require-returns-description': 1,
      // 'jsdoc/require-returns-type': 1,
      "jsdoc/valid-types": 1
   },
   settings: {
      jsdoc: {
         "settings.jsdoc.configFile": "jsdocs.conf.json"
      }
   },
   parserOptions: {
      allowImportExportEverywhere: true,
      ecmaFeatures: {
         jsx: true
      }
   },
   env: {
      node: true,
      "jest/globals": true
   }
};
