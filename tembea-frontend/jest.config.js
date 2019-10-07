const esModules = ['[@agm/core]'].join('|');

module.exports = {
  globals: {
    "ts-jest": {
      "allowSyntheticDefaultImports": true
    }
  },
  transformIgnorePatterns: [`<rootDir>/node_modules/(?!@agm/core)`],
  "transform": {
    "^.+\\.(ts|js|html)$": "<rootDir>/node_modules/jest-preset-angular/preprocessor.js",
    "^.+\\.js$": "babel-jest"
  }
}
