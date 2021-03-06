//require('@babel/polyfill')
require('@babel/register')({
  plugins: ['dynamic-import-node'],
});

//require('./ignore');
const alias = require('../alias');
require('node-require-alias').setAlias(alias);

//解决样式报错问题
require('css-modules-require-hook')({
  extensions: ['.css'],
  generateScopedName: '[name]__[local]-[hash:base64:8]',
});

require('./server');
