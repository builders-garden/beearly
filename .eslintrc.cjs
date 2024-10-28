/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ["next", "prettier"],
  rules: {
    "@next/next/no-img-element": "off",
  },
};
