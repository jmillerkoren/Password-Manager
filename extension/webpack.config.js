const path = require('path');

module.exports = {
    entry: {
        popup: './src/popup.js',
        background: './src/background.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
    },
    optimization: {
        minimize: false
    }
};
