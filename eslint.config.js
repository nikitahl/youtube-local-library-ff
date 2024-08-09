import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        es6: true,
        node: true,
        browser: true,
        document: 'readonly',
        window: 'readonly',
        console: 'readonly',
        chrome: 'readonly'
      }
    },
    rules: {
      semi: [ 'error', 'always' ],
      'comma-dangle': [ 'error', 'never' ],
      quotes: [ 'error', 'single' ],
      indent: [ 'error', 2 ],
      'arrow-parens': [ 'error', 'as-needed' ],
      'object-curly-spacing': [ 'error', 'always' ],
      'array-bracket-spacing': [ 'error', 'always' ]
    }
  }
];
