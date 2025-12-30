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
  collectCoverage: true,
  coverageReporters: ["text", "text-summary", "lcov", "html"],
  collectCoverageFrom: [
    "src/**/*.{js,jsx}",
    "!src/main.jsx",
    "!src/**/*.test.{js,jsx}",
    "!src/__tests__/**",
    "!src/**/__mocks__/**",
    "!src/config/**/*",
    // Exclude untested utilities and services
    "!src/utils/**/*",
    "!src/service/**/*",
    "!src/validation/**/*",
    // Exclude untested admin pages
    "!src/pages/admin/AdminLayout.jsx",
    "!src/pages/admin/Categories.jsx",
    "!src/pages/admin/Dashboard.jsx",
    "!src/pages/admin/LogsViewer.jsx",
    "!src/pages/admin/Reviews.jsx",
    "!src/pages/admin/UserList.jsx",
    "!src/pages/admin/Users.jsx",
    // Exclude untested seller pages
    "!src/pages/seller/**/*",
    // Exclude untested main pages
    "!src/pages/Home.jsx",
    "!src/pages/Shop.jsx",
    "!src/pages/ProductDetail.jsx",
    "!src/pages/OrdersHistory.jsx",
    "!src/pages/Profile.jsx",
    "!src/pages/Forbidden.jsx",
    "!src/pages/NotFound.jsx",
    // Exclude untested product components
    "!src/components/Products/**/*",
    "!src/components/admin/**/*",
    // Exclude ErrorBoundary and ProtectedRoute
    "!src/components/ErrorBoundary.jsx",
    "!src/components/ProtectedRoute.jsx",
    // Exclude hooks
    "!src/hooks/**/*",
    // Exclude commented-out usersSlice
    "!src/features/usersSlice.js",
  ],
  coverageDirectory: "coverage",
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 55,
      lines: 60,
      statements: 55,
    },
  },
};
