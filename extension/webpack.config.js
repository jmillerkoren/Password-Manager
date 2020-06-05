const path = require('path');

module.exports = {
    entry: './src/popup.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    optimization: {
        minimize: false
    }
};
