module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ["plugin:vue/essential", "eslint:recommended", "@vue/prettier"],
  parserOptions: {
    parser: "babel-eslint",
  },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-unused-vars": "warn",
    "vue/no-unused-vars":"warn",
    "vue/no-unused-components": "warn",
    'no-unreachable': "warn",
    "prettier/prettier": [
      "error",
      {
        endOfLine: "auto",
        // lintOnSave:false
      },
    ],
  },
};
