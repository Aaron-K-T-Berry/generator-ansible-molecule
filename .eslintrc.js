module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true
  },
  plugins: ["prettier"],
  extends: ["prettier", "plugin:prettier/recommended"],
  parserOptions: {
    ecmaVersion: 2018
  },
  rules: {
    "prettier/prettier": "error"
  }
};
