module.exports = require('nyc-build-helper').config.defaultWebpackConfig(
  __dirname,
  {
    copyOptions: [
      {from: 'src/css/monorail.css', to: 'css/'}
    ]
  }
)
