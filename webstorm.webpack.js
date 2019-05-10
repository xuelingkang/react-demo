/**
 * 使webstorm能够识别webpack配置的别名，
 * File -> Settings -> Languages & Frameworks -> JavaScript -> Webpack
 */
'use strict'
const path = require('path')

function resolve(dir) {
    return path.join(__dirname, '.', dir)
}

module.exports = {
    context: path.resolve(__dirname, './'),
    resolve: {
        extensions: ['.js', '.jsx', '.json'],
        alias: {
            '@': resolve('src'),
            components: resolve('src/components'),
            assets: resolve('src/assets')
        }
    }
}
