const path = require('path');

module.exports = function override(config) {
  config.resolve = {
    ...config.resolve,
    alias: { '@models': path.resolve(__dirname, 'src/models'),
    '@components': path.resolve(__dirname, 'src/components'),
    '@redux': path.resolve(__dirname, 'src/redux'),
    '@api': path.resolve(__dirname, 'src/api'),
    '@config': path.resolve(__dirname, 'src/config'),
    '@auth': path.resolve(__dirname, 'src/auth'),
    '@utils': path.resolve(__dirname, 'src/utils')
},
  };

  return config;
};