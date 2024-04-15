const path = require('path')

module.exports = {
  overrides: [
    {
      files: ['src/**/*.ts', 'src/**/*.tsx', '*.ts'],
      extends: [
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:tailwindcss/recommended'
      ],
      parserOptions: {
        project: path.resolve(__dirname, './tsconfig.json'),
      },
      settings: {
        'import/resolver': {
          alias: {
            map: [
              ['~', path.resolve(__dirname, './src')]
            ],
            extensions: ['.*']
          },
          typescript: {
            alwaysTryTypes: true, // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`
            project: path.resolve(__dirname, './tsconfig.json')
          }
        },
        tailwindcss: {
          callees: ["cn", "cx", "cva", "twmerge"],
          config: path.resolve(__dirname, './tailwind.config.ts'),
          cssFiles: [
            path.resolve(__dirname, './src/**/*.css')
          ]
        }
      }
    }
  ]
}
