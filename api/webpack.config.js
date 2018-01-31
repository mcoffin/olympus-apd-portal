const path = require('path');

module.exports = {
    entry: '../ui/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'app.bundle.js',
    },
    module: {
        rules: [
            { test: /\.json$/, use: 'json-loader' },
        ],
    },
};
