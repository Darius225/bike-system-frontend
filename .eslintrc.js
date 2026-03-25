module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
      'eslint:recommended',
      'plugin:react/recommended',
      'plugin:@typescript-eslint/recommended',
      'prettier', // Make sure this is the last in the extends array
    ],
    plugins: ['react', '@typescript-eslint', 'prettier'],
    rules: {
      'prettier/prettier': 'error', // Enforces Prettier formatting
    },
    settings: {
      react: {
        version: 'detect', // Automatically detects the React version
      },
    },
  };
  