export default {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/__tests__/setup.js"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/src/__tests__/__mocks__/fileMock.js",
    "^../config/axios$": "<rootDir>/src/__tests__/__mocks__/axios.js",
    "^../../config/axios$": "<rootDir>/src/__tests__/__mocks__/axios.js",
    "^../../../config/axios$": "<rootDir>/src/__tests__/__mocks__/axios.js",
  },
  transform: {
    "^.+\\.(js|jsx)$": ["babel-jest", { presets: ["@babel/preset-env", "@babel/preset-react"] }],
  },
  testMatch: ["**/__tests__/**/*.test.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
  testPathIgnorePatterns: ["/node_modules/", "/__mocks__/", "/setup.js", "test/chihaja.test.js"],
  collectCoverageFrom: [
    "src/**/*.{js,jsx}",
    "!src/main.jsx",
    "!src/**/*.test.{js,jsx}",
    "!src/__tests__/**",
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
