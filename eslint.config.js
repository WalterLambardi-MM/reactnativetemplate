const { FlatCompat } = require('@eslint/eslintrc');
const js = require('@eslint/js');

const compat = new FlatCompat({
  baseDirectory: process.cwd(),
  recommendedConfig: js.configs.recommended,
});

module.exports = [
  // mimic ESLintRC-style extends
  ...compat.extends('.eslintrc.cjs'),
];
