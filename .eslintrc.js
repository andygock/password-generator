module.exports = {
  env: {
    node: true,
    browser: true,
    mocha: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      arrowFunctions: true,
    },
  },
  extends: ['airbnb', 'prettier'],
  rules: {
    'comma-dangle': 0,
    'jsx-a11y/label-has-for': 0,
    'no-alert': 0,
    'no-console': 0, // remove this for production!
    'no-prototype-builtins': 0,
    'no-shadow': 0,
    'no-underscore-dangle': 0,
    'no-unused-vars': 0,
    'no-useless-constructor': 0,
    'prefer-destructuring': 0,
  },
  plugins: [],
};
