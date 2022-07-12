require('dotenv').config()

module.exports = require('nyc-build-helper').config.defaultWebpackConfig(
  __dirname,
  {
    copyOptions: [{from: 'src/css/monorail.css', to: 'css/'}],
    replaceOptions: [{
      dir: 'dist/js',
      files: ['covid-testing.js'],
      rules: [{
        search: /MAPTILER_KEY/,
        replace: process.env.MAPTILER_KEY
      }]
    }]
  }
)
