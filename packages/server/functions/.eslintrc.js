const path = require('path')

module.exports = {
  overrides: [
    {
      files: ['src/**/*'],
      extends: ['plugin:import/errors', 'plugin:import/warnings'],
      parserOptions: {
        project: path.resolve(__dirname, './tsconfig.json'),
      }
    }
  ]
}
