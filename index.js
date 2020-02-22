//!/bin/env node
// eslint-disable-next-line no-global-assign
require = require('esm')(module)
const { setup, listen } = require('./server/main.js')

setup().then(listen)
