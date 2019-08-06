module.exports = {
   preset: "ts-jest",
   transform: {
      "^.+\\.js$": "babel-jest",
      "^.+\\.tsx?$": "ts-jest" // 'ts-jest' or 'babel-jest'
   },
   testEnvironment: "node",
   testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
   testPathIgnorePatterns: ["/lib/", "/node_modules/"],
   moduleDirectories: ["node_modules", "src"],
   // transformIgnorePatterns: ['<rootDir>/node_modules/(÷?!lodash-es)'], // '/!node_modules\\/lodash-es/'
   moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
   collectCoverage: true,
   coveragePathIgnorePatterns: ["/node_modules/"],
   moduleNameMapper: {
      "^lodash-es$": "lodash"
   }
};
